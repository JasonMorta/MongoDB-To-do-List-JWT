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
   userToken: String,
   created:Date,
}
const model=mongoose.model("ToDoLists", Schema)


//Testing JWT*
//Generate a JWT Token
// app.post('/login', (req, res) => {
//    const usr = req.body.username
//    const pwd = req.body.password
//    if (usr === 'zama' && pwd === 'secret') {
//       payload = {
//          'name': usr,
//          'admin': false
//       }
//       const token = jwt.sign(JSON.stringify(payload), 'jwt-secret', {
//          algorithm: 'HS256'
//       })
//       res.send({
//          'token': token
//       })
//    } else {
//       res.status(403).send({
//          'err': 'Incorrect login!'
//       })
//    }
//    })


   //Testing JWT*
   //Verify user token
   // app.get('/resource', (req, res) => {

   //    const auth = req.headers['authorization']//Bearer, takes care of extracting said token.
   //    const token = auth.split(' ')[1]
   //    try {
   //    const decoded = jwt.verify(token, 'jwt-secret')
   //    res.send({'msg':
   //    `Hello, ${decoded.name}! Your JSON Web Token has been verified.`})
   //    //Verify token witt the specified secret key.
   //    //If verification is successful, the token can be trusted and its payload is decoded.
   //    //We then use this to construct a personalized message for the user.
   //    //If the verification fails, an HTTP 401 status is returned. This is the REST standard for bad authorization.
   //    }catch (err) {
   //    res.status(401).send({'err': 'Bad JWT!'})

   //    }})

   //Testing JWT* Verify a user access
      // app.get('/admin_resource', (req, res) => {
      //    const token = req.headers['authorization'].split(' ')[1]
      //    try {
      //       const decoded = jwt.verify(token, 'jwt-secret')
      //       if (decoded.admin) {
      //          res.send({
      //             'msg': 'Success!'
      //          })
      //       } else {
      //          res.status(403).send({
      //             'msg': 'Your JWT was verified, but you are not an admin.'
      //          })
      //       }
      //    } catch (e) {
      //       res.sendStatus(401)
      //    }
      // })



//POST= create the document on SIGN-UP
//1. When A user signs in for the first time, a doc will be created,
//2. The doc wil also have an empty toDoList
//3. This doc will also store the user Name/password & token
app.post('/createUser', async(req,res)=>{
   
   //set user privileges and payload
   payload = {
      'name': req.body.userName,
      'admin': true
   }
   const token = jwt.sign(JSON.stringify(payload), 'jwt-secret', {
      algorithm: 'HS256'
   })
   const data=new model({
      userName:req.body.userName,
      userToken: token
   });
   const value = await data.save();
   res.json(value); //send the same data back 
   console.log("New user Added");
})




//verifyJWT: verify if user has the correct Token when connection to endpoints
//Also check user Admin status
const veriJWT = (req, res, next) => {
   const usr = req.headers['authorization']//Bearer, takes care of extracting said token.
   const token = usr.split(' ')[1]
   
   if(token){
   const decoded = jwt.verify(token, 'jwt-secret')
   console.log(
      {
         'msg':`Hello, ${decoded.name}! Your JSON Web Token has been verified.`,
         'Admin': `${decoded.admin}`
      })
   } else {
   res.status(401).send({'err': 'Bad JWT!'})
 
   }
   
}



//On LOG-IN
//1. On log-in request, VERIFY the token.
//2. if token success, send database data& to frontend
app.post('/findUser', (req, res) => {

   const usr = req.headers['authorization'] //Get token from localStorage/frontend
   const token = usr.split(' ')[1]
   const decoded = jwt.verify(token, 'jwt-secret'); //verify token secret-key
   if (token) {//if token OK, find Mongodb DATA
      model.find(({
         userName: req.body.userName,//Find data by userName
      }), (err, data) => {
         if (err) {//If theres a server error/connection problem
            res.status(500).send({
               message: "Some error occurred while retrieving data."
            });

         } else {
            if (req.body.userName) {//if user is found in db=>send DATA to front-end
               console.log("Logged-in")
               res.send({
                  'msg': `Hello, ${decoded.name}! Verification successfully.`,
                  'Admin': decoded.admin,
                  'data': data
               });

            } else {
               console.log("User Not Found")
               res.send("User Not Found");

            }
         }
      });
   } else {
      res.status(401).send({//if token secret key does not match my server key
         'err': 'Bad JWT!'
      })

   }


})









//ADD TO LIST
//1. Verify if still the same user with user token ?
//2.PUSH = find the user doc and add more items to the toDoList array
app.put('/update', async (req, res) => {

   const usr = req.headers['authorization'] //Get token from localStorage/frontend
   const token = usr.split(' ')[1]
   const decoded = jwt.verify(token, 'jwt-secret'); //verify token secret-key
   if (token) { //if token OK, find Mongodb DATA


      //1.Find the doc by userName
      //2. Push the new item to the toDoList. if toDoList, does not exist, one will be created.
      model.findOneAndUpdate(
         {userName: req.body.userName},//find user by userName 
         {
            $addToSet: {
               toDoList: req.body.toDoList
            }
         },
         {
            new: true
         }, //return new updated data. if false: return old data but still updates.

         (err, data) => {
            if (err) {//If theres a server error/connection problem
               res.status(500).send({
                  message: "Some error occurred while retrieving data."
               });
            } else {
               if (!req.body.userName) {
                  res.send("not Data Found");
               } else {
                  res.send({
                     'msg': `Hello, ${decoded.name}! Verification successfully.`,
                     'Admin': decoded.admin,
                     'data': [data]
                  });
                  console.log("item Added")
               }
            }
         })
   } else {
      res.status(401).send({ //if token secret key does not match my server key
         'err': 'Bad JWT!'
      })

   }
})


//DELETE item from ToDoList
app.delete('/remove', (req,res)=>{

   const usr = req.headers['authorization'] //Get token from localStorage/frontend
   const token = usr.split(' ')[1]
   const decoded = jwt.verify(token, 'jwt-secret'); //verify token secret-key

   if (token) { //if token OK, find Mongodb DATA

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
            if (err) {//If theres a server error/connection problem
               res.status(500).send({
                  message: "Some error occurred while retrieving data."
               });
            } else {
               if (!req.body.userName) {
                  res.send("not Data Found");
               } else {
                  res.send({
                     'msg': `Hello, ${decoded.name}! Verification successfully.`,
                     'Admin': decoded.admin,
                     'data': [data]
                  });
                  console.log("item Added")
               }
            }
         })
         } else {
      res.status(401).send({ //if token secret key does not match my server key
         'err': 'Bad JWT!'
      })

   } 
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