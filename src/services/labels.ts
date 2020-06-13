import { LabelRepository, labelRepository } from '../repositories'
import { Label, Result } from './entities'

export type LabelService = {
    getLabelById(id: string): Promise<Result<Label>>
    getLabels(): Promise<Label[]>
    createLabel(value: string): Promise<{ id: number }>
    updateLabel(id: string, value: string): Promise<Result<Label>>
}

const getLabelById = (repository: LabelRepository) => ( id: string): Promise<Result<Label>> =>
    repository.getLabelById(id)
    .then(data => ({
        value: data,
        success: !!data
    }))

export const labelService = (repository: LabelRepository = labelRepository()): LabelService => {

    const labelById = getLabelById(repository)

    return {
        getLabelById: labelById,

        getLabels: ():Promise<Label[]> => repository.getLabels(),

        createLabel: (value: string): Promise<{ id: number }> =>
            repository.createLabel(value),

        updateLabel: (id: string, value: string): Promise<Result<Label>> =>
            labelById(id)
            .then(result => {
                if(!result.success) {
                    return {
                        success: false
                    }

                }

                return repository.updateLabel(id, value)
                .then(() => ({
                        value: { id, value },
                        success: true
                    }))
            })
    }
}
