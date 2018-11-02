// import assert from 'assert'
const assert = require('power-assert')
// import API, { baseURL} from '../src'
const {API, baseURL} = require('../src')
describe('@baseURL should not cover the old baseURL',() => {
  @baseURL('http://localhost:3000')
  class Base extends API {}
  it('prefix can\'t overwrite:', () => {
    class User extends Base {}
    class Post extends Base {
      static prefix = 'admin'
    }
    assert.equal(User.pathname(), 'users')
    assert.equal(User.pathname(11), 'users/11')
    assert.equal(Post.pathname(), 'admin/posts')
    assert.equal(Post.pathname(1), 'admin/posts/1')
  })
  it('headers can\'t overwrite:',() => {
    // class
    class User extends Base {
      static headers = {
        'X-Tag': 'test-User'
      }
    }
    assert.deepEqual(User.headers, {
      'X-Tag': 'test-User'
    })
    class Post extends Base {
      static headers = {
        // 'X-Tag': 'test-Post',
        'X-AXIOS': 'Static'
      }
    }
    assert.deepEqual(Post.headers, {
      // 'X-Tag': 'test-Post',
      'X-AXIOS': 'Static'
    })
    User.create({id: 1,text: 'adsfsf'}).then(resp => {
      console.log(resp)
    })
  })
  it('plural:', () => {
    class User extends Base {}
    class Post extends Base {
      static pluralise = s => s
    }
    assert.equal(Post.plural('post'), 'post')
    assert.equal(User.plural('user'), 'users')
  })
})