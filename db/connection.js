const mongoose = require('mongoose');

const connectToDB = (url) => mongoose.connect(url)
    .then(() => console.log("connected to mongo db......."))
    .catch((err) => console.log(err))

module.exports = connectToDB

