const testcaseService = require('../services/testcase');
const projectService = require('../services/project');

module.exports = function(ctx) {
    server = ctx.server;
    /*
     * Get testcases list
     * 
     * GET http://localhost:3000/testcases
     */
    server.get('/api/testcases', (req, res, next) => {
        testcaseService.getTestcases(null).then(function(result) {
            result
                ? res.send(200, result)
                : res.send(400, "testcases for project id '%s' do not exist" + 
                    req.params.projectId)
        });               
    })

    /*
     * Get testcases list
     * 
     * GET http://localhost:3000/projects/AAA01/testcases
     */
    server.get('/api/projects/:projectId/testcases', (req, res, next) => {
        if(req.query.search!=undefined){
            testcaseService.getTestcases(req.params.projectId, req.query.search).then(function(result) {
                result
                    ? res.send(200, result)
                    : res.send(400, "testcases for project id '" + req.params.projectId + "' do not exist")
            }); 
        }else{
            testcaseService.getTestcases(req.params.projectId).then(function(result) {
                result
                    ? res.send(200, result)
                    : res.send(400, "testcases for project id '" + req.params.projectId + "' do not exist")
            });
        }         
    })

    /*
     * Get a testcase
     * 
     * GET http://localhost:3000/projects/AAA01/testcases/12
     */
    server.get('/api/projects/:projectId/testcases/:testcaseId', (req, res, next) => {
       testcaseService.getTestcase(req.params.testcaseId, req.params.projectId).then(function(result) {
            result
                ? res.send(200, result)
                : res.send(400, "testcase id '" + req.params.testcaseId + "' for project id '" + req.params.projectId + "' does not exist")
         });     
    })

    /**
     * Create
     * 
    POST http://localhost:3000/projects/AAA01/testcases 
     {
        "id" : 5,
        "title" : "basic login test 5",
        "description" : "basic login test for the Web portal application",
        "steps" : [
        	{"name" : "login 5", "description" : "submit credential"},
        	{"name" : "landing page 5", "description" : "user sees his name on the landing page"}
        	]
     }
    */
    server.post('/api/projects/:projectId/testcases', (req, res, next) => {

        //check if the project exist
        projectService.getProject(req.params.projectId)
        .then(function(result) {

            console.log(" building the data");

            const data = Object.assign( 
                {}, 
                req.body, 
                {
                    projectId: req.params.projectId,
                    created: new Date()
                }
            );

            console.log(" saving data");

            testcaseService.saveTestcase(data)
            .then( result => {        
                res.send(200, result._doc);
            })
            .catch( err => {
                console.log("could not create the testcase for project id '%s', error: %s", req.params.projectId, err.errmsg);
                res.send(400, err.errmsg)
            });

         })
        .catch( err => {
            res.send(400, "the project id '" + req.params.projectId + "' does not exist");
        });
    })

    /**
     * Update
     * 
        PUT http://localhost:3000/api/projects/AAA01/testcases/4
        {
            "id": "4",
            "title": "basic login test 4",
            "description": "basic login test for the Web portal application",
            "steps": [
                {
                    "name": "login",
                    "description": "submit credential"
                },
                {
                    "name": "landing page",
                    "description": "user sees his name on the landing page"
                }
            ],
            "projectId": "AAA01"
        }
     */
    server.put('/api/projects/:projectId/testcases/:testcaseId', (req, res, next) => {

        // extract data from request body and add timestamps
       const data = Object.assign( {}, req.body, {
            lastUpdated: new Date()
        });

        console.log(" saving data");

        testcaseService.updateTestcase(req.params.testcaseId, req.params.projectId, data)
        .then( result => {        
            res.send(200, result._doc);
        })
        .catch( err => {
            res.send(400, {'error_code': 1, 'error_message': 'could not process the request'})
        });        
    })

    /**
     * Delete
     * src: https://docs.mongodb.com/manual/reference/method/db.collection.remove/
     */
    server.del('/api/projects/:projectId/testcases/:testcaseId', (req, res, next) => {
        testcaseService.deleteTestcase(req.params.testcaseId, req.params.projectId).then(function(result) {
             ((result.n) && result.n > 0)
                 ? res.send(200, {'message': "testcase id '" + req.params.testcaseId + "' for project id '" + req.params.projectId + "' is now deleted"})
                 : res.send(400, "testcase id '" + req.params.testcaseId + "' for project id '" + req.params.projectId + "' does not exist")
          }); 
    })
}