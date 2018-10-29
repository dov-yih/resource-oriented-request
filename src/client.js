// 导入配置
import axios from 'axios'

// 超时配置
axios.defaults.timeout = 3000

// 公共 Headers
// axios.config.headers['X-Tag'] = 'axios'
axios.defaults.headers.common['Content-Type'] = 'application/json'
// 服务器地址
axios.defaults.baseURL = 'http://localhost:7001'

// 添加请求拦截器
axios.interceptors.request
  .use((config) => {
    // 打印请求体
    console.log('fly请求体 -->>>%o', config)

    return config
  })

// 添加响应拦截器
axios.interceptors.response
  .use(response => {
    // 打印返回体
    console.log('fly返回体 -->>>%o', response.data)
    // @TODO 这里返回 data ??
    return response
  },
  /*
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

export default axios
