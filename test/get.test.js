const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const assert = require('assert')

const {
  API
} = require('../src/index')

const mock = new MockAdapter(axios)

class Post extends API {
  static archives() {
    return this.get('archives')
  }
}

afterEach(() => {
  mock.reset()
})
describe('get :', () => {
  it('send headers', async () => {
    mock.onGet('/posts').reply(function (config) {
      assert.equal(config.url, '/posts')
      assert.deepEqual(config.headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        extra: true
      })
      return [200, {
        data: []
      }]
    })
    try {
      let data = await Post.get({}, {
        extra: true
      })
      assert.deepEqual(data, {
        data: []
      })
    } catch (e) {
      console.log(e)
    }
  })

  it('get with custon action', async () => {
    mock.onGet('/posts/archives').reply(function (config) {
      assert.equal(config.url, '/posts/archives')
      return [200, {
        data: []
      }]
    })
    try {
      let data = await Post.archives({}, {
        extra: true
      })
      assert.deepEqual(data, {
        data: []
      })
    } catch (e) {
      console.log(e)
    }
  })
})