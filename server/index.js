// entry point of api
// api and database setup

const express = require("express")
const app = express()
const mongoose = require("mongoose") 
const UserModel = require("./models/Users")
const FeedbackModel = require("./models/Feedback")


// allow you to connect this api to the react front end
const cors = require("cors")

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt")

// issue not loading list of users, had to add this https://stackoverflow.com/questions/45975135/access-control-origin-header-error-using-axios 
// this allows the front end to access the api as the middleware
app.use(cors())

// allows to parse json in the body of a request
// This allows us to use req.body
app.use(express.json());

// default sanitize filter for security against nosSQL injections
// The sanitize function will strip out any keys that start with '$' in the input
mongoose.set('sanitizeFilter', true);

// connect to database
mongoose.connect("mongodb+srv://shaq:CS4417DatabasePassword@cluster0.lt6pjjn.mongodb.net/CS4417MERNAPP?retryWrites=true&w=majority&appName=Cluster0");


  app.post('/register', async (req,res) =>{

    if (!req.body.username || !req.body.password) {
      return res.json({status: 'error', error: 'Please enter username and password'})
    }

    else if (req.body.password.length < 8 || req.body.password.length > 16) {
      return res.json({status: 'error', error: 'Password must be between 8 and 16 characters'})
    }

    else{
      

      try{

        const hash = await bcrypt.hash(req.body.password, 10);
        await UserModel.create({
        username: req.body.username,
        password: hash
        })
        res.json({status: 'ok'})
      }
      catch(error){
        if (error.code === 11000) {
          res.json({status: 'error', error: 'Username already exists'})
        }
        else {
          res.json({status: 'error', error: 'Generic error'})
        }
      }
    }

  });

  app.post('/login', async (req,res) =>{

      const user = await UserModel.findOne({
        username: req.body.username, 
      })

      if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if(err) {
            return res.json({status: 'error', error: 'Invalid username or password'})
          }
          if(result) {
            const token = jwt.sign(
              { 
                username: user.username 
              }, 
              'CS4417MERNJWTPASSWORD');
            res.json({status: 'ok', user: token})
          } else {
            res.json({status: 'error', error: 'Invalid username or password'})
          }
        })
      }
      else {
        res.json({status: 'error', error: 'Invalid username or password', user: false})
      }

  });


  app.post('/sendfeedback', async (req,res) =>{

    const token = req.headers["x-access-token"];
    console.log("test");

    try{

        const decoded = jwt.verify(token, 'CS4417MERNJWTPASSWORD');
        const username = decoded.username
        const user = await UserModel.findOne({username: username})

        if (!user) {
          return res.json({status: 'error', error: 'Invalid token'})
        }

        if (!req.body.feedbacktext) {
          return res.json({status: 'error', error: 'Cannot send empty feedback'})
        }

        if (req.body.feedbacktext.length >= 5000) {
          return res.json({status: 'error', error: 'Feedback must be less than 5000 characters'})
        }

        await FeedbackModel.create({
        username: username,
        feedback: req.body.feedbacktext
      })
      res.json({status: 'ok'})
    }
    catch(error){
      //console.log(error)
      res.json({status: 'error', error: 'Error sending feedback'})
    }

  });


  
  app.post('/updatepassword', async (req,res) =>{

    const token = req.headers["x-access-token"];
    const oldpassword = req.body.oldpassword;
    const newpassword = req.body.newpassword;

   // console.log(newpassword);

    try{

        const decoded = jwt.verify(token, 'CS4417MERNJWTPASSWORD');
        const username = decoded.username;

        const user = await UserModel.findOne({
          username: username, 
          password: oldpassword,
      })

        if (!user) {
          return res.json({status: 'error', error: 'Incorrect Password'});
        }

        
        await UserModel.findOneAndUpdate({username: username}, {password: newpassword})
      
        res.json({status: 'ok'})
    }
    catch(error){
      //console.log(error)
      res.json({status: 'error', error: 'Error changing password'})
    }

  });





// tell api to start, 3001 port number, react will start at port 3000
app.listen(3001, () =>{
    console.log("Server started on port 3001") 
})