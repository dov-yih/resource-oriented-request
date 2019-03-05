import client from './client'
import join from 'url-join'


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
   *
   *
   * @static
   * @memberof API
   */
  static set config(customConfig = {}) {
    Object.assign({}, this.axios.defaults, customConfig)
  }
  static get headers() {
    // 防止覆盖
    return Object.assign({}, this._headers)
  }
  /**
   * 继承子类自定 headers 的缓存对象
   *
   * @static
   * @memberof API
   * @todo 添加默认的 JSON-API 的请求头
   * @access private
   */
  static _headers = {}
  /**
   *
   *
   * @static
   * @param {*} [header={}]
   * @memberof API
   */
  static set headers(headers = {}) {
    this._headers = headers
  }
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
  // static camel = camel
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
  // static resCase = camel

  /**
   * 设置当前资源的前缀
   *
   * @static
   * @memberof API
   * @access public
   */
  static _prefix = ''
  static set prefix(prefix) {
    this._prefix = prefix
  }
  static get prefix() {
    return this._prefix
  }
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
   * @param {*} id
   * @returns
   * @memberof API
   */
  static pathname(id) {
    let pathname = join(this.prefix, this.plural(this.resCase(this.model)))
    if (id) pathname += '/' + id
    return pathname
  }
  /**
   *
   *
   * @static
   * @param {Object} body
   * @param {number} body.id
   * @param {string} body.relationship
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
  static async get(action = '', body = {}, headers = {}) {
    try {
      let url = this.pathname()

      if(action && typeof action === 'string') {
        url = join(url, action)
      } else {
        [body, headers] = [action, body]
      }
      let {
        id,
        relationship,
        ...params
      } = body

      if (id) url += `/${id}`
      if (relationship) url += `/relationship`

      const {data} = await this.axios.get(url, {
        params,
        paramsSerializer: p => query(p),
        headers: Object.assign({}, this.headers, headers)
      })
      return data
    } catch (E) {
      throw E
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
  static async patch(body, headers = {}) {
    try {
      const url = this.pathname(body.id)
      const {
        data
      } = await this.axios.put(
        url,
        body, 
        { headers: Object.assign(this.headers, headers) },
      )

      return data
    } catch (E) {
      throw E
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
  static async delete(id, headers = {}) {
    try {
      let model = this.model
      const url = this.pathname(id)
      const {
        data
      } = await this.axios.delete(
        url, 
        { headers: Object.assign(this.headers, headers) }
      )

      return data
    } catch (E) {
      throw E
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
  static async post(body, headers = {}) {
    try {
      const model = this.model
      const url = this.pathname()
      const {
        data
      } = await this.axios.post(
        url,
        body, 
        {  headers: Object.assign({}, this.headers, headers) }
      )
      return data
    } catch (E) {
      throw E
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
  static async self(params = {}, headers = {}) {
    try {
      const url = this.pathname()
      const {data} = await this.get(
        url, // users ??
        params,
        headers,
      )
      return data
    } catch (E) {
      throw E
    }
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
  static async all(params = {}, headers = {}) {
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
  static async getById(id, params = {}, headers = {}) {
    return this.get({
        id,
        ...params
      },
      headers
    )
  }

  /**
   *
   *
   * @static
   * @param {*} [params={}]
   * @param {*} [headers={}]
   * @alias this.patch
   * @returns
   * @memberof API
   */
  static update = API.patch
  /**
   *
   *
   * @static
   * @param {*} [params={}]
   * @param {*} [headers={}]
   * @alias this.post
   * @returns
   * @memberof API
   */
  static create = API.post

}

export * from './decorators'
export {
  API
}