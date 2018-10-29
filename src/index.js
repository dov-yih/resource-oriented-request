import client from './client'
import pluralise from 'pluralize'
import {
  camel,
  deserialise,
  // error,
  // kebab,
  query,
  serialise,
  snake
} from 'kitsu-core'


/**
 * @export API
 * @see wxapp: regeneratorRuntime is not defined https://developers.weixin.qq.com/community/develop/doc/a39569a8bd172ab387dc2f8c4a80ee8f
 * @see Documentation: SyntaxError: Using the
 export keyword between a decorator and a class is not allowed.Please use `export @dec class`
 instead. https://github.com/documentationjs/documentation/issues/996#issuecomment-423644403
 */
//  @modelName()
export default class API {
  /**
   * 底层的请求引擎,基于 flyio
   *
   * @static
   * @memberof API
   * @access private
   */
  static axios = client
  /**
   * 单复数转换函数, 基于 pluralise
   *
   * @static
   * @memberof API
   * @access private
   */
  static plural = pluralise
  /**
   * 默认的 header
   *
   * @static
   * @memberof API
   * @todo 添加默认的 JSON-API 的请求头
   * @access private
   */
  static headers = {}
  /**
   * 配置对象
   *
   * @static
   * @memberof API
   */
  static config = {}
  /**
   * 资源名的命名风格
   *
   * @static
   * @memberof API
   * @access private
   * @todo 命名风格确定,目前使用的驼峰是形式
   * @example
   * class PostMan extends API {
   *  // ..
   * }
   * PostMan.getById(1)
   * // => /postMan/1
   */
  static camel = camel
  /**
   * 资源名的命名风格
   *
   * @static
   * @memberof API
   * @access private
   * @todo 命名风格确定,目前使用的驼峰是形式
   * @example
   * class PostMan extends API {
   *  // ..
   * }
   * PostMan.getById(1)
   * // => /postMan/1
   */
  static resCase = camel

  /**
   * @param {Object} body
   * @param {number} body.id
   * @param {string} body.relationship
   * @param {Object} params
   * @param {Object} headers
   * @example Basic Usage
   * User.get({
   *    id: 1,
   *    relationship: 'json',
   *    msg: 'test',
   *    ...
   *  },
   *  {'X-tag': 'costom-tag'}
   * )
   */
  /**
   * 返回当前类的类名
   *
   * @readonly
   * @static
   * @memberof API
   * @example
   * class Test extends API {}
   * this.model
   * // test
   */
  static get model() {
    return this.prototype.constructor.name.toLowerCase()
  }
  /**
   *
   *
   * @static
   * @param {Object} body
   * @param {number} body.id
   * @param {string} body.relationship
   * @param {Object} params
   * @param {Object} headers
   * @returns
   * @memberof API
   * @example Basic Usage
   * User.get({
   *    id: 1,
   *    relationship: 'json',
   *    msg: 'test',
   *    ...
   *  },
   *  {'X-tag': 'costom-tag'}
   * )
   */
  static async get (body = {}, headers = {}) {
    try {
      let {
        id,
        relationship,
        ...params
      } = body

      let url = this.plural(this.resCase(this.model))
      if (id) url += `/${id}`
      if (relationship) url += `/${this.resCase(relationship)}`

      const {data} = await this.axios.get(url, {
        params,
        paramsSerializer: p => query(p),
        headers: Object.assign(this.headers, headers)
      })
      return deserialise(data)
    } catch (E) {
      this.onError(E)
    }
  }

  /**
   *
   *
   * @static
   * @param {*} body
   * @param {*} [headers={}]
   * @returns
   * @memberof API
   */
  static async patch (body, headers = {}) {
    try {
      const model = this.model
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
  /**
   *
   *
   * @static
   * @param {*} id
   * @param {*} [headers={}]
   * @returns
   * @memberof API
   */
  static async delete (id, headers = {}) {
    try {
      let model = this.model
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
  /**
   *
   *
   * @static
   * @param {*} [params={}]
   * @param {*} [headers={}]
   * @returns
   * @memberof API
   */
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
  /**
   *
   *
   * @static
   * @param {*} body
   * @param {*} [headers={}]
   * @returns
   * @memberof API
   */
  static async post (body, headers = {}) {
    try {
      const model = this.model
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
   *
   * @static
   * @param {*} [header={}]
   * @memberof API
   * @todo 警告:这个api可能被删除
   */
  static setHeader (header = {}) {
    this.headers = Object.assign(this.headers, header)
  }
  /**
   * 返回所有的资源
   *
   * @static
   * @param {*} [params={}]
   * @param {*} [headers={}]
   * @returns
   * @memberof API
   */
  static async all (params = {}, headers = {}) {
    return this.get(params, headers)
  }
  /**
   * 通过 id 来获取资源
   *
   * @static
   * @param {*} id
   * @param {*} [params={}]
   * @param {*} [headers={}]
   * @returns
   * @memberof API
   */
  static async getById (id, params = {}, headers = {}) {
    return this.get(
      { id, ...params },
      headers
    )
  }
  /**
   *
   *
   * @static
   * @param {*} [params={}]
   * @param {*} [headers={}]
   * @returns
   * @memberof API
   */
  static async update (params = {}, headers = {}) {
    return this.patch(params, headers)
  }
  /**
   *
   *
   * @static
   * @param {*} [params={}]
   * @param {*} [headers={}]
   * @returns
   * @memberof API
   */
  static async create (params = {}, headers = {}) {
    return this.post(params, headers)
  }
  /**
   * 统一的错误处理,默认控制台打印
   *
   * @static
   * @param {*} e
   * @memberof API
   */
  static onError (e) {
    console.log( this.model + ' on error:', e)
  }
}

export * from './decorators'
export { API }