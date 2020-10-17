const Project = require('../models/project');

/****************************
        Project service
*****************************/
class ProjectService {
  /*
  * Project find service
  */
  findProject(projectId) {
    return new Promise((resolve, reject) => {
      console.log("requesting DB for project id: %s", projectId);
      Project.findOne(
        { "id" : projectId}, { '_id': 0, '__v': 0}, 
        function(dbErr, dbRes) {
          if (dbRes) resolve(dbRes);
          else{
            console.log("not found response: %s", dbErr);
            reject(dbErr); 
          }       
        }
      );
    });
  };

  /*
  * get a Projects list filtered
  */
  async findProjects(filter) {
    try {
      return await (new Promise((resolve, reject) => {
        if(filter!=undefined)
          Project.find({       
            $or: [{ "name": {$regex: new RegExp(filter), $options: 'i'}}, 
                { "description": {$regex: new RegExp(filter), $options: 'i'}}]
            }, { '_id': 0, '__v': 0 }, 
            function(dbErr, dbRes) {
              if (dbRes) resolve(dbRes);
              else{
                console.log("not found response: %s", dbErr);
                reject(dbErr);}       
            });
        else
          Project.find( {}, { '_id': 0, '__v': 0 }, 
            function(dbErr, dbRes) {
              if (dbRes) resolve(dbRes);
              else{
                console.log("not found response: %s", dbErr);
                reject(dbErr); 
              }         
            }
        );
       }))} catch(e) {
         console.log("error response: %s", e);
    }    
  };

  /*
  * save a new Project
  */
  async saveProject(data) {
    try{
      return await ( new Promise((resolve, reject) => {    
        Project.create(data, 
          function(dbErr, dbRes) {
            if (dbRes){
              delete dbRes._doc._id;
              delete dbRes._doc.__v;
              resolve(dbRes);
            } else{
              console.log("not found response: %s", dbErr);
              reject(dbErr); 
            }       
          });
      }));
    } catch(e) {
      console.log("coud not create the project, error:", e);
    }
  };

  /*
  * update a Project
  */
  async update(projectId, data) {
    try{
      return await ( new Promise((resolve, reject) => {
       Project.findOneAndUpdate(
        { "id" : projectId}, data, { new: true },
          function(dbErr, dbRes) {
            if (dbRes) {
              delete dbRes._doc._id;
              delete dbRes._doc.__v;
              resolve(dbRes);
            } else{
              console.log("could not update project id '%s', error: %s", 
              projectId, dbErr);
              reject(dbErr); 
            }});
      }))
    } catch(e) {
      console.log("could not update test id '%s' for project id '%s', error:", 
        testcaseId, projectId, e);
    }
  };

  /*
  * delete project
  */
  async delete(projectId) {
    try {
      return await ( new Promise((resolve, reject) => {
        Project.deleteOne(
          { "id" : projectId}, 
          function(dbErr, dbRes) {
            if (dbRes){
              resolve(dbRes);
            } else{
              console.log("could not delete project id '%s', error:", 
                projectId, dbErr);
              reject(dbErr); 
            }
          }         
        )
      }))
    } catch(e) {
      console.log("could not delete project id '%s', error:", 
        projectId, e);
    }
  };
} module.exports = new ProjectService()