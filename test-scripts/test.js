const request = require('supertest') 
describe('GET api/projects', function() { 
  it('returns a projects list', function() { 
    return request(app) 
      .get('api/projects') 
      .set('Accept', 'application/json') 
      .expect(200, done)
  }) 
})

describe('GET api/projects/:id', function() { 
  it('returns a project', function() { 
    return request(app) 
      .get('api/projects/AAA01') 
      .set('Accept', 'application/json') 
      .expect(200, { 
        id: 'AAA'
      }, done) 
  }) 
})

describe('GET api/projects/:project-id/testcases', function() { 
  it('returns a testcases list', function() { 
    return request(app) 
      .get('api/projects/AAA01/testcases') 
      .set('Accept', 'application/json') 
      .expect(200, done)
  }) 
})
  
describe('GET api/projects/:project-id/testcases/:id', function() { 
  it('returns a testcase', function() { 
    return request(app) 
      .get('api/projects/AAA01/testcases/1') 
      .set('Accept', 'application/json') 
      .expect(200, done)
  }) 
})