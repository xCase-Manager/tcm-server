const testcaseService = require('../services/testcase');
const projectService = require('../services/project');
const messageBuilder = require('../utils/messageBuilder');

module.exports = function(ctx) {
    server = ctx.server;
    const ERROR_MSG = "could not process the request";

    /*
     * Get all testcases list
     */
    server.get('/api/testcases', (req, res) => {
        testcaseService.getTestcases(null).then(function(result) {
            result
                ? res.send(200, result)
                : res.send(400, messageBuilder.error(ERROR_MSG))
        });
    })

    /*
     * Get a project's testcases list
     */
    server.get('/api/projects/:projectId/testcases', (req, res) => {
        if(req.query.search!=undefined){
            testcaseService.getTestcasesFiltered(req.params.projectId, 
                req.query.search).then(function(result) {
                result
                    ? res.send(200, result)
                    : res.send(400, messageBuilder.error(ERROR_MSG))
            }); 
        }else{
            testcaseService.getTestcases(req.params.projectId).then(function(result) {
                result
                    ? res.send(200, result)
                    : res.send(400, messageBuilder.error(ERROR_MSG))
            });
        }         
    })

    /*
     * Get a project's testcase
     */
    server.get('/api/projects/:projectId/testcases/:testcaseId', (req, res) => {
       testcaseService.getTestcase(req.params.testcaseId, 
        req.params.projectId).then(function(result) {
            result
                ? res.send(200, result)
                : res.send(400, messageBuilder.error(ERROR_MSG))
         });     
    })

    /**
     * Create a project's testcase
    */
    server.post('/api/projects/:projectId/testcases', (req, res) => {
        projectService.getProject(req.params.projectId)
        .then(function() {
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
                res.send(400, messageBuilder.error(ERROR_MSG))
            });
         })
        .catch( err => {
            res.send(400, messageBuilder.error(ERROR_MSG));
        });
    })

    /**
     * Update a project's testcase
     */
    server.put('/api/projects/:projectId/testcases/:testcaseId', (req, res) => {
       const data = Object.assign( {}, req.body, {
            lastUpdated: new Date()
        });

        testcaseService.updateTestcase(req.params.testcaseId, req.params.projectId, data)
        .then( result => {        
            res.send(200, result._doc);
        })
        .catch( err => {
            res.send(400, messageBuilder.error(
                "testcase id '" + req.params.testcaseId + 
                "' for project id '" + req.params.projectId + 
                "' could not be updated"))
        });        
    })

    /**
     * Delete a project's testcase
     */
    server.del('/api/projects/:projectId/testcases/:testcaseId', (req, res) => {
        testcaseService.deleteTestcase(req.params.testcaseId, req.params.projectId).then(function(result) {
             ((result.n) && result.n > 0)
                 ? res.send(200)               
                : res.send(400, messageBuilder.error(
                    "testcase id '" + req.params.testcaseId + 
                    "' for project id '" + req.params.projectId + 
                    "' could not be deleted"))
          }); 
    })
}