const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$jOtgjKOVWlQRDphs9uu.wuAXvxu2tCRyLJADPlqCZh7rLzq8aUNha';
bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log('Same Password? ', result);
});
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('Decoded:', decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`ORIGINAL : ${message}`);
// console.log(`HASHED : ${hash}`);
//
// var data = {
//   id: 4
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed! Do not trust!');
// }
