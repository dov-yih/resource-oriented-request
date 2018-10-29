const assert = require('assert')
const {API, baseURL} = require('../lib')
describe('@baseURL should not cover the old',() => {
  it('prefix', () => {
    @baseURL('http://localhost:3000')
    class Base extends API {}
    class Test extends Base {}
    class Test2 extends Base {
      static prefix = 'v2'
    }
    assert(Test.model, 'test')
    assert(Test.model, 'v2/test')
  })
})