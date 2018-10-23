/**
 * 获取 model name, 默认是当前的类的类名
 * @param {string} modeName
 * @todo add unit test
 * @example <caption>默认</caption>
 * class User extends API {
 *   //...
 * }
 *  // this.model => User
 * @example <caption>自定义 model name</caption>
 * \@modelName('player')
 * class User extends API {
 *   // ...
 * }
 */
export function modelName(modeName) {
  return function (target, name, descriptor) {
    target.model = modeName || target.prototype.constructor.name
  }
}
/**
 * 设置 baseURL
 * @param {string} url
 * @todo pedding realization
 * @example <caption>基本用法</caption>
 * \@baseURL('localhost:3000')
 * class Base extends API {}
 * class User extends Base {
 *  // ...
 * }
 * User.getById(1)
 * // localhost:3000/user/1
 */
export function baseURL(url) {
  return function (target, name, descriptor) {
    target.baseURL = url
  }
}
/**
 * 设置基础请求库: wx 或者 node
 * @todo pedding realization
 * @param {string} engine
 */
export function engine(engine) {
    return function (target, name, descriptor) {
      target.engine = engine
    }
}