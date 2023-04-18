const Tag = require("./model");

const index = async (req, res, next) => {
  try {
    let payload = req.body;
    let view = await Tag.find(payload);
    return res.json(view);
  } catch (error) {
    if (error && error.name === `Validations error`) {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const getId = async (req, res, next) => {
  try {
    let { id } = req.params;
    let search = await Tag.findById(id);
    return res.json(search);
  } catch (error) {
    if (error && error.name === `Validation error`) {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = new Tag(payload);
    await tag.save();
    return res.json(tag);
  } catch (error) {
    if (error && error.name === `Validations error`) {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;
    let tag = await Tag.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(tag);
  } catch (error) {
    if (error && error.name === `Validation error`) {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    let { id } = req.params;
    let tag = await Tag.findByIdAndDelete(id);
    return res.json(tag);
  } catch (error) {
    if (error && error.name === `Validations error`) {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

module.exports = {
  index,
  getId,
  store,
  update,
  remove,
};
