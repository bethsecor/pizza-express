const assert = require('assert');
const app = require('../server');
const request = require('request');

before(done => {
  this.port = 9876;
  this.server = app.listen(this.port, (err, result) => {
    if (err) { return done(err); }
    done();
  });

  this.request = request.defaults({
    baseUrl: 'http://localhost:9876/'
  });
});

after(() => {
  this.server.close();
});

describe('Server', () => {

  it('should exist', () => {
    assert(app);
  });

  describe('GET /', () => {
    it('should have a body with the name of the application', (done) => {
      var title = app.locals.title;

      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(title),
               `"${response.body}" does not include "${title}".`);
        done();
      });
    });
  });

});
