const loadtest = require('loadtest');

describe('stress tests', function(){
  test('首頁需要在一秒之內處理50個請求', done => {
    const options = {
      url: 'http://localhost/3000',
      concurrency: 4,
      maxRequests: 50,
    }
    loadtest.loadTest(options, (err, result) => {
      expect(!err)
      expect(result.totalTimeSeconds < 1)
      done()
    })
  })
});