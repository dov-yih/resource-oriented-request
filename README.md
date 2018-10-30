# Resource-oriented Request

Resource-oriented request

# Usage

```sh
yarn add resource-oriented-request
```
# example

## Basic
```js
import API,{baseURL} from 'resource-oriented-request'
@baseURL('http://localhost:3000')
class Base extends API {}

class Post extends Base {
  static prefix = 'admin'

  static header = {
    'X-Tags': 'test'
  }

  static onError(e) {
    console.log(e)
  }
}
async () => {
  const data = await Post.get()
  // => GET http://localhost:3000/posts

  data = await Post.getById(1)
  // => GET http://localhost:3000/posts/1

  data = await Post.post({
    title: 'test title',
    context: 'long long long context',
  })
  // => POST http://localhost:3000/posts
  // Form data: {title: 'test title',context: 'long long long context'})
}
```

## Prefix
```js
class Post extends Base {
  static prefix = 'admin'
}
async () => {
  const data = await Post.get()
  // => GET http://localhost:3000/admin/posts
  data = await Post.getById(1)
  // => GET http://localhost:3000/admin/posts/1
  data = await Post.post({
    title: 'test title',
    context: 'long long long context',
  })
  // => POST http://localhost:3000/admin/posts
  // form data: {title: 'test title',context: 'long long long context'})
}
```

## Headers

```js
class Post extends Base {
  static headers = {
    'X-Tags': 'test,boom'
  }
}
async () => {
  const data = await Post.get()
  // => GET http://localhost:3000/admin/posts
  // Requset Header:
  // ...
  // X-Tags: test,boom
  // ...
}
```

# API

[docs/api.md](./docs/api.md)