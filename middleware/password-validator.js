const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(4)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().symbols();

module.exports = (req, res, next) => {
    try {
        const password = req.body.password;
        const passwordValidation = passwordSchema.validate(password);
        if(passwordValidation === true) {
            next();
        } else {
            throw new Error('Password must consist of at least 8 characters comprising at least one of these: uppercase, lowercase, digit, symbol.');
        }
    } catch(error) {
        res.status(403).json({ error });
    };
};