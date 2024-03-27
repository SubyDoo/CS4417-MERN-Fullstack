// entry point of api
// api and database setup

const express = require("express")
const app = express()
const mongoose = require("mongoose") 
const UserModel = require("./models/Users")

// allow you to connect this api to the react front end
const cors = require("cors")

// issue not loading list of users, had to add this https://stackoverflow.com/questions/45975135/access-control-origin-header-error-using-axios 
app.use(cors())

// allows to parse json in the body of a request
app.use(express.json());



// connect to database
mongoose.connect("mongodb+srv://shaq:CS4417DatabasePassword@cluster0.lt6pjjn.mongodb.net/CS4417MERNAPP?retryWrites=true&w=majority&appName=Cluster0");

///////////// No Longer Works find method no longer accepts callback
// req - get info from front end
// res - send info from back end to front end
// app.get("/getUsers", (req, res) => {
//     UserModel.find({}, (err, result) => {
//         if (err){
//             res.json(err)
//         } 

//         else{
//             // transform data into json format
//             res.json(result)
//         }
//     })
// })

///////////// solution 1
// app.get("/getUsers", async (req, res) => {
//     try {
//       const result = await UserModel.find({});
//       res.json(result);
//     } catch (err) {
//         // generic error response so not give away details
//       res.status(500).json({ message: "error with getting data" });
//     }
//   });
  
///////////// solution 2
  app.get('/getUsers',(req,res) => {
    //res.header("Access-Control-Allow-Origin", "*");
    UserModel.find({}).then(
      result => res.json(result)
    ).catch(
      err => {throw err}
    );
  });




  app.post('/createUser', async (req,res) =>{
    // data from from end
    const user = req.body
    const newUser = new UserModel(user)
    await newUser.save()

    res.json(user)
    //
  });


// tell api to start, 3001 port number, react will start at port 3000
app.listen(3001, () =>{
    console.log("SERVER RUNS") 
})