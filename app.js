const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
   extended: false
}))
app.use(bodyParser.json())

//SCHEMA
const schema = require('./models/car.model')
schema.MongooseModel

//Routes
//All the endpoints the user connects to.
require('./routes/findUser')(app);
// require('./routes/getList')(app);
// require('./routes/deleteItem')(app);
// require('./routes/addItem')(app);



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


//Listening on port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
   console.log(`Server is listening on port ${PORT}`);
});