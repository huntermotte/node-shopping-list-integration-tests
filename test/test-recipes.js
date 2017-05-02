const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('Recipes', function() {


  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer;
  });

  it('should return recipes on GET', function() {
    return chai.request(app)
    .get('/recipes')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.should.have.length.of.at.least(1);
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys('id', 'name', 'ingredients')
      });
    });
  });

  it('should create a recipe on POST', function() {
    const newRecipe = {
      name: 'PBandJ', ingredients: ['peanut butter', 'jelly', 'bread']
    };
    return chai.request(app)
    .post('/recipes')
    .send(newRecipe)
    .then(function(res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.include.keys('id', 'name', 'ingredients');
      res.body.name.should.equal(newRecipe.name);
      res.body.ingredients.should.be.a('array');
    });
  });

  it('should update recipes on PUT', function() {
    const updateRecipe = {
      name: 'salad', ingredients: ['lettuce', 'dressing', 'croutons']
    };
    return chai.request(app)
    .get('/recipes')
    .then(function(res) {
      updateRecipe.id = res.body[0].id;

      return chai.request(app)
      .put(`/recipes/${updateRecipe.id}`)
      .send(updateRecipe)
    })
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.a('object');
      res.body.id.should.equal(updateRecipe.id);
      res.body.name.should.equal(updateRecipe.name);
      res.body.should.include.keys('id', 'name', 'ingredients');
    });
  });

  it('should delete recipes on DELETE', function() {
    return chai.request(app)
    .get('recipes')
    .then(function(res) {
      return chai.request(app)
      .delete(`/recipes/${res.body[0].id}`)
    })
    .then(function(res) {
      res.should.have.status(204);
    });
  });

});
