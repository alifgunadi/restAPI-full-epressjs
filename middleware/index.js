const { getToken, policyFor } = require('../utils/index');
const config = require('../app/config');
const Users = require('../app/user/model');
const jwt = require('jsonwebtoken');


function decodeToken () {
    return async function (req, res, next) {
        try {
            const token = getToken(req);
            if (!token) {
                return next()
            };

            const decodedToken = jwt.verify(token, config.secretKey)
            req.user = decodedToken;

            const user = await Users.findOne({token: {$in: [token]}});
            res.json(user);
            
        } catch (error) {
            if (error && error.name === `JSONWebToken Error`) {
                return res.json({
                    error: 1,
                    message: error.message
                })
            };
            next(error);
        };
        next();
    }
};

function police_check (action, subject) {
    console.log(action, subject);
    return async function(req, res, next) {
        let policy = policyFor(req.user);
        console.log(policy);
        if (!policy.can(action, subject)) {
            res.json({
                error: 1,
                message: `You are not allowed to ${action} the ${subject}`
            })
        }
        next();
    }
};

module.exports = {
    decodeToken,
    police_check,
}