const Project = require('../models/project');

class ProjectService {
    /****************************
        Project service
    *****************************/

    /*
        Project finder service
    */
    //Step 1: declare promise
    findProject(projectId) {
        return new Promise((resolve, reject) => {
           console.log("requesting DB for project id: %s", projectId);

           Project.findOne(
            { "id" : projectId},
            { '_id': 0 }, 
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
        });
    };

    //Step 2: async promise handler
    async getProject(projectId) {
        console.log("getting project id %s", projectId);
        return await (this.findProject(projectId));
    };

    // Projects finder service
    async getProjects() {
        try {
            return await (  new Promise((resolve, reject) => {
                console.log("requesting DB for projects list");
                Project.find(
                        { '_id': 0, '__v': 0 }, 
                        function(dbErr, dbRes) {
                            if (dbRes){
                                //console.log("found response: %s", dbRes);
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

    // Filtered projects finder service
    async getProjects(filter) {
        try {
            return await (  new Promise((resolve, reject) => {
            console.log("requesting DB for projects filtered by '%s'", filter);
            var regex = new RegExp("/" + filter + "/");        
            Project.find({       
                            $or: [
                                { "name":  { $regex: new RegExp(filter), $options: 'i' } }, 
                                { "description":  { $regex: new RegExp(filter), $options: 'i' } }
                            ]
                        },
                        { '_id': 0, '__v': 0 }, 
                        function(dbErr, dbRes) {
                                if (dbRes){
                                    //console.log("found response: %s", dbRes);
                                    resolve(dbRes);
                                } else{
                                    console.log("not found response: %s", dbErr);
                                    reject(dbErr); 
                                }       
                        }
                    );
                }))
        } catch(e) {
                console.log("error response: %s", e);
            }    
    };

    // Project creation
    async saveProject(data) {
        try{
            return await ( new Promise((resolve, reject) => {
                console.log("requesting DB to create a project");         
                Project.create(data, 
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
            console.log("coud not create the project, error:", e);
          }
    };

    // Project update 
    async update(projectId, data) {
        try{
            return await ( new Promise((resolve, reject) => {
                console.log("requesting DB to update a project for project id '%s'", projectId);
                console.log("---> data: '%s'", data);
    
                Project.findOneAndUpdate(
                    { "id" : projectId},
                    data,
                    { new: true },
                    function(dbErr, dbRes) {
                        if (dbRes){
                            console.log("update response: %s", dbRes);
                            resolve(dbRes);
                        } else{
                            console.log(
                                    "could not update project id '%s', error: %s", 
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
                    e
                );
            }
    };
}
  
module.exports = new ProjectService()