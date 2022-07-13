module.exports=(app)=>{
const get = require('../controllers/crud.controller');
app.post('/logIn', get.logIn)//log-in user

}