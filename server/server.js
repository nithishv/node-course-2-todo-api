require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const port = process.env.PORT;

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

// Add Todo
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// List all Todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get Specifit Todo
app.get('/todos/:id', (req, res) => {
  var todoId = req.params.id;

  if(!ObjectID.isValid(todoId)) {
    return res.status(404).send();
  }

  Todo.findById(todoId).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// Delete a Todo
app.delete('/todos/:id', (req, res) => {
  var todoId = req.params.id;

  if(!ObjectID.isValid(todoId)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(todoId).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// Update a Todo
app.patch('/todos/:id', (req, res) => {
  var todoId = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(todoId)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(todoId, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send('NO TOOD');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

// Add users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/user/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

module.exports = {app};
