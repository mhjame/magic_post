const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const urlConnect = 'mongodb://127.0.0.1:27017/MAGIC_POST_DEV';

async function connect() {
    try {
        await mongoose.connect(urlConnect, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected successfully');
    } catch (err) {
        console.log(`Connected failed (Error: ${err.message})`);
    }
}

module.exports = { connect };
