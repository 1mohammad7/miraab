const _ = require('lodash')
const { connect, disconnect } = require('../../internal/db-connection')
const request = require('supertest')
const { app, server } = require('../../index')
const authDB = require('../auth/db')
const userDB = require('../user/db')
const fakegenerator = require('../../internal/fakegenerator/auth')
const { logger } = require('../../internal/logger')
beforeAll(async () => {
    await connect()
})
afterAll(async () => {
    await disconnect()
    await server.close()
})

describe('SignIn Route', () => {
    let mock = {}

    afterEach(async () => {
        await userDB.findByIdAndDelete(mock._id)
    })
    test('not registered , should send OTP', async () => {
        const res = await request(app)
            .post('/api/auth/signin')
            .send({
                phoneNumber: fakegenerator.basic_user(0).phoneNumber,
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body.code).toBe(2)
        expect(res.body.data).toMatchObject({ ttl: expect.any(Number), token: expect.any(Number) })
    })
    test('already registered, should instruct to login', async () => {
        const fakeUser = fakegenerator.basic_user(0)
        const user = await authDB.saveUser(fakeUser)
        mock = user
        const res = await request(app)
            .post('/api/auth/signin')
            .send({
                phoneNumber: user.phoneNumber,
            })

        expect(res.statusCode).toEqual(202)
        expect(res.body.code).toBe(2)

    })

    test('input empty , should send input error', async () => {
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ phone: '' })
        expect(res.body.code).toBe(1)
    })

})