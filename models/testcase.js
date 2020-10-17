const mongoose   = require('mongoose'),
      AutoIncrement = require('mongoose-sequence')(mongoose);

const TestcaseSchema = new mongoose.Schema({
    title: String,
    description: String,
    projectId: String,
    status: Number,
    steps: []
})

TestcaseSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('testcases', TestcaseSchema)