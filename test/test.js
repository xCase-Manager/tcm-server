#! /usr/bin/env node
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
var should = chai.should();
chai.use(chaiHttp);


describe('GET api/projects', function() { 
    it('returns a projects list', function() { 
      chai.request(server) 
        .get('api/projects') 
        .set('Accept', 'application/json') 
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        })  
    })
  })

describe('GET api/projects/:id', function() { 
  it('returns a project', function() { 
    chai.request(server) 
      .get('api/projects/AAA01') 
      .set('Accept', 'application/json') 
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })  
  }) 
})

describe('GET api/projects/:project-id/testcases', function() { 
  it('returns a testcases list', function() { 
    chai.request(server)
      .get('api/projects/AAA01/testcases') 
      .set('Accept', 'application/json') 
      .get((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      })  
  }) 
})
  
describe('GET api/projects/:project-id/testcases/:id', function() { 
  it('returns a testcase', function() { 
    return request(app) 
      .get('api/projects/AAA01/testcases/1') 
      .set('Accept', 'application/json') 
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  }) 
})