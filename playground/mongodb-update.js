// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name: 'Nithish', age: 26};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected to MongoDB Server');

  // findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate({
  //   _id: ObjectID("5850119f982af9fe3dd5fe4d")
  // }, {
  //   $set : {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // challenge
  db.collection('Users').findOneAndUpdate({
    name: 'Adam Sandler'
  }, {
    $set: {
      name: 'Captain Adam'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((doc) => {
    console.log(doc);
  });

  // db.close();
});
