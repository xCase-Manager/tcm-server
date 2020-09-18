const testcaseService = require('../services/testcase');
const projectService = require('../services/project');
const stringBuilder = require('../utils/stringBuilder');

module.exports = function(ctx) {
    server = ctx.server;
    const SUCCESS_MSG = {"message": "%s"};
    const ERROR_MSG = {"message": "could not process the request"};

    /*
     * Get testcases list
     */
    server.get('/api/testcases', (req, res, next) => {
        testcaseService.getTestcases(null).then(function(result) {
            result
                ? res.send(200, result)
                : res.send(400, ERROR_MSG)
        });               
    })

    /*
     * Get testcases list
     */
    server.get('/api/projects/:projectId/testcases', (req, res, next) => {
        if(req.query.search!=undefined){
            testcaseService.getTestcases(req.params.projectId, 
                req.query.search).then(function(result) {
                result
                    ? res.send(200, result)
                    : res.send(400, ERROR_MSG)
            }); 
        }else{
            testcaseService.getTestcases(req.params.projectId).then(function(result) {
                result
                    ? res.send(200, result)
                    : res.send(400, ERROR_MSG)
            });
        }         
    })

    /*
     * Get a testcase
     */
    server.get('/api/projects/:projectId/testcases/:testcaseId', (req, res, next) => {
       testcaseService.getTestcase(req.params.testcaseId, 
        req.params.projectId).then(function(result) {
            result
                ? res.send(200, result)
                : res.send(400, ERROR_MSG)
         });     
    })

    /**
     * Create
    */
    server.post('/api/projects/:projectId/testcases', (req, res, next) => {
        projectService.getProject(req.params.projectId)
        .then(function(result) {

            const data = Object.assign( 
                {}, 
                req.body, 
                {
                    projectId: req.params.projectId,
                    created: new Date()
                }
            );

            testcaseService.saveTestcase(data)
            .then( result => {        
                res.send(200, result._doc);
            })
            .catch( err => {
                console.log("could not create the testcase for project id '%s', error: %s", 
                req.params.projectId, err.errmsg);
                res.send(400, ERROR_MSG)
            });

         })
        .catch( err => {
            res.send(400, ERROR_MSG);
        });
    })

    /**
     * Update
     */
    server.put('/api/projects/:projectId/testcases/:testcaseId', (req, res, next) => {
       const data = Object.assign( {}, req.body, {
            lastUpdated: new Date()
        });

        testcaseService.updateTestcase(req.params.testcaseId, req.params.projectId, data)
        .then( result => {        
            res.send(200, result._doc);
        })
        .catch( err => {
            res.send(400, ERROR_MSG)
        });        
    })

    /**
     * Delete
     */
    server.del('/api/projects/:projectId/testcases/:testcaseId', (req, res, next) => {
        testcaseService.deleteTestcase(req.params.testcaseId, req.params.projectId).then(function(result) {
             ((result.n) && result.n > 0)
                 ? res.send(200)               
                : res.send(400, JSON.parse(stringBuilder.fillTemplate({ content: "testcase id '" 
                + req.params.testcaseId + "' for project id '" + req.params.projectId + 
                "' could not be deleted"})))
          }); 
    })
}