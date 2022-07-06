const mongoose = require('mongoose');

const Schema={
   id: String,
   userName: String,
   toDoList: String,
   created:Date,
}

module.exports=mongooseModal=mongoose.model("JWT.ToDoLists", Schema)