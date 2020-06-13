import pg from 'pg'
import { databaseServer } from '../utils/environment'
import { Label } from './entities'

const Pool = pg.Pool
const pool = new Pool(databaseServer)

export type LabelRepository = {
    getLabelById(id: string): Promise<Label>
    getLabels(): Promise<Label[]>
    createLabel(value: string): Promise<{ id: number }>
    updateLabel(id: string, value: string): Promise<void>
}

export const labelRepository = (): LabelRepository => ({

    getLabelById: (id: string): Promise<Label> =>
        pool.query('SELECT id, value FROM labels where id=$1', [ id ])
        .then(({ rows }) => rows[0]),

    getLabels: (): Promise<Label[]> =>
        pool.query('SELECT id, value FROM labels')
        .then(({ rows }) => rows),

    createLabel: (value: string): Promise<{ id: number }> =>
        pool.query('INSERT INTO labels (value) VALUES ($1) returning ID', [ value ])
        .then(({ rows }) => { console.log(rows); return rows[0] }),

    updateLabel: (id: string, value: string): Promise<void> =>
        pool.query('UPDATE labels SET value = $1 where id=$2', [ value, id ])
        .then(({ rows }) => rows[0])
})
