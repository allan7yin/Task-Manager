const validator = require('validator');
const Task = require('./task')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true, // guarantees only one email per user, will need to wipe db to use an index to keep track 
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word "password"');
            }
        }

    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age cannot be less than 0')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer // can store binary data here for image 
    }
},
    {
        timestamps: true
    }
);

// so, why do we have the below? It exists as a virtual property of the schema. Meaning, it is not an actual aatribute of the schema, but a way for 
// Mongoose to understand the relationship between a task and a User 
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'thisismynewcourse'); // this is using the unique object _id as payload claim
    // the second string is the secret, used in encoding 

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
}

userSchema.methods.toJSON = function () {
    const userObject = this.toObject(); // Mongoose methods, turns the user calling this method into an object 
    delete userObject.password;
    delete userObject.tokens;

    return userObject;

}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user;
}



// hash the plain text passwors before saving 
userSchema.pre('save', async function (next) {

    if (this.isModified('password')) { // this ensures that we onlt hash when the password is modified, mongoose provides us this function 
        this.password = await bcrypt.hash(this.password, 8); // remember, this is the current thing callig the fuction, in which case, is the user 
    }

    next();
})


userSchema.pre('remove', async function (next) {
    await Task.deleteMany({ owner: this._id })
    next()
});

const User = mongoose.model('User', userSchema);

module.exports = User;