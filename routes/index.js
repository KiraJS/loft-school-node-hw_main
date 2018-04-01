const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const userCtrl = require('../controllers/users');
const newsCtrl = require('../controllers/news');

// // /* Base route */
// router.get('*', function(req, res, next) {
//   res.send(fs.readFileSync(path.resolve(path.join('public', 'index.html')), 'utf8'));
// });

/* Users requests */
router.post('/api/saveNewUser', userCtrl.createUser);
router.post('/api/login', userCtrl.loginUser);
router.put('/api/updateUser/:id', userCtrl.updateUser);
router.get('/api/getUsers', userCtrl.getUsers);
router.delete('/api/deleteUser/:id', userCtrl.deleteUser);
router.put('/api/updateUserPermission/:id', userCtrl.updatePermission);
router.post('/api/authFromToken', userCtrl.authFromToken);
router.post('/api/saveUserImage/:id', userCtrl.saveUserImage);

/* News requests */
router.get('/api/getNews', newsCtrl.getNews);
router.post('/api/newNews', newsCtrl.newNews);
router.put('/api/updateNews/:id', newsCtrl.updateNews);
router.delete('/api/deleteNews/:id', newsCtrl.deleteNews);

module.exports = router;
