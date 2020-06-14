import tap from 'tap'
import { imageService, FileStorageService } from '../../src/services'
import { ImageRepository, Image } from '../../src/repositories'

tap.test('label-service', (test) => {

    const mockImage: Image = {
        id: '1',
        fileName: 'file-name',
        status: 'status',
        date: new Date(),
        labels: {
            1: { id : '1', value: 'lbl-1'},
            2: { id : '2', value: 'lbl-2'},
            3: { id : '3', value: 'lbl-3'}
        }
    }

    const getMockRepository = (): ImageRepository => ({
        getImageById: () => Promise.resolve(mockImage),
        getImages: () => Promise.resolve([mockImage]),
        createImage: () => Promise.resolve({id: 1}),
        updateImage: () => Promise.resolve({ success: true })
    })

    const getMockFileStorage = (): FileStorageService => ({
        upload: () => Promise.resolve(''),
        download: () => Promise.resolve({ fileName: 'file-name', contents: Buffer.from('') })
    })

    tap.test('getImageById should return image', (test) => {

        const service = imageService(getMockRepository(), getMockFileStorage())

        return service.getImageById('')
        .then(data => {
            test.ok(data.success)
            test.same(data.value, mockImage)

            test.done()
        })
    })

    tap.test('getImageById should return false when no image', (test) => {

        const mockRepository = getMockRepository()
        mockRepository.getImageById = () => Promise.resolve(null as unknown as Image)
        const service = imageService(mockRepository, getMockFileStorage())

        return service.getImageById('')
        .then(data => {
            test.notOk(data.success)

            test.done()
        })
    })

    tap.test('getImages should return images', (test) => {

        const service = imageService(getMockRepository(), getMockFileStorage())

        return service.getImages()
        .then(data => {
            test.same(data, [mockImage])

            test.done()
        })
    })

    tap.test('createImage should return label id', (test) => {

        const service = imageService(getMockRepository(), getMockFileStorage())

        return service.createImage('file-name', new Buffer(''), 'init', [])
        .then(data => {
            test.same(data, { id: 1 })

            test.done()
        })
    })

    tap.test('updateImage should resolve', (test) => {

        const service = imageService(getMockRepository(), getMockFileStorage())

        return service.updateImage('', '')
        .then(() => {
            test.done()
        })
    })

    tap.test('getImageData should return file', (test) => {

        const mockFileContents = {
            fileName: 'file-name',
            contents: Buffer.from('123')
        }

        const mockFileStorage = getMockFileStorage()
        mockFileStorage.download = () => Promise.resolve(mockFileContents)
        const service = imageService(getMockRepository(), mockFileStorage)

        return service.getImageData('')
        .then(data => {
            test.ok(data.success)
            test.same(data.value, mockFileContents)
            test.done()
        })
    })

    test.done()
})
