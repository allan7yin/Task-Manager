const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisismynewcourse'); // verify returns the decoded payload, or throws an error, which will be caught in the catch block
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        // the tokens.token verifies that the user indeed does have te token for authenticatio

        if (!user) {
            throw new Error()
        }

        req.token = token;
        req.user = user; // we've already retreated once from the db, so we can add this property to the request 
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate ' })
    }
}

module.exports = auth;