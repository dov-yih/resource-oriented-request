import API, {
  // API,
  config,
  baseURL
} from '../lib'

// @baseURL('http://localhost:7002')
@config({
  baseURL:'http://localhost:7002',
  timeout: 1000,
  data: {msg: 'test'}
})
class Speech extends API {
  static onError(e) {
    console.log("err:", e)
  }
}


Speech.get()
  .then(
    resp => console.log(resp),
    err => console.log(err)
  )