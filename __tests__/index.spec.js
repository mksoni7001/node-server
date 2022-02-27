const request = require('supertest')
const config = require('../config');
const ExpressServer = require('../expressServer');
const Service = require('../services/Service');

const expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML, {});

beforeAll(() => {
    expressServer.prepareExpress()
    mockServices()
})

mockServices = () => {
    jest.mock("../services/RecordService", () => {
        return {
            search: jest.fn(() => {
                return {code: 0, message: "Success", records: [{
                    "key": "zuKLilZi",
                    "createdAt": "2016-03-21T12:07:03.692Z",
                    "totalCount": 2434
                }]}
            })
        }
    })
}

describe('health check', function () {
    it('should return a 404', async () => {
        const res = await request(expressServer.app).get('/not-found')
        expect(res.statusCode).toEqual(404)
    })
    it('should return a 200', async () => {
        const res = await request(expressServer.app).get('/health')
        expect(res.statusCode).toEqual(200)
    })
})

describe('record search', function () {
    it('should return a valid response', async () => {
        const res = await request(expressServer.app)
        .post('/record/search')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 1959,
            "maxCount": 2700
        })
        expect(res.statusCode).toEqual(200)
        expect(res.body.code).toEqual(0)
        expect(res.body.message).toEqual("Success")
        expect(res.body.records).toEqual([
            {
              key: 'zuKLilZi',
              createdAt: '2016-03-21T12:07:03.692Z',
              totalCount: 2434
            }
          ])
    })
    it('should return an error if params not enough', async () => {
        const res = await request(expressServer.app)
        .post('/record/search')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 1959
        })
        expect(res.statusCode).toEqual(400)
    })
})