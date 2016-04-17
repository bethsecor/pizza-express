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

  describe('POST /pizzas', () => {
    beforeEach(() => {
      app.locals.pizzas = {};
    });

    it('should receive and store data', (done) => {
      var validPizza = {
        pizza: {
          name: 'A vegan pizza',
          toppings: [ 'mushrooms', 'onions', 'garlic', 'black olives' ]
        }
      };

      this.request.post('/pizzas', { form: validPizza }, (error, response) => {
        if (error) { done(error); }

        var pizzaCount = Object.keys(app.locals.pizzas).length;

        assert.equal(pizzaCount, 1, `Expected 1 pizzas, found ${pizzaCount}`);

        done();
      });
    });
  });

});
