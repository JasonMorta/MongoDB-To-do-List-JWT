module.exports=(app)=>{
   const todolist = require('../controllers/todolist.controller');
   app.get('/findUserList', todolist.findUser)

}