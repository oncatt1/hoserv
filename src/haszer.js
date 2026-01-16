import bcrypt from 'bcrypt';

const pass = 'cezary'
bcrypt.hash(pass , 10).then(console.log);