const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

var todoId = "5856cdc0fe9b496785dd75e4";

var userID = "585035ddb7040a10f84e365c";

// if(!ObjectID.isValid(todoId)) {
//   console.log('ID not Valid');
// } else {

  // Todo.find({
  //   _id: todoId
  // }).then((todos) => {
  //   console.log('\nTodos', todos);
  // });
  //
  // Todo.findOne({
  //   _id: todoId
  // }).then((todo) => {
  //   console.log('\nTodo', todo);
  // });

  // Todo.findById(todoId).then((todo) => {
  //   if(!todo) {
  //     return console.log('No match for ID');
  //   }
  //   console.log('Todo By ID', todo);
  // }).catch(err => console.log(err))
// }

if(!ObjectID.isValid(userID)){
  console.log('User ID is not Valid');
}else {
  User.findById({
    _id: userID
  }).then((user) => {
    if(!user) {
      return console.log('User not found');
    }
    console.log('\nUser', user);
}).catch(err => console.log('Err', err))
}
