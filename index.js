'use strict'

/**
* Module Dependencies
*/
const config = require('./config'),
restify = require('restify'),
mongodb = require('mongodb').MongoClient

/**
* Initialize Server
*/
const server = restify.createServer({
  name : config.name,
  version : config.version
})

/**
* Bundled Plugins
*/
server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())


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