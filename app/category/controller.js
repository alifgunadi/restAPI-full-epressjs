const Categories = require('./model');

const index = async (req, res, next) => {
    try {
        
        let payload = req.body;
        let category = await Categories.find(payload);
        return res.json(category)
        
    } catch (error) {
        if (error && error.name === `Validations error`) {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        };
        next(error);
    }
};

const getId = async (req, res, next) => {
    try {
        let { id } = req.params;
        let search = await Categories.findById(id);
        return res.json(search)
    } catch (error) {
        if (error && error.name === `Validation Error`) {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        };
        next(error);
    }
}

const store = async (req, res, next) => {
    try {

        let payload = req.body;
        let category = new Categories(payload);
        await category.save();
        return res.json(category);

    } catch (error) {
        if (error && error.name === `Validation error`) {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        };
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        
        let payload = req.body;
        let { id } = req.params;
        let category = await Categories.findByIdAndUpdate(id, payload, {
            new:true,
            runValidators: true
        });
        return res.json(category);

    } catch (error) {
        if (error && error.name === `Validation error`) {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        };
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        
        let payload = req.body;
        let { id } = req.params;
        let category = await Categories.findByIdAndDelete(id, payload);
        return res.json(category);

    } catch (error) {
        if (error && error.name === `Validation error`) {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        };
        next(error);
    }
}

module.exports = {
    index,
    getId,
    store,
    update,
    remove
}