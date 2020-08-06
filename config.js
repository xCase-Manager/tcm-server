'use strict'

module.exports = {
    name: 'tcm-server-api',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    db: {
        uri: 'mongodb://localhost:27017/TCM'
    }
}