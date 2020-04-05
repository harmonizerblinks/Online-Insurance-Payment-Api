const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const InsurancePaymentSchema = mongoose.Schema({
    apiurl: { type: String, required: true, default: 'http://api.alias-solutions.net:8443/chatbotapi/paynow/merchant' },
    key: { type: String, required: true, default: 'ukhv89yc984988dhdhf7' },
    code: { type: String, required: true, default: '500' },
    type: { type: String, required: true, default: '' },
    service: { type: String, required: true, default: 'Insurance Pay' },
    amount: { type: Schema.Types.Mixed, required: true, default: 0 },
    mobile: { type: String, required: false, default: '0' },
    network: { type: String, required: false, default: '' },
    token: { type: String, required: false },
    reference: { type: String, required: false, default: '' },
    callback: { type: String, required: false, default: 'https://paynow-insurance-api.herokuapp.com/app/callback' },
    created: { type: Date, index: true, default: Date.now }
});

const InsuranceDetailSchema = mongoose.Schema({
    cust_type: { type: String, required: true },
    cover_type: { type: String, required: false },
    vehicle: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    no_of_seats: { type: String, required: true },
    year_of_manufacture: { type: String, required: true },
    chasis_number: { type: String, required: true },
    reg_number: { type: String, required: true },
    body_type: { type: String, required: false },
    created: { type: Date, index: true, default: Date.now }
});

const InsuranceSchema = mongoose.Schema({
    code: { type: String, minlength: 3, maxlength: 8, required: true },
    firstname: { type: String, minlength: 3, maxlength: 20, required: true },
    lastname: { type: String, minlength: 3, maxlength: 20, required: true },
    othername: { type: String, minlength: 3, maxlength: 20, required: true },
    email: { type: String, minlength: 6, maxlength: 60, required: true, },
    mobile: { type: String, minlength: 10, maxlength: 15, required: true },
    dateofbirth: { type: Date, required: true },
    address: { type: String, minlength: 5, maxlength: 200, required: true },
    digital_address: { type: String, required: false },
    postal_address: { type: String, required: false },
    id_type: { type: String, required: true },
    id_number: { type: String, required: true },
    tin: { type: String, required: false },
    occupation: { type: String, required: false },
    package_id: { type: Schema.Types.ObjectId, ref: 'package', required: true },
    details: { type: InsuranceDetailSchema, required: true },
    payment: { type: InsurancePaymentSchema, required: false },
    status: { type: String, required: true, default: 'Pending' },
    response: { type: Object, required: false },
    callback: { type: Object, required: false },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

InsuranceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('insurance', InsuranceSchema);