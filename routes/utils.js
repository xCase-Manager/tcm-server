"use strict";
 
/*
  Validator
*/
exports.readBody = function (schema, req, res) {
    let body = [];
    req.on('data', (chunk) => {
                                body.push(chunk);
                              }
          ).on('end', () => {
                              body = Buffer.concat(body).toString();
                              var validator = require("./validations/validator");
                              var error = validator.validate(validator.schema.project, body);
                              console.log("validation error:\n%s", error)
                            }
              );
};