const Mail = require('../models/mail.model.js');
const nodemailer = require("nodemailer");


// POST a Mail
exports.create = async(req, res) => {
    // Create a Mail
    const mail = new Mail(req.body);
    console.log('processing')
    
    mail.info = await sendmain(req.body);
    console.log(mail.info)

    // Save a Mail in the MongoDB
    mail.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Mails
exports.findAll = (req, res) => {
    console.log('fine All');
    Mail.find().sort({ created: -1 })
        .then(mail => {
            // console.log(mail)
            res.send(mail);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Mail
exports.findOne = (req, res) => {
    Mail.findById(req.params.mailId)
        .then(mail => {
            if (!mail) {
                return res.status(404).send({
                    message: "Mail not found with id " + req.params.mailId
                });
            }
            res.send(mail);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Mail not found with id " + req.params.mailId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Mail with id " + req.params.mailId
            });
        });
};

// UPDATE a Mail
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find mail and update it
    Mail.findByIdAndUpdate(req.params.mailId, body, { new: true })
        .then(mail => {
            if (!mail) {
                return res.status(404).send({
                    message: "Mail not found with id " + req.params.mailId
                });
            }
            res.send(mail);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Mail not found with id " + req.params.mailId
                });
            }
            return res.status(500).send({
                message: "Error updating mail with id " + req.params.mailId
            });
        });
};

// DELETE a Mail
exports.delete = (req, res) => {
    Mail.findByIdAndRemove(req.params.mailId)
        .then(mail => {
            if (!mail) {
                return res.status(404).send({
                    message: "Mail not found with id " + req.params.mailId
                });
            }
            res.send({ message: "Mail deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Mail not found with id " + req.params.mailId
                });
            }
            return res.status(500).send({
                message: "Could not delete mail with id " + req.params.mailId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// async..await is not allowed in global scope, must use a wrapper
async function sendmain(value) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
    // console.info(testAccount);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ipage.com",
        port: 587,
        secure: true,
        auth: {
            user: 'info@paynowafrica.com',
            pass: 'Payn0w@2019',
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: value.website +' <'+ value.email +'>', // sender address
        to: value.to, // "bar@example.com, baz@example.com", // list of receivers
        cc: value.cc,
        bcc: value.bcc,
        replyTo: value.email,
        subject: value.subject, // "Hello ✔", // Subject line
        // text: value.text,// "Sending Mail with Harmony Mailer", // plain text body
        html: value.body, // html body
    }, (error, info) => {
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log(info);
            return info;
        }
    });

    // console.log("Message sent: %s", info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    return info;
}