const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

// Todo.remove({}) -- cant pass blank parameter
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({})
Todo.findOneAndRemove({text: 'Hello'}).then((todo)=>{});

// Todo.findByIdAndRemove({})
Todo.findByIdAndRemove('5858d4dc6ac14c961c7f33b4').then((todo) => {
  console.log(todo);
});
