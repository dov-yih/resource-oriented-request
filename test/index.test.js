// import assert from 'assert'
const assert = require('power-assert')
// import API, { baseURL} from '../src'
const {API, baseURL} = require('../lib')
describe('@baseURL should not cover the old',() => {
  it('prefix', () => {
    @baseURL('http://localhost:3000')
    class Base extends API {}
    class Test extends Base {}
    class Test2 extends Base {
      static prefix = 'v2'
    }
    assert.equal(Test.pathname, 'test')
    assert.equal(Test2.pathname, 'v2/test2')
  })
})