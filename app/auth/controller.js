const Users = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils/index.js');

const index = async (req, res, next) => {
    try {
        let { payload } = req.body;
        let count = await Users.find().countDocuments();
        let user = await Users.find(payload);
        console.log(user);
        return res.json({data: 'Users', user, count})

    } catch (error) {
        if (error && error.name === `Validation error`) {
            res.json({
                error: 1,
                message: error.message,
                field: error.errors
            })
        };
        next(error);
        console.log(error);
    }
};

const getId = async (req, res, next) => {
    try {
        let { id } = req.params;
        let search = await Users.findById(id)
        console.log(search);
        return res.json(search);

    } catch (error) {
        if (error && error.name === `Validation error`) {
            res.json({
                error: 1,
                message: error.message,
                field: error.errors
            })
        };
        next(error);
    }
};

const deleteId = async (req, res, next) => {
    try {
        let { id } = req.params;
        let search = await Users.findByIdAndDelete(id)
        console.log(search);
        return res.json(search);

    } catch (error) {
        if (error && error.name === `Validation error`) {
            res.json({
                error: 1,
                message: error.message,
                field: error.errors
            })
        };
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        let payload = req.body;
        let user = new Users(payload);
        await user.save();
        console.log(user);
        return res.json(user)
        
    } catch (error) {
        if (error && error.name === `Validation error`) {
            res.status(404).json({
                error: 1,
                message: error.message,
                field: error.errors
            })
        };
        next(error);
    } 
};
 
const localStrategy = async (email, password, done) => {
    try {
        let user = await Users.findOne({email}).select('-__v -updatedAt -createdAt -cart_items -token');
        if (!user) return done();

        if (bcrypt.compareSync(password, user.password)) {
           const {password, ...userWithoutPassword} = user.toJSON();
            return done(null, userWithoutPassword);
        };
    } catch (error) {
        done(error, null)
    };
    done();
};

const login = async (req, res, next) => {
    passport.authenticate('local', async function(error, user) {
            if (error) return next(error);
            if (!user) return res.send({ error: 1, message: "Incorrect email or password" });
    
            let signed = jwt.sign(user, config.secretKey);

            await Users.findByIdAndUpdate(user._id , {$push: { token: signed }})
            return res.json({
                message: "Login successfully",
                user,
                token: signed
            });
    })(req, res, next);
};

const logout = async (req, res) => {
        const token = getToken(req);
        const user = Users.findOneAndUpdate({token: {$in: [token]}}, {$pull: {token: token}}, {useFindAndModify: false});

        if (!user || !token) {
            return res.json({
                error: 1,
                status: "Email or password incorrect"
            });
        }  else {
            return user;
        }
}

const me = (req, res, next) => {
        let token = getToken(req)
        let user = Users.findOne({token: {$in: [token]}});
        if (!user) {
            res.json({
                error: 1,
                message: error.message
            })
        } else {
            res.json({
                user
            })
        }
    next();
};


module.exports = {
    index,
    getId,
    deleteId,
    register,
    localStrategy,
    login,
    logout,
    me
}