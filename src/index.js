// import Kitsu from './kitsu'
import client from './client'
import pluralise from 'pluralize'
import {
  // camel,
  deserialise,
  // error,
  // kebab,
  serialise,
  snake
} from 'kitsu-core'

function getModelName (target, name, descriptor) {
  target.model = target.getModelName()
}

@getModelName
export default class API {
  static getModelName () {
    return this.prototype.constructor.name
  }
  static axios = client
  static plural = pluralise
  static headers = {}
  // @TODO 命名风格确定
  static camel = snake
  static resCase = snake

  /**
   * @example Basic Usage
   * API.get({
   *    id: 1,
   *    relationship: 'json',
   *    msg: 'test',
   *    ...
   *  },
   *  {'Content-Type': 'application/json'}
   * )
   * @param {Object} body
   * @param {number} body.id
   * @param {string} body.relationship
   * @param {*} params
   * @param {*} headers
   */
  static async get (body = {}, headers = {}) {
    try {
      let {
        id,
        relationship,
        ...params
      } = body

      let url = this.plural(this.resCase(this.getModelName()))
      if (id) url += `/${id}`
      if (relationship) url += `/${this.resCase(relationship)}`

      const {
        data
      } = await this.axios.get(url, {
        params,
        // @FIXME flyio 不支持 paramsSerializer
        // paramsSerializer: p => query(p),
        headers: Object.assign(this.headers, headers)
      })
      return deserialise(data)
    } catch (E) {
      this.onError(E)
    }
  }

  static async patch (body, headers = {}) {
    try {
      const model = this.getModelName()
      const serialData = await serialise.apply(this, [model, body, 'PUT'])
      const url = this.plural(this.resCase(model)) + '/' + body.id
      const {
        data
      } = await this.axios.put(
        url,
        serialData, {
          headers: Object.assign(this.headers, headers)
        }
      )

      return data
    } catch (E) {
      this.onError(E)
    }
  }

  static async delete (id, headers = {}) {
    try {
      let model = this.getModelName()
      const url = this.plural(this.resCase(model)) + '/' + id
      const {
        data
      } = await this.axios.delete(
        url, {
          data: await serialise.apply(
            this,
            [
              model,
              {
                id
              },
              'DELETE'
            ]),
          headers: Object.assign(this.headers, headers)
        }
      )

      return data
    } catch (E) {
      this.onError(E)
    }
  }

  static async self (params = {}, headers = {}) {
    try {
      const res = await this.get(
        'users', // users ??
        Object.assign(
          {filter: {self: true}},
          params
        ),
        headers
      )
      return res.data[0]
    } catch (E) {
      this.onError(E)
    }
  }

  static async post (body, headers = {}) {
    try {
      const model = this.getModelName()
      const url = this.plural(this.resCase(model))
      const {
        data
      } = await this.axios.post(
        url,
        await serialise.apply(this, [model, body]), {
          headers: Object.assign(this.headers, headers)
        }
      )
      return data
    } catch (E) {
      this.onError(E)
    }
  }

  /**
   *
   * @param {Object} header
   */
  static setHeader (header = {}) {
    this.headers = Object.assign(this.headers, header)
  }
  static async all (params = {}, headers = {}) {
    return this.get(params, headers)
  }

  static async getById (id, params = {}, headers = {}) {
    return this.get(
      { id, ...params },
      headers
    )
  }

  static async update (params = {}, headers = {}) {
    return this.patch(params, headers)
  }

  static async create (params = {}, headers = {}) {
    return this.post(params, headers)
  }

  static onError (e) {
    console.log(Date.now(), 'on error:', e)
  }
}
