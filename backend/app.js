const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose.connect("mongodb+srv://neelaka:ZrRegUUnKMkvDLnh@cluster0-cqfnr.mongodb.net/node-angular?retryWrites=true&w=majority").then(() => {
  console.log('Connect to Database!');
})
  .catch(() => {
    console.log('Connection Failed');
  });
// ZrRegUUnKMkvDLnh
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin', '*'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(careatedPost => {
    res.status(201).json({
      message: 'Post added Sucessfully!',
      postId: careatedPost._id
    });
  });
});

  app.put('/api/posts/:id', (req, res, next) => {
    const post = new Post({
      _id : req.body.id,
      title: req.body.title,
      content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then( result => {
      res.status(200).json({message: "Update successfull!!" });
    });
  });


app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(document => {
      res.status(200).json({
        message: 'Post featched succesfully',
        posts: document
      });
    });
});

  app.get('/api/posts/:id', (req, res, next)=>{
    Post.findById(req.params.id).then(post =>{
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({message: 'Post not found!'});
      }
    });
  });

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Post Successfully Deleted!'
    });
  });
});
module.exports = app;
