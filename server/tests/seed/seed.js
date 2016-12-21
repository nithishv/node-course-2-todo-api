const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const dummyTodos = [{
  _id: new ObjectID(),
  text: 'First Todo',
  completed: false
},{
  _id: new ObjectID(),
  text: 'Second Todo',
  completed: true,
  compltedAt: 333
}];

var userOneID = new ObjectID();
var userTwoID = new ObjectID();
const dummyUsers = [{
  _id: userOneID,
  email: 'userOne@gmail.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoID,
  email: 'userTwo@gmail.com',
  password: 'userTwoPassword'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(dummyTodos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(dummyUsers[0]).save();
    var userTwo = new User(dummyUsers[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {dummyTodos, populateTodos, dummyUsers, populateUsers};
