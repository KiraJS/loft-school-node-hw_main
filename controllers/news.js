require('../models/news');
const mongoose = require('mongoose');
const News = mongoose.model('news');
const usersCtrl = require('./users');

const uid = require('uid');

getNews = function(req, res){
  News.find().then(
    items => {
      items.forEach(function(item){
        item.user = usersCtrl.getUserById(item.userId);
      });
      console.log(items);
      return res.json(items);
    }
  ).catch(e => {
    console.log(e);
    return res.status(400).json({ err: e.message });
  });
};

module.exports.newNews = function(req, res){
  const newNews = new News({
    userId: req.body.userId,
    date: req.body.date,
    text: req.body.text,
    theme: req.body.theme,
    id: uid(15)
  });
    newNews.save()
      .then(() => {
      getNews(req, res);
    })
}


module.exports.updateNews = function(req, res){
  let id = req.params.id;
  let newNewsData = {
    date: req.body.date,
    id: req.body.id,
    text: req.body.text,
    theme: req.body.theme,
    userId: req.body.userId
  };
  News.findOneAndUpdate(
    {id:id}, {$set: newNewsData}, { new: true })
    .then(item => {
      !item ? getNews(req,res) : res.status(404).json({ err: 'Новость не найдена' });
    })
    .catch(e => {
      res.status(400).json({ err: e.message });
    });
}

module.exports.deleteNews = function(req, res){
  let id = req.params.id;
  News.findOneAndRemove({id:id})
    .then(item => {
      !item ? getNews(req,res) : res.status(404).json({ err: 'Новость не найдена' });
    })
    .catch(e => {
      res.status(400).json({ err: e.message });
    });
}

module.exports.getNews = getNews;
