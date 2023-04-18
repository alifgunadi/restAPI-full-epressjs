const DeliveryAddress = require('./model.js');
let { policyFor } = require('.././../utils/index.js');
const { subject } = require('@casl/ability');

const index = async (req, res) => {
    try {
        let { payload } = req.body;
        let review = await DeliveryAddress.find(payload);

        console.log(review);
        return res.json(review);

    } catch (error) {
        if (error && error.name === 'Validation error') {
            res.json({
                error: error,
                message: error.message,
                field: error.errors
            })
        }
    };
};

const getUserId = async (req, res) => {
    try {
        let { id } = req.params;
        let getId = await DeliveryAddress.findById(id);

        console.log(getId);
        return res.json(getId);

    } catch (error) {
        if (error && error.name === 'Validation error') {
            return res.json({
                error: error,
                message: error.message,
                field: error.errors
            })
        }
    }
};

const remove = async (req, res) => {
    try {
        let { id } = req.params;
        let removeAddress = await DeliveryAddress.findByIdAndDelete(id);
        console.log(removeAddress);
        return res.json(removeAddress);

    } catch (error) {
        if (error && error.name === 'Validation error') {
            return res.json({
                error: error,
                message: error.message,
                field: error.errors
            })
        }
    }
};


const store = async (req, res) => {
    try {
        let payload = req.body;
        let user = req.user;
        let add = new DeliveryAddress({...payload, user: user._id});
        console.log(add);
        
        await add.save();
        return res.json(add);
        
    } catch (error) {
        if (error && error.name === 'Validation error') {
            return res.json({
                error: error,
                message: error.message,
                field: error.errors
            })
        }
    }
};

const update = async (req, res) => {
    try {
        let { _id, ...payload } = req.body;
        let { id } = req.params;
        let address = await DeliveryAddress.findById(id);
        let subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user});
        let policy = policyFor(req.user);
        if (!policy.can('update', subjectAddress)) {
            res.json({
                error: 1,
                message: "You are not allowed to update this resource"
            })
        };

        address = await DeliveryAddress.findByIdAndUpdate(id, payload,{ new: true });
        console.log(address);
        return res.json(address);


    } catch (error) {
        if (error && error.name === 'Validation error') {
            return res.json({
                error: error,
                message: error.message,
                field: error.errors
            })
        };
    }
};

module.exports = {
    index,
    getUserId,
    remove,
    store,
    update,
}