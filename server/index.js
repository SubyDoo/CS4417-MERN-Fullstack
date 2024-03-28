// entry point of api
// api and database setup

const express = require("express")
const app = express()
const mongoose = require("mongoose") 
const UserModel = require("./models/Users")

// allow you to connect this api to the react front end
const cors = require("cors")

// issue not loading list of users, had to add this https://stackoverflow.com/questions/45975135/access-control-origin-header-error-using-axios 
// this allows the front end to access the api as the middleware
app.use(cors())

// allows to parse json in the body of a request
// This allows us to use req.body
app.use(express.json());



// connect to database
mongoose.connect("mongodb+srv://shaq:CS4417DatabasePassword@cluster0.lt6pjjn.mongodb.net/CS4417MERNAPP?retryWrites=true&w=majority&appName=Cluster0");

///////////// No Longer Works find method no longer accepts callback
// req - get info from front end
// res - send info from back end to front end
  app.get('/getUsers',(req,res) => {
    //res.header("Access-Control-Allow-Origin", "*");
    UserModel.find({}).then(
      result => res.json(result)
    ).catch(
      err => {throw err}
    );
  });  

  app.get('/hello', (req, res) =>{
    res.send('Hello World')
  })


  app.post('/register', async (req,res) =>{
    try{
        await UserModel.create({
        username: req.body.username,
        password: req.body.password
      })
      res.json({status: 'ok'})
    }
    catch(error){
      console.log(error)
      res.json({status: 'error', error: 'Duplicate username'})
    }

    // // data from from end
    // const user = req.body
    // const newUser = new UserModel(user)
    // await newUser.save()
    //
  });

  app.post('/login', async (req,res) =>{

        const user = await UserModel.findOne({
          username: req.body.username, 
          password: req.body.password,
      })

      if (user) {
        res.json({status: 'ok'})
      } else {
        res.json({status: 'error', error: 'Invalid username or password'})
      }


  });


// tell api to start, 3001 port number, react will start at port 3000
app.listen(3001, () =>{
    console.log("Server started on port 3001") 
})