// 导入配置
import axios from 'axios'

// 超时配置
axios.defaults.timeout = 3000

// 公共 Headers
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

// 添加请求拦截器
// axios.interceptors.request
//   .use((config) => {
//     // 打印请求体
//     return config
//   })

// 添加响应拦截器
// axios.interceptors.response
//   .use(response => {
//     return response
//   },
//   /*
//    * @see https://jsonapi.org/format/#errors
//    */
//   E => {
//     if (E.response) {
//       const e = E.response.data
//       if (e && e.errors) E.errors = e.errors
//     }
//     return E
//     // 发生网络错误
//   })

export default axios
