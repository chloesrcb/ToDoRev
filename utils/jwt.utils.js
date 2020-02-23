var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'fe42Q6N7K4Q8dfq6ghqs7q12f6gh4q85lmqganozerFQSQ5156237fgvdzq';
module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id
        },JWT_SIGN_SECRET,{
            expiresIn: '1h'
        })
    }
}