const validator = require('validator');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // this creates a reference from this field to another model, which in this case, is the User model (spelling and capitals matter)
        // this will allow us to fetch an entire user from this field of a task 
    }
},
    {
        timestamps: true
    }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
