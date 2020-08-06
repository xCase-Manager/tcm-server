const Project = require('../models/project');
const projectService = require('../services/project');

module.exports = function(ctx) {
    const db     = ctx.db,
    server = ctx.server
  
   server.post('/api/projects', (req, res, next) => {

        const data = Object.assign( 
            {}, 
            req.body, 
            {
                created: new Date()
            }
        );

        console.log(" saving data");

        projectService.saveProject(data)
        .then( result => {        
            res.send(200, result._doc);
        })
        .catch( err => {
            console.log("could not create the project, error: %s", err.errmsg);
            res.send(400, err.errmsg)
        });

    })

    /**
     * Get a project
     */
    server.get('/api/projects/:projectId', (req, res, next) => {

        console.log("GET project/id is processing ... ");

        db.collection("projects").findOne(
            { "id" : req.params.projectId}, 
            { "fields": { "_id": 0 } },
            function(dbErr, dbRes) {
                if (dbRes){
                    jsonRes = JSON.stringify(dbRes);
                    console.log("response: %s", jsonRes);
                    res.send(200, dbRes);
                } else
                    res.send(400, "project id '" + req.params.projectId + "' does not exist")        
            }
        );   
    })

    /**
     * Get all projects
     */
    server.get('/api/projects', (req, res, next) => {
        
         if(req.query.search!=undefined){
            projectService.getProjects(req.query.search).then(function(result) {
                result
                    ? res.send(200, result)
                    : res.send(400, "projects requested do not exist")
            }); 
        }else{
            projectService.getProjects().then(function(result) {
                result
                    ? res.send(200, result)
                    : res.send(400, "projects requested do not exist")
            });
        }
    })

    /**
     * Delete ProjectId
     */
    server.del('/api/projects/:projectId', (req, res, next) => {

        db.collection("projects").remove(
            { "id" : req.params.projectId}, 
            { "justOne": true },
            function(dbErr, dbRes) {
                if (dbErr)
                    res.send(400, dbErr.errmsg)
                if (dbRes){
                    if(dbRes.result.n==0)
                        res.send(400, "project id '"+req.params.projectId+"' does not exist")                   
                    else
                        res.send(200, "project id '"+req.params.projectId+"' has been succefully deleted")
                }           
            }
         )
    })

    /**
     Update 
       
     client put:
     
        PUT http://localhost:3000/api/projects/AAA13
        {
            "name": "project000 01",
            "description": "project000 01" 
        }
     */
    server.put('/api/projects/:projectId', (req, res, next) => {
        const data = Object.assign( {}, req.body, {
            lastUpdated: new Date()
        });

        projectService.update(req.params.projectId, data)
        .then( result => {        
            res.send(200, result._doc);
        })
        .catch( err => {
            res.send(400, {'error_code': 1, 'error_message': 'could not process the request'})
        });            
    })
}