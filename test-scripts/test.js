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
        id: 'AAA01'
      }, done) 
  }) 
})

describe('POST api/projects', function() { 
  it('returns the project', function() { 
    return request(app) 
      .post('api/projects/AAA01') 
      .set('Content-type', 'application/json') 
      .expect(201, {
          "id": "DDD01",
          "name": "project DDD01",
          "description": "test desc DDD02",
          "status": 0,
          "icon": "assets/projects/AI.svg"
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