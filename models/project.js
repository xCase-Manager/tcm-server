const mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/TCM', {useNewUrlParser: true});

const ProjectSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    icon: String,
    created: Date
})

module.exports = mongoose.model('projects', ProjectSchema)