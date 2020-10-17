const projectService = require('../services/project');
const messageBuilder = require('../utils/messageBuilder');

/****************************
        Project route controller
*****************************/
module.exports = function(ctx) {
  const db = ctx.db,
  server = ctx.server;
  const ERROR_MSG = "could not process the request";
  
  /*
  * create a project
  */
  server.post('/api/projects', (req, res, next) => {
    const data = Object.assign({}, req.body, 
        { created: new Date()}
    );
    projectService.saveProject(data)
      .then( result => res.send(200, result._doc))
      .catch( err => {
        console.log("could not create the project, error: %s", err.errmsg);
        res.send(400, messageBuilder.error(
          "could not create project, this project id might already exist"))
      });
  })

  /**
  * Get a project
  */
  server.get('/api/projects/:projectId', (req, res, next) => {
    projectService.findProject(req.params.projectId).then(function(result) {
      result? res.send(200, result)
      :res.send(400, messageBuilder.error(ERROR_MSG))
    }).catch( err => res.send(400, messageBuilder.error(ERROR_MSG))); 
  })

  /**
  * Get all projects
  */
  server.get('/api/projects', (req, res, next) => {
    projectService.findProjects(req.query.search).then(function(result) {
      result? res.send(200, result)
      :res.send(400, messageBuilder.error(ERROR_MSG))
    }); 
  })

  /**
  * Delete ProjectId
  */
  server.del('/api/projects/:projectId', (req, res) => {
    projectService.delete(req.params.projectId).then(function(result) {
      ((result.n) && result.n > 0)
      ?res.send(200) :res.send(400, messageBuilder.error(
      "the project id '" + req.params.projectId + 
      "' could not be deleted"))
    });
  })

  /**
  * Update project
  */
  server.put('/api/projects/:projectId', (req, res, next) => {
    const data = Object.assign( {}, req.body, {
      lastUpdated: new Date()
    });

    projectService.update(req.params.projectId, data)
      .then(result => res.send(200, result._doc))
      .catch(err => res.send(400, messageBuilder.error(ERROR_MSG)));            
  })
}