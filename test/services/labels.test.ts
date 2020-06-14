import tap from 'tap'
import { labelService } from '../../src/services'
import { LabelRepository, Label } from '../../src/repositories'

tap.test('label-service', (test) => {
    const mockLabel: Label = {
        id: 'id',
        value: 'value',
    }

    const getMockRepository = (): LabelRepository => ({
        getLabelById: () => Promise.resolve(mockLabel),
        getLabels: () => Promise.resolve([]),
        createLabel: () => Promise.resolve({ id: 1 }),
        updateLabel: () => Promise.resolve()
    })

    tap.test('getLabelById should return user', (test) => {

        const mockRepository = getMockRepository()
        const service = labelService(mockRepository)

        return service.getLabelById('')
        .then(data => {
            test.ok(data.success)
            test.same(data.value, mockLabel)

            test.done()
        })
    })

    tap.test('getLabelById should return false when no label', (test) => {

        const mockRepository = getMockRepository()
        mockRepository.getLabelById = () => Promise.resolve(null as unknown as Label)
        const service = labelService(mockRepository)

        return service.getLabelById('')
        .then(data => {
            test.notOk(data.success)

            test.done()
        })
    })

    tap.test('getLabels should return labels', (test) => {

        const mockRepository = getMockRepository()
        mockRepository.getLabels = () => Promise.resolve([mockLabel])

        const service = labelService(mockRepository)

        return service.getLabels()
        .then(data => {
            test.same(data, [mockLabel])

            test.done()
        })
    })

    tap.test('createLabel should return label id', (test) => {

        const mockRepository = getMockRepository()
        mockRepository.createLabel = () => Promise.resolve({ id: 1 })

        const service = labelService(mockRepository)

        return service.createLabel('')
        .then(data => {
            test.same(data, { id: 1 })

            test.done()
        })
    })

    tap.test('updateLabel should resolve', (test) => {

        const mockRepository = getMockRepository()
        mockRepository.updateLabel = () => Promise.resolve()

        const service = labelService(mockRepository)

        return service.updateLabel('', '')
        .then(() => {
            test.done()
        })
    })

    test.done()
})
