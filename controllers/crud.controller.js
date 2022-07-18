//This file will perform all the CRUD operations
const model = require('../model/schema.model'); //require the schema
const jwt = require('jsonwebtoken')
require('dotenv').config()
//On LOG-IN
//1. On log-in request, VERIFY the token.
//2. if token success, send database data& to frontend
let userName;

exports.logIn = (req, res) => {
   userName = req.body.userName
   model.find(({
      userName: req.body.userName, //Find data by userName
      userPass: req.body.userPass,
   }), (err, data) => {
      if (err) { //If theres a server error/connection problem
         res.status(500).send({
            message: "Some error occurred while retrieving data."
         });
      } else {
         if (req.body.userName && req.body.userPass) { //if userName & psd is found in db=>send DATA to front-end
            console.log("Logged In")
            res.send(data);
         } else {
            console.log("User Not Found")
            res.send("User Not Found");
         }
      }
   });
};

//POST= create the document on SIGN-UP
//1. When A user signs in for the first time, a doc will be created,
//2. The doc wil also have an empty toDoList
//3. This doc will also store the user Name/password & token
exports.createUser = async (req, res) => {
   
   //First check is userName exists
   let validate = req.body.userName
   
  const user = await model.findOne({ userName: validate})
   if (user) {
      let exists = "Username taken"
      console.log("User exists")
      res.json(exists)
   }else {
      //set user privileges and payload
      payload = {
         'name': req.body.userName,
         'admin': true
      }
      const token = jwt.sign(JSON.stringify(payload), process.env.SECRET_KEY, {
         algorithm: 'HS256'
      })
      const data = new model({
         userName: req.body.userName,
         userPass: req.body.userPass,
         userToken: token
      });
      const value =  data.save(); //save() function creates  the module
       res.send(data); //send the same data back 
      console.log("New user Added");
   
   }


   
   
}


//ADD TO LIST
//1. Verify if still the same user with user token ?
//2.PUSH = find the user doc and add more items to the toDoList array
exports.addItem = (req, res) => {
   const usr = req.headers['authorization'] //Get token from localStorage/frontend
   const token = usr.split(' ')[1]
   const decoded = jwt.verify(token,  process.env.SECRET_KEY); //verify token secret-key
   if (token) { //if token OK, find Mongodb DATA
      //1.Find the doc by userName
      //2. Push the new item to the toDoList. if toDoList, does not exist, one will be created.
      model.findOneAndUpdate({
            userName: userName
         }, //find user by userName 
         {
            $addToSet: {
               toDoList: req.body.toDoList
            }
         }, {
            new: true
         }, //return new updated data. if false: return old data but still updates.
         (err, data) => {
            
                  res.send({
                     'msg': `Hello, ${decoded.name}! Verification successfully.`,
                     'Admin': decoded.admin,
                     'data': [data]
                  });
                  console.log("item Added")
             })
   } else {
      res.status(401).send({ //if token secret key does not match my server key
         'err': 'Bad JWT!'
      });

   };
};


//DELETE item from ToDoList
//Verify JWT token before deleting items
exports.deleteItem = (req, res) => {
   console.log(req.body.toDoList)
   const usr = req.headers['authorization'] //Get token from localStorage/frontend
   const token = usr.split(' ')[1]
   const decoded = jwt.verify(token,  process.env.SECRET_KEY); //verify token secret-key
   if (token) { //if token OK, find Mongodb DATA
      //1.Find the doc by userName
      //2.Pull the query item from the toDoList.
      model.findOneAndUpdate({
            userName: userName
         }, {
            
            $pull: {
               toDoList: req.body.toDoList,
            }
         },

         {
            new: true
         }, //return new updated data. if false: return old data but still updates.
         (err, data) => {
            
            res.send({
               'msg': `Hello, ${decoded.name}! Verification successfully.`,
               'Admin': decoded.admin,
               'data': [data]
            })
            console.log("item deleted")
         })
            
         
   } else {
      res.status(401).send({ //if token secret key does not match my server key
         'err': 'Bad JWT!'
      });
   };
};


//Find all userName's, and password in the DB
//Only retrieve the first 2 users
exports.findUsers = (req, res) => {
model.find({}, {_id: 0, toDoList: 0, userToken: 0, __v: 0},(err, data)=>{
   res.json(data)
 }).limit(2)
}


