module.exports=(app)=>{
   const get = require('../controllers/crud.controller');
   app.put('/update',get.addItem)//Sig-up with new account
}
