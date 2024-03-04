const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const emailValidator = require('../middleware/email-validator');
const passwordValidator = require('../middleware/password-validator');

router.post('/signup', emailValidator, passwordValidator, userCtrl.signup);
router.post('/login', emailValidator, passwordValidator, userCtrl.login);

module.exports = router;