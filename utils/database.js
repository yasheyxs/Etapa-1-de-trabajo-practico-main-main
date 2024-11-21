const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/db';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log(err));
