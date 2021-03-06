const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
// const {Todo} = require('./../models/todo');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {dummyTodos, populateTodos, dummyUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new Todo', (done) => {
    var text = 'This is a Test Todo';

    request(app)
      .post('/todos')
      .set('x-auth', dummyUsers[0].tokens[0].token)
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
      .set('x-auth', dummyUsers[0].tokens[0].token)
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
      .set('x-auth', dummyUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
 it('should return todo doc', (done) => {
   request(app)
    .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
    .set('x-auth', dummyUsers[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(dummyTodos[0].text);
    })
    .end(done);
 });

 it('should return a 404 if todo not found', (done) => {
   request(app)
    .get(`/todos/${(new ObjectID()).toHexString()}`)
    .set('x-auth', dummyUsers[0].tokens[0].token)
    .expect(404)
    .end(done);
 });

 it('should return a 404 for non-object ids', (done) => {
   request(app)
    .get('/todos/123')
    .set('x-auth', dummyUsers[0].tokens[0].token)
    .expect(404)
    .end(done);
 });

 it('should not return todo doc created by other user', (done) => {
   request(app)
    .get(`/todos/${dummyTodos[1]._id.toHexString()}`)
    .set('x-auth', dummyUsers[0].tokens[0].token)
    .expect(404)
    .end(done);
 });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexID = dummyTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', dummyUsers[1].tokens[0].token)
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
     .set('x-auth', dummyUsers[1].tokens[0].token)
     .expect(404)
     .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
     .delete('/todos/123')
     .set('x-auth', dummyUsers[1].tokens[0].token)
     .expect(404)
     .end(done);
  });

  it('should not remove a todo created by other user', (done) => {
    var hexID = dummyTodos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', dummyUsers[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(hexID).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the Todo', (done) => {
    var hexId = dummyTodos[0]._id.toHexString();
    var text = 'This is a new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', dummyUsers[0].tokens[0].token)
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

  it('should not update the Todo created by other user', (done) => {
    var hexId = dummyTodos[0]._id.toHexString();
    var text = 'This is a new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', dummyUsers[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = dummyTodos[1]._id.toHexString();
    var text = 'This is also a new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', dummyUsers[1].tokens[0].token)
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

  it('should return 404 if object id is not valid', (done) => {
    request(app)
      .patch('/todos/123')
      .set('x-auth', dummyUsers[1].tokens[0].token)
      .expect(404)
      .end(done)
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', dummyUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
        expect(res.body.email).toBe(dummyUsers[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'userX@example.com';
    var password = 'userX123';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'abc';
    var password = '123';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: dummyUsers[0].email,
        password: 'abc123123'})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: dummyUsers[1].email,
        password: dummyUsers[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(dummyUsers[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((err) => done(err));
      });
  });

  it('should rejct invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: dummyUsers[1].email,
        password: dummyUsers[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(dummyUsers[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', dummyUsers[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(dummyUsers[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
