const validator = require('validator');
const emailValidator = require('password-validator');

const emailSchema = new emailValidator();

emailSchema
.usingPlugin(validator.isEmail)

module.exports = (req, res, next) => {
    try {
        const email = req.body.email;
        const emailValidation = emailSchema.validate(email);
        if(emailValidation === true) {
            next();
        } else {
            throw new Error('Should be a valid email adress !');
        }
    } catch(error) {
        console.log(error);
        res.status(403).json({ error });
    };
};