const express = require('express');
const auth = require('../middleware/auth'); // Middleware d'authentification si l'user s'est identifié
const router = express.Router(); // L'objet renvoyé par la méthode express.Router() intercepte les requêtes
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');


router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;