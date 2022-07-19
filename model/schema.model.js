const mongoose = require('mongoose');

const Schema={
   id        : String,
   userName  : String,
   userPass  : String,
   toDoList  : [String],
   userToken : [String],
   created   : Date,
}

module.exports = MongooseModel = mongoose.model("ToDoLists", Schema)

