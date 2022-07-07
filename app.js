const express = require("express");
require('isomorphic-fetch');
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
   extended: false
}))
app.use(bodyParser.json())
const jwt = require('jsonwebtoken')







//Connect to DB
mongoose.connect("mongodb+srv://JMorta:testapp@mydatabase.6n2ggxn.mongodb.net/?retryWrites=true&w=majority", {
   useNewUrlParser: true,
   useUnifiedTopology: true
}, (err) => {
   if (!err) {
      console.log("Connected to DB")
   } else {
      console.log("Not Connected to DB")
   }
});




const Schema={
   id: String,
   userName: String,
   userPass: String,
   toDoList: [String],
   created:Date,
}
const model=mongoose.model("ToDoLists", Schema)

//On LOG-IN get the user todoList
//1. FIND the List by userName

app.post('/findUser', (req,res)=>{

   
payload = {
   'name': req.body.userName,
   'admin': false
   }
   const token = jwt.sign(JSON.stringify(payload), 'my-secret',
   {algorithm: 'HS256'})
   res.send({'token': token})



   model.find(({
      userName:req.body.userName ,
      userPass:req.body.userPass
   }), (err, data) => {

      if (err) {
         console.log(err);
         res.status(500).send({
            message: "Some error occurred while retrieving data."
         });
      } else {
         if (data.length == 0) {
            res.send("User Not Found");
         } else {
            res.send(data);
            console.log(data)

         }
      }
   });
   })



//POST= create the document on SING-UP
//1. When A user signs in for the first time, a doc will be created,
//the doc wil also have an empty toDoList
app.post('/createUser', async(req,res)=>{
   const data=new model({
      userName:req.body.userName,
      userPass:req.body.userPass

   });
   const value = await data.save();
   res.json(value); //send the same data back 
   console.log("New user Added");
})



//ADD TO LIST
//PUSH = find the user doc and add more items to the toDoList array
app.put('/update', async(req,res)=>{

//1.Find the doc by userName
//2. Push the new item to the toDoList. if toDoList, does not exist, one will be created.

   model.findOneAndUpdate(
   {userName: req.body.userName},//find user by userName 
   {$addToSet:{toDoList: req.body.toDoList}},

   {
      new: true
   }, //return new updated data. if false: return old data but still updates.

   (err, data) => {
      if (err) {
         console.log(err)
      } else {
         if (data == null) {
            res.send("not Data Found");
         } else {
            res.send(data)
            console.log("item Added")
         }
      }
   })
})


//DELETE item from ToDoList
app.delete('/remove', (req,res)=>{

   //1.Find the doc by userName
   //2. Pull the query item from the toDoList.
   
      model.findOneAndUpdate({
         userName: req.body.userName
      }, 
      {
         $pull: {
            toDoList: req.body.toDoList,
         }
      },
   
      {
         new: true
      }, //return new updated data. if false: return old data but still updates.
   
      (err, data) => {
         if (err) {
            console.log(err)
         } else {
            if (data == null) {
               res.send("not Data Found");
            } else {
               res.send(data)
            }
         }
      })
   })















// //SCHEMA
// const schema = require('./model/todolist.model')
// schema.MongooseModel


// //Routes
// //All the endpoints the user connects to.
// require('./routes/findUser')(app);
// // require('./routes/getList')(app);
// // require('./routes/deleteItem')(app);
// // require('./routes/addItem')(app);



//Listening on port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
   console.log(`Server is listening on port ${PORT}`);
});