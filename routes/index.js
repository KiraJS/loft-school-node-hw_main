const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');
const newsCtrl = require('../controllers/news');

/* Users requests */
router.post('/saveNewUser', userCtrl.createUser);
router.post('/login', userCtrl.loginUser);
router.put('/updateUser/:id', userCtrl.updateUser);
router.get('/getUsers', userCtrl.getUsers);
router.delete('/deleteUser/:id', userCtrl.deleteUser);
router.put('/updateUserPermission/:id', userCtrl.updatePermission);
router.post('/authFromToken', userCtrl.authFromToken);
router.post('/saveUserImage/:id', userCtrl.saveUserImage);

/* News requests */
router.get('/getNews', newsCtrl.getNews);
router.post('/newNews', newsCtrl.newNews);
router.put('/updateNews/:id', newsCtrl.updateNews);
router.delete('/deleteNews/:id', newsCtrl.deleteNews);

module.exports = router;
