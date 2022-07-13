module.exports=(app)=>{
   const get = require('../controllers/crud.controller');
   app.post('/createUser',get.createUser)//Sig-up with new account
   
   }




