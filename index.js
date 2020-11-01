'use strict'

/**
* Module Dependencies
*/
const config = require('./config'),
restify = require('restify'),
mongodb = require('mongodb').MongoClient

/*
* CORS handler dependencies
*/
const corsMiddleware = require('restify-cors-middleware')
const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})

/**
* Initialize Server
*/
const server = restify.createServer({
  name : config.name,
  version : config.version
})

/**
* CORS handler
*/
function corsHandler(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  res.setHeader('Access-Control-Allow-Headers', 'origin, x-requested-with');
  res.setHeader('Access-Control-Allow-Methods', 'GET');  
  return next();
}

/**
* Options
*/
function optionsRoute(req, res, next) { 
  res.send(200);
  return next();
}

/**
* CORS Handler
*/
server.pre(cors.preflight)
server.use(cors.actual)

/**
* Bundled Plugins
*/
server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())

server.opts('/\.*/', corsHandler, optionsRoute);

/**
* Lift Server, Connect to DB & Require Route File
*/
server.listen(config.port, () => {
  
    // Connect to DB with MongoClient
    mongodb.connect(config.db.uri, (err, client) => {
        if (err) {
            console.log('An error occurred while attempting to connect to MongoDB', err)
            process.exit(1)
        }

        console.log(
            '%s v%s ready to accept connections on port %s in %s environment.',
            server.name,
            config.version,
            config.port,
            config.env
        )

        var db = client.db('TCM');
        require('./routes/project')({ db, server})  
        require('./routes/testcase')({ db, server})     
    });
})
module.exports = server