/**
 * 设置 baseURL
 * @param {string} url
 * @todo pedding realization
 * @example <caption>基本用法</caption>
 * \@baseURL('localhost:3000')
 * class Base extends API {}
 *
 * class User extends Base {
 *  // ...
 * }
 * User.getById(1)
 * // localhost:3000/user/1
 */
export function baseURL(url) {
  return function (target, name, descriptor) {
    target.axios.defaults.baseURL = url
  }
}
/**
 * 设置基础请求库: wx 或者 node
 * @todo pedding realization
 * @param {string} engine
 * @private
 */
export function engine(engine) {
  return function (target, name, descriptor) {
    target.engine = engine
  }
}
/**
 * 设置`axios.defaults`
 *
 * @export
 * @param {*} customConfig
 * @returns
 * @example
 * \@config({
 *   baseURL: 'http://localhost:7002',
 *   timeout: 1000,
 *   data: {
 *     msg: 'test'
 *   }
 * })
 * class Speech extends API { }
 * */
export function config(customConfig) {
  return function (target, name, descriptor) {
    target.axios.defaults = Object.assign(target.axios.defaults, customConfig)
  }
}