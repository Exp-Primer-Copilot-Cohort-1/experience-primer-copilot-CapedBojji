// Create web server

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const uuid = require('uuid/v4');

const app = express();

const port = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

const commentsById = {};
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const comments = commentsByPostId[postId] || [];

  res.status(200).send(comments);
});

app.post('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const commentId = uuid();
  const { content } = req.body;
  const comments = commentsByPostId[postId] || [];

  const newComment = {
    id: commentId,
    content,
    postId,
  };

  comments.push(newComment);

  commentsById[commentId] = newComment;
  commentsByPostId[postId] = comments;

  res.status(201).send(newComment);
});

app.listen(port, () => {
  console.log(`Comments service listening on port ${port}`);
});