var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

module.exports = {app};
