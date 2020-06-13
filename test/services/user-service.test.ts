import tap from 'tap'
import { userService } from '../../src/services'
import { UserRepository, User } from '../../src/repositories'

tap.test('user-service', (test) => {

    const mockUser: User = {
        id: 'id',
        email: 'email',
        issuer: 'issuer'
    }

    const getMockRepository = (): UserRepository => ({
        getUserByEmail: () => Promise.resolve(mockUser),
        getUserByIssuer: () => Promise.resolve(mockUser),
        updateIssuer: () => Promise.resolve()
    })

    tap.test('getUserByEmail should return user', (test) => {

        const mockRepository = getMockRepository()
        const service = userService(mockRepository)

        return service.getUserByEmail('')
        .then(data => {
            test.ok(data.success)
            test.same(data.value, mockUser)

            test.done()
        })
    })

    tap.test('getUserByEmail should return false when no user', (test) => {

        const mockRepository = getMockRepository()
        mockRepository.getUserByEmail = () => Promise.resolve(null as unknown as User)

        const service = userService(mockRepository)

        return service.getUserByEmail('')
        .then(data => {
            test.notOk(data.success)

            test.done()
        })
    })

    tap.test('getUserByIssuer should return user', (test) => {

        const mockRepository = getMockRepository()
        const service = userService(mockRepository)

        return service.getUserByIssuer('')
        .then(data => {
            test.ok(data.success)
            test.same(data.value, mockUser)

            test.done()
        })
    })

    tap.test('getUserByIssuer should return false when no user', (test) => {

        const mockRepository = getMockRepository()
        mockRepository.getUserByIssuer = () => Promise.resolve(null as unknown as User)

        const service = userService(mockRepository)

        return service.getUserByIssuer('')
        .then(data => {
            test.notOk(data.success)

            test.done()
        })
    })

    tap.test('updateIssuer resolves', () => {

        const mockRepository = getMockRepository()
        const service = userService(mockRepository)

        return service.updateIssuer('', '')
    })

    test.done()
})
