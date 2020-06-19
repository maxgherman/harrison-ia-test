import { pool } from './pool'
import { Image, Label } from './entities'

export type ImageRepository = {
    getImageById(id: string): Promise<Image | null>
    getImages(): Promise<Image[]>
    createImage(
        fileName: string,
        status: string,
        labelsIds: string[]): Promise<{ id: number }>
    updateImage(id: string, status: string, labelsIds: string[]): Promise<unknown>
}

type DBImageRow = {
    id: string
    'file_name': string
    'status': string
    date: Date
    lblid: string
    lbltext: string
}

const imageLabelJoin =
    `SELECT img.ID, img.file_name, img.status, img.date,
        lbl.id as lblId, lbl.value as lbltext
    FROM images as img
    LEFT JOIN image_label as img_lbl on img_lbl.image_id = img.ID
    LEFT JOIN labels as lbl on lbl.id = img_lbl.label_id`

export const imageRepository = (): ImageRepository => ({
    getImageById: (id: string): Promise<Image | null> =>
        pool.query(`${imageLabelJoin} WHERE img.ID=$1`, [ id ])
        .then(({ rows }: { rows: DBImageRow[] }) => {
            if(rows.length <= 0) {
                return null
            }

            const row = rows[0]

            const labels = rows.reduce((acc, curr) => {
                acc[curr.lblid] = { id: curr.lblid, value: curr.lbltext }
                return acc
            }, <{ [key: string]: Label }>{ })

             return {
                id: row.id,
                fileName: row.file_name,
                status: row.status,
                date: row.date,
                labels
            }
        }),

    getImages: (): Promise<Image[]> =>
        pool.query(imageLabelJoin)
        .then(({ rows }: { rows: DBImageRow[] }) => {
            if(rows.length <= 0) {
                return []
            }

            const result = rows.reduce((acc, curr) => {

                const entry = acc.has(curr.id) ? acc.get(curr.id) : {
                    id: curr.id,
                    fileName: curr.file_name,
                    status: curr.status,
                    date: curr.date,
                    labels: {}
                }

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const nonEmpty = entry!

                acc.set(curr.id, nonEmpty)
                nonEmpty.labels[curr.lblid] = { id: curr.lblid, value: curr.lbltext }

                return acc

            }, new Map<string, Image>())

            return [...result.values()]
        }),

        createImage: async (
            fileName: string,
            status: string,
            labelsIds: string[]): Promise<{ id: number }> => {

            const client = await pool.connect()

            try {
                await client.query('BEGIN')
                const { rows } = await client.query('INSERT INTO images (file_name, status) VALUES ($1, $2) returning ID', [fileName, status])
                const { id } = rows[0]
                const items = labelsIds.map(labelId =>
                    client.query('INSERT INTO image_label VALUES ($1, $2)', [id, labelId]))
                await Promise.all(items)

                await client.query('COMMIT')
                return { id }
            } catch (e) {
                await client.query('ROLLBACK')
                throw e
            } finally {
                client.release()
            }
        },

        updateImage: async (id: string, status: string, labelsIds: string[]): Promise<unknown> => {

            const client = await pool.connect()

            try {
                await client.query('BEGIN')
                await client.query('UPDATE images SET status=$1 WHERE ID=$2', [status, id])
                await client.query('DELETE FROM image_label WHERE image_id=$1')

                const items = labelsIds.map(labelId =>
                    client.query('INSERT INTO image_label VALUES ($1, $2)', [id, labelId]))
                await Promise.all(items)

                await client.query('COMMIT')
                return { id }
            } catch (e) {
                await client.query('ROLLBACK')
                throw e
            } finally {
                client.release()
            }
        }
})
