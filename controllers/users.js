const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');
const uid = require('uid');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const Users = mongoose.model('user');

module.exports.createUser = function(req, res) {
  let User = new Users({
    username: req.body.username,
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    surName: req.body.surName,
    id: uid(15),
    access_token: uid(15),
    permissionId: uid(15),
    permission: req.body.permission,
    image: req.body.image
  });
  User.password = User.setPassword(req.body.password);
  User.save()
    .then(user => {
      res.json(user);
    })
    .catch(e => {
      res.status(400).json({ err: e.message });
    });
};

module.exports.loginUser = function(req, res) {
  Users.findOne({ username: req.body.username })
    .then(user => {
      user.access_token = uid(15);
      user.save();
      req.body.remembered !== undefined && req.body.remembered ? res.cookie('access_token', user.access_token) : null;
      return user.validatePassword(req.body.password) ? res.json(user) : res.status(400).json({ err: 'Неверный пароль' });
    })
    .catch(e =>{
      res.status(400).json({ err: e.message });
    })
};

module.exports.updateUser = function (req, res) {
  let id = req.params.id;
  let newUserData = {};
  Users.findOne({ id: id })
    .then((user) => {
    req.body.firstName ? newUserData.firstName = req.body.firstName : newUserData.firstName = user.firstName;
    req.body.middleName ? newUserData.middleName = req.body.middleName : newUserData.middleName = user.middleName;
    req.body.surName ? newUserData.surName = req.body.surName : newUserData.surName = user.surName;
    if (req.body.oldPassword && user.validatePassword(req.body.oldPassword) && req.body.password) {
      newUserData.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
    }
      Users.findOneAndUpdate({ id: id }, {$set: newUserData}, { new: true })
        .then(user => {
          user ? res.json(user) : res.status(404).json({ err: 'Пользователь не найден' });
        })
  })
    .catch(e =>{
      res.status(400).json({ err: e.message });
    })
};

getUsers = function (req, res) {
  Users.find().then(
    users => {
      return res.json(users);
    }
  ).catch(e => {
    return res.status(400).json({ err: e.message });
  });
}

module.exports.getUsers = getUsers;

module.exports.deleteUser = function (req, res) {
  let id = req.params.id;
  Users.findOneAndRemove({ id: id })
    .then(user => {
      !user ? getUsers(req, res) : res.status(404).json({ err: 'Пользователь не найден' });
    })
    .catch(e => {
      res.status(400).json({ err: e.message });
    });
};

module.exports.updatePermission = function (req, res) {
  let permissionId = req.body.permissionId;
  let permission = req.body.permission;
  Users.findOne({ permissionId: permissionId })
    .then(user => {
      for (let prop in permission.chat) {
        user.permission.chat[prop] = permission.chat[prop];
      };
      for (let prop in permission.setting) {
        user.permission.setting[prop] = permission.setting[prop];
      };
      for (let prop in permission.news) {
        user.permission.news[prop] = permission.news[prop];
      };
      user.save();
    })
    .catch(e => { res.status(400).json({ err: e.message });})
}

module.exports.saveUserImage = function (req, res) {
  let form = new formidable.IncomingForm();
  let fileName;
  let id = req.params.id;
  form.parse(req, function (err, fields, files) {
    form.uploadDir = path.join(process.cwd(), 'public/upload');
    fileName = path.join('public/upload/', id + files[id]['name']);
    fileNamedb = path.join('upload', id + files[id]['name']);
    fs.rename(files[id]['path'], fileName, () => {
      Users.findOneAndUpdate({ id: id }, { image: fileNamedb }, { new: true })
        .then(user => {
        user ? res.json({ path: fileName }) : res.status(404).json({ err: 'Пользователь не найден' });
      })
        .catch(e => {
          res.status(400).json({ err: e.message });
      });
    });
  })
};

module.exports.authFromToken = function(req, res){
  Users.findOne({ access_token: req.body.access_token })
    .then(user => {
      user ? res.json(user)  : res.status(404).json({ err: 'Пользователь не найден' });
    })
    .catch(e => {
      res.status(400).json({ err: e.message });
    });
}

module.exports.getUserById = function (userId) {
  return new Promise((resolve, reject) => {
    Users.findOne({ id: userId })
      .then(item => {
        resolve(item);
      })
  });
};