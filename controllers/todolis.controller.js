const schema = require('../model/todolist.model');

exports.getUser=(req,res)=>{
   schema.findOne((err, list_db)=>{
      if(err){
         console.log(err);
         res.status(500).send({message:"Internal Server Error"});
      }else{
         if(list_db.length==0){
            res.send("No data found");
         }else{
            res.send(list_db);
            console.log("Found user data");
         };
      }
   })
};