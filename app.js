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
   toDoList: [String],
   created:Date,
}
const model=mongoose.model("ToDoLists", Schema)

//On LOG-IN get the user todoList
//1. FIND the List by userName

app.get('/findUser', (req,res)=>{

   model.find(({
      userName:req.query.userName
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
   });
   const value = await data.save();
   res.json(value); //send the same data back 
   console.log("New user Added");
})



//ADD TO LIST
//PUSH = find the user doc and add more items to the toDoList array
app.put('/update', (req,res)=>{

//1.Find the doc by userName
//2. Push the new item to the toDoList. if toDoList, does not exist, one will be created.

   model.findOneAndUpdate({
      userName: req.query.userName
   }, //update/?id=idNumber
   {
      $push: {
         toDoList: req.query.toDoList,
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


//DELETE item from ToDoList
app.delete('/remove', (req,res)=>{

   //1.Find the doc by userName
   //2. Pull the query item from the toDoList.
   
      model.findOneAndUpdate({
         userName: req.query.userName
      }, 
      {
         $pull: {
            toDoList: req.query.toDoList,
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