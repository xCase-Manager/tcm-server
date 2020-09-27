const Testcase = require('../models/testcase');

/****************************
        Testcase service
*****************************/
class TestcaseService {
  
    // testcases finder service
    async getTestcases(projectId, filter='') {
        try {
            return await (  new Promise((resolve, reject) => {
                Testcase.find({
                    $and: [
                        { "projectId" : projectId},
                            {$or: [
                                { "name":  { $regex: new RegExp(filter), $options: 'i' } }, 
                                    { "description":  
                                        { $regex: new RegExp(filter), $options: 'i' } }
                                ]}
                    ]},
                    { '_id': 0, '__v': 0 }, 
                        function(dbErr, dbRes) {
                            if (dbRes)
                                resolve(dbRes);
                            else{
                                console.log("testcase search error : %s", dbErr);
                                reject(dbErr); 
                            }       
                        }
                );
            }))
        } catch(e) {
            console.log("error response: %s", e);
        }    
    };

    // Testcase finder service
    async getTestcase(testcaseId, projectId) {
        try {
            return await (  new Promise((resolve, reject) => {
                console.log("requesting DB for testcase id '%s' and project '%s'", testcaseId, projectId);
                
                    Testcase.findOne(
                        { "id" : parseInt(testcaseId), "projectId" : projectId},
                        { '_id': 0, '__v': 0 }, 
                        function(dbErr, dbRes) {
                            if (dbRes){
                                console.log("found response: %s", dbRes);
                                resolve(dbRes);
                            } else{
                                console.log("not found response: %s", dbErr);
                                reject(dbErr); 
                            }       
                        }
                    );
                })
            )
        } catch(e) {
            console.log("error response: %s", e);
          }    
    };

    // Testcase creation service
    async saveTestcase(data) {
        try{
            return await ( new Promise((resolve, reject) => {
                console.log("requesting DB to create a testcase for project id '%s'", data.projectId);
                
                Testcase.create(data, 
                    function(dbErr, dbRes) {
                        if (dbRes){
                            console.log("found response: %s", dbRes);
                            delete dbRes._doc._id;
                            delete dbRes._doc.__v;
                            resolve(dbRes);
                        } else{
                            console.log("not found response: %s", dbErr);
                            reject(dbErr); 
                        }       
                    }
                );
            }));
        } catch(e) {
            console.log(
                        "coud not update test id '%s' for project id '%s', error:", 
                        testcaseId, 
                        projectId,
                        e);
          }
    };

    // Testcase update service
    async updateTestcase(testcaseId, projectId, data) {
        try{
            return await ( new Promise((resolve, reject) => {
                console.log("requesting DB to update a testcase for project id '%s'", projectId);

                Testcase.findOneAndUpdate(
                        { "id" : parseInt(testcaseId), "projectId" : projectId},
                        data,
                        { new: true },
                        function(dbErr, dbRes) {
                            if (dbRes){
                                console.log("update response: %s", dbRes);
                                resolve(dbRes);
                            } else{
                                console.log(
                                            "coud not update test id '%s' for project id '%s', error: %s", 
                                            testcaseId, 
                                            projectId,
                                            dbErr);

                                reject(dbErr); 
                            }       
                        }
                    );
                }) 
            );
        } catch(e) {
            console.log(
                        "coud not update test id '%s' for project id '%s', error:", 
                        testcaseId, 
                        projectId,
                        e);
          }
    };

    // Testcase update service
    async deleteTestcase(testcaseId, projectId) {
        try{
            return await ( new Promise((resolve, reject) => {
                console.log("requesting DB to delete a testcase id '%s' for project id '%s'", testcaseId, projectId);

                Testcase.remove(
                        { "id" : parseInt(testcaseId), "projectId" : projectId},
                        function(dbErr, dbRes) {
                            if (dbRes){
                                console.log("delete operation response: %s", dbRes);
                                resolve(dbRes);
                            } else{
                                console.log(
                                            "coud not delete test id '%s' for project id '%s', error:", 
                                            testcaseId, 
                                            projectId,
                                            dbErr);

                                reject(dbErr); 
                            }       
                        }
                    );
                }) 
            );
        } catch(e) {
            console.log(
                        "coud not delete test id '%s' for project id '%s', error:", 
                        testcaseId, 
                        projectId,
                        e);
          }
    };

}

module.exports = new TestcaseService()