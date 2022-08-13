const mongoose = require('mongoose');

const Schema={
   id        : String,
   userName  : String,
   userPass  : String,
   toDoList  : [String],
   created   : { type: Date, default: Date.now }
}

module.exports = MongooseModel = mongoose.model("todolist", Schema)

