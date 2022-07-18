module.exports=(app)=>{
  const get = require('../controllers/crud.controller');
  app.get('/findUsers', get.findUsers)//delete item endpoint
  
}



