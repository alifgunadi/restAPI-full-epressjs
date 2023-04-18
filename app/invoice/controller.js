const Invoice = require('./model');
const { subject } = require('@casl/ability');
const { policyFor } = require('../../utils');

const show = async (req, res) => {
    try {
        let policy = policyFor(req.user);
        let subjectInvoice = subject('Invoice', {...invoice, user_id: invoice.user._id});
        if (!policy.can('read', subjectInvoice)) {
            res.json({
                error: 1,
                message: 'Anda tidak memiliki akses untuk melihat invoice ini'
            })
        };
        
        let { order_id } = req.params;
        let invoice = new Invoice.findOne({order: order_id}).populate('order', 'user');

        return res.json(invoice);

    } catch (error) {
        if (error && error.name === "Validation error") {
            return res.json({
                error: error,
                message: error.message,
                field: error.errors
            })
        }
    }
};

module.exports = {
    show
}
