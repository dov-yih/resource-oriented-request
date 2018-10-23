// 当前环境是否为开发环境
const devTools = process.env.NODE_ENV === 'development'
/**
 * @param {string} baseURL
 * @param {stirng} appKey
 * @param {stirng} appId
 * @todo 应该在外部配置,待移除
 * @deprecated will remove from v0.1.6
 */
export default {
  // 主机域名
  baseURL: devTools ? 'https://ktt.openxyz.com' : '',
  // 小程序 Key
  appKey: '',
  // 小程序 Id
  appId: ''
}
