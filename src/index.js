import axios from 'axios'
import join from 'url-join'
import qs from 'qs'

defaultsConfig = {
  baseURL: 'http://127.0.0.1:3000',
  timeout: 3000,
  common: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
/**
 * @export API
 * @see wxapp: regeneratorRuntime is not defined https://developers.weixin.qq.com/community/develop/doc/a39569a8bd172ab387dc2f8c4a80ee8f
 * @see Documentation: SyntaxError: Using the
 export keyword between a decorator and a class is not allowed.Please use `export @dec class`
 instead. https://github.com/documentationjs/documentation/issues/996#issuecomment-423644403
 */
export default class API {
  constructor() {
    throw Error('forbidden instantiation')
  }
  /**
   * 底层的请求引擎,基于 axios
   *
   * @static
   * @memberof API
   * @access private
   */
  static get axios() {
    if (!this._axios) {
      this._axios = axios.create()
    }
    return this._axios
  }
  /**
   * 私有 axios 实例
   *
   * @static
   * @memberof API
   * @access private
   */
  static _axios
  /**
   * 只要设定了 baseURL 就意味着,会有一个 axios 实例在原型链上出现。
   *
   * @TODO 不允许在原型链上重复定义 baseURL
   * @static
   * @memberof API
   * @access public
   */
  static set baseURL(url) {
    // this._baseURL = url
    this.axios.defaults.baseURL = url
  }
  static get baseURL() {
    if (!this._baseURL) {
      this._baseURL = 'http://127.0.0.1:3000'
    }
    return this._baseURL
  }
  /**
   *
   *
   * @static
   * @memberof API
   */
  static set config(customConfig = {}) {
    this.axios.defaults = Object.assign({}, this.axios.defaults, customConfig)
  }

  /**
   * 继承子类自定 headers 的缓存对象
   *
   * @static
   * @memberof API
   * @access private
   */
  static _headers = {}
  /**
   *
   *
   * @readonly
   * @static
   * @memberof API
   * @access private
   */
  static get headers() {
    // 防止覆盖
    return Object.assign({}, this._headers)
  }

  /**
   *
   *
   * @static
   * @param {*} [header={}]
   * @memberof API
   * @access public
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
   * @todo ？获取原型链上的 prefix 加起来？
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
   * @see https: //developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
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
    let pathname = join(this.prefix, this.model)
    if (id) pathname += '/' + id
    return pathname
  }

  /**
   *
   *
   * @static
   * @param {string} [action='']
   * @param {*} [body={}]
   * @param {number} body.id
   * @param {string} body.relationship
   * @param {*} [headers={}]
   * @returns {Promise<ResponseData>}
   * @throws E 
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
        paramsSerializer: p => qs(p),
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
   * @returns {Promise<ResponseData>}
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
   * @returns {Promise<ResponseData>}
   * @memberof API
   */
  static async delete(id, headers = {}) {
    try {
      const url = this.pathname(id)
      const { data } = await this.axios.delete(
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
   * @returns {Promise<ResponseData>}
   * @memberof API
   */
  static async post(body, headers = {}) {
    try {
      const url = this.pathname()
      const { data } = await this.axios.post(
        url,
        body, 
        { headers: Object.assign({}, this.headers, headers) }
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
   * @returns {Promise<ResponseData>}
   * @returns {Promise}
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
   * @returns {Promise<ResponseData>}
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
   * @returns {Promise<ResponseData>}
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
   * @returns {Promise<ResponseData>}
   * @memberof API
   */
  static create = API.post

}

export {
  API
}