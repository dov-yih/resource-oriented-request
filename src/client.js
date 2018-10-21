// 导入配置
import config from './config'
import {query} from 'kitsu-core'
// 引入 fly
import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

// 超时配置
fly.config.timeout = 5 * 1000

// 公共 Headers
fly.config.headers['X-Tag'] = 'flyio'
fly.config.headers['Content-Type'] = 'application/vnd.api+json'
// 服务器地址
fly.config.baseURL = config.baseURL

// 添加请求拦截器
fly.interceptors
  .request.use((request) => {
  // 自定义请求头
    request.headers['X-Tag'] = 'flyio'
    // 如果是 GET 将 request.body 转换，模拟 axios 的paramsSerializer
    if (request.method === 'GET') {
      request.body = query(request.body)
    }

    const accessToken = wx.getStorageSync('access_token')

    // 如果包含了 token，直接返回
    if (accessToken === undefined || request.headers['Authorization']) {
      return request
    }

    // 如果没有 token，在 headers 里添加
    request.headers['Authorization'] = `Bearer ${accessToken}`

    // 打印请求体
    console.log('fly请求体 -->>>%o', request.body)

    return request
  })

// 添加响应拦截器
fly.interceptors
  .response.use(response => {
  // 打印返回体
    console.log('fly返回体 -->>>%o', response.data)
    // @TODO 这里返回 data ??
    return response
  },
  /**
   * @see https://jsonapi.org/format/#errors
   */
  E => {
    if (E.response) {
      const e = E.response.data
      if (e && e.errors) E.errors = e.errors
    }
    return E
    // 发生网络错误
  })

export default fly
