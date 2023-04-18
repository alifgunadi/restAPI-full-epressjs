const path = require("path");
const fs = require("fs");
const config = require("../config.js");
const Product = require("./model.js");
const Category = require('../category/model.js');
const Tag = require('../tag/model.js');

const index = async (req, res, next) => {
    try {
        // let product = await Product.find().populate("category tags");
        let { skip = 0, limit = 10, search = '', category = '', tags = '' } = req.query;
        let criteria = {};

        if (search.length) {
            criteria = { ...criteria, name: {$regex: `${search}`, $options: `i`}};
        };

        if (category.length) {
            let categoryResult = await Category.findOne({name: {$regex: `${category}`, $options: 'i'}});
            if (categoryResult) {
                criteria = { ...criteria, category: categoryResult._id };
            } else {
                res.json({
                    status: 'Failed',
                    message: 'Resource Not Found: ' + req.originalUrl,
                });
            }
        };

        if (tags.length) {
            let tagsResult = await Tag.find({name: {$in: tags} });
            if (tagsResult.length > 0) {
                criteria = { ...criteria, tags: {$in: tagsResult.map(tag => tag._id)} };
            } else {
                res.json({
                    status: 'Failed',
                    message: 'Resource Not Found: ' + req.originalUrl,
                });
            }
        };

        console.log(criteria);
        
        let product = await Product.find(criteria).skip(parseInt(skip)).limit(parseInt(limit)).populate("category tags");
        let count = await Product.find().countDocuments();
        return res.send({
            data: product,
            count
        });
    } catch (error) {
        if (error && error.name === `Validations error`) {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors,
            });
        }
        next(error);
    };
};

const getId = async (req, res, next) => {
    try {
        let payload = req.body;
        let { id } = req.params;
        let product = await Product.findById(id, payload).populate("category tags");
        return res.send(product);
    } catch (error) {
        if (error && error.name === `Validation error`) {
            res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        };
        next(error);
    }
};

const deleteItem = async (req, res, next) => {
    try {
        // let payload = req.body;
        // let { id } = req.params;
        // let product = await Product.findByIdAndDelete(id, payload);
        // return res.json(product)

        let product = await Product.findByIdAndDelete(req.params.id);
        let currentImage = `${config.rootPath}/images/products/${product.image_url}`;

        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
        };
        return res.json(product);
    } catch (error) {
        if (error && error.name === `Validation error`) {
            res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    };
};

const store = async (req, res, next) => {
    try {
        let payload = req.body;

      if (payload.category) {
        let category = await Category.findOne({name: {$regex: payload.category, $options: 'i'}});
        if (category) {
          payload = {...payload, category: category._id};
        } else {
          delete payload.category;
        }
      };

      if (payload.tags && payload.tags.length > 0) {
        let tags = await Tag.find({name: {$in: payload.tags}});
        if (tags.length) {
          payload = {...payload, tags: tags.map(tag => tag._id)};
        } else {
          delete payload.tags;
        }
      };

        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
            let filename = req.file.filename + "." + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on("end", async () => {
                try {
                    let product = new Product({ ...payload, image_url: filename });
                    await product.save();
                    return res.json(product);
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if (error && error.name === "Validation error") {
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields: error.errors,
                        });
                    }
                    next(error);
                }
            });

            src.on("error", async () => {
                next(error);
            });
            
        } else {

            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }

        
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

        if (payload.category) {
          let category = await Category.findOne({name: {$regex: payload.category, $options: 'i'}});
          if (category) {
            payload = {...payload, category: category._id};
          } else {
            delete payload.category;
          }
        };
  
        if (payload.tags && payload.tags.length > 0) {
          let tags = await Tag.find({name: {$in: payload.tags}});
          if (tags.length) {
            payload = {...payload, tags: tags.map(tag => tag._id)};
          } else {
            delete payload.tags;
          }
        };

        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
            let filename = req.file.filename + "." + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on("end", async () => {
                try {
                    let product = await Product.findById(id);
                    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
                    
                    console.log(currentImage);
                    if(fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage)
                    };
                    
                    await Product.findByIdAndUpdate(id, payload, {
                        new: true,
                        runValidators: true
                    });
                    return res.json(product);
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if (error && error.name === "Validation error") {
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields: error.errors,
                        });
                    }
                    next(error);
                }
            });

            src.on("error", async () => {
                next(error);
            });
            
        } else {

            let product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            });
            return res.json(product);
            
        }
        
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

module.exports = {
    index,
    getId,
    deleteItem,
    store,
    update
};
