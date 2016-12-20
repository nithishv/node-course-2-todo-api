const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
// const {Todo} = require('./../models/todo');
const {Todo} = require('./../models/todo');

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

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(dummyTodos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new Todo', (done) => {
    var text = 'This is a Test Todo';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find({text}).then((todos) =>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create Todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send()
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
 it('should return todo doc', (done) => {
   request(app)
    .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(dummyTodos[0].text);
    })
    .end(done);
 });

 it('should return a 404 if todo not found', (done) => {
   request(app)
    .get(`/todos/${(new ObjectID()).toHexString()}`)
    .expect(404)
    .end(done);
 });

 it('should return a 404 for non-object ids', (done) => {
   request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
 });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexID = dummyTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID)
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(hexID).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
     .delete(`/todos/${(new ObjectID()).toHexString()}`)
     .expect(404)
     .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
     .delete('/todos/123')
     .expect(404)
     .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the Todo', (done) => {
    var hexId = dummyTodos[0]._id.toHexString();
    var text = 'This is a new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = dummyTodos[1]._id.toHexString();
    var text = 'This is also a new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
})
