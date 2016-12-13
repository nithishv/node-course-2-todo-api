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

  // deleteMany
/*  db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
    console.log(result.result.ok);
    console.log(result.result.n);
  }); */

  // deleteOne
/*  db.collection('Todos').deleteOne({text:'eat lunch'}).then((result) => {
    console.log(result.result.ok);
    console.log(result.result.n);
  }); */

  // findOneAndDelete
/*  db.collection('Todos').findOneAndDelete({completed: false}).then((doc) => {
    console.log(doc);
  }); */

  // challenge
/*  db.collection('Users').deleteMany({name: 'Nithish V'}).then((result) => {
    console.log(result.result.ok);
    console.log(result.result.n);
  }); */

  // challenge
  db.collection('Users').find({name: 'Adam Jensen'}).toArray().then((docs) => {
    var id = docs[0]._id;
    db.collection('Users').findOneAndDelete({_id: ObjectID(`${id}`)}).then((doc) => {
      console.log(doc);
    });
  });

  // db.close();
});
