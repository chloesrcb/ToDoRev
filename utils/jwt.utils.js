var jwt = require('jsonwebtoken');

const JWT_KEY = 'fe42Q6N7K4Q8dfq6ghqs7q12f6gh4q85lmqganozerFQSQ5156237fgvdzq';
module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id
        },JWT_KEY,{
            expiresIn: '1h'
        })
    },

    verify: function(token){
        try{
            var verified = jwt.verify(token,JWT_KEY);
          }catch(e){
              console.log("Non verifié");
            return undefined;
          }
          return jwt.decode(token).userId;
    }
}