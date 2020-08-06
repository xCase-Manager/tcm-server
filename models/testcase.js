const mongoose   = require('mongoose'),
      AutoIncrement = require('mongoose-sequence')(mongoose);

const TestcaseSchema = new mongoose.Schema({
    title: String,
    description: String,
    projectId: String,
    steps: []
})

TestcaseSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('testcases', TestcaseSchema)