module.exports=(app)=>{
   const get = require('../controllers/crud.controller');
   app.delete('/remove', get.deleteItem)//delete item endpoint
   
}



