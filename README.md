# wx-kitsu

Resource-oriented request

# Usage

# example

```js
import API from 'resource-oriented-request'

class Post extends API {

  static onError(e) {
    console.log(e)
  }
}
async () => {
  const data = await Post.get() // => GET /posts
  data = await Post.getById(1) // => GET /posts/1
  data = await Post.post({
    title: 'test title',
    context: 'long long long context',
  })
  // => POST /posts
  // form data: {title: 'test title',context: 'long long long context'})
}
```
# API

[doc][./docs/api.md]