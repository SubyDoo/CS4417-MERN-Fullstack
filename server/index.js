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
const https = require("https")
const path = require("path")
const fs = require("fs")

// read .env file
require('dotenv').config();

// this allows the front end to access the api as the middleware
// origin is the url of the front end
app.use(cors({origin: 'https://localhost:3000'}, {methods: ['POST']}));

// allows to parse json in the body of a request
// This allows us to use req.body
app.use(express.json());

// default sanitize filter for security against nosSQL injections
// The sanitize function will strip out any keys that start with '$' in the input
mongoose.set('sanitizeFilter', true);

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;

// connect to database
mongoose.connect("mongodb+srv://" + dbUsername + ":" + dbPassword + "@cluster0.lt6pjjn.mongodb.net/CS4417MERNAPP?retryWrites=true&w=majority&appName=Cluster0");

// api to register a new user
app.post('/register', async (req,res) =>{

  // check if all fields are filled
  if (!req.body.username || !req.body.password) {
    return res.json({status: 'error', error: 'Please enter username and password'})
  }

  // check if password is between 8-16 characters
  else if (req.body.password.length < 8 || req.body.password.length > 16) {
    return res.json({status: 'error', error: 'Password must be between 8 and 16 characters'})
  }

  // attempt to register user
  else{
    try{
      const userName = req.body.username;
      const hash = await bcrypt.hash(req.body.password, 10);
      await UserModel.create({
      username: userName,
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

// api to login
app.post('/login', async (req,res) =>{

  
  try { 

    const userName = req.body.username;
    const user = await UserModel.findOne({username: userName})

    // check if user exists
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
            {
              expiresIn: '1h'
            },
            jwtTokenSecret);
          res.json({status: 'ok', user: token})
        } else {
          res.json({status: 'error', error: 'Invalid username or password'})
        }
      })
    }
    else {
      res.json({status: 'error', error: 'Invalid username or password', user: false})
    }
  } 
  catch(error) {
    res.json({status: 'error', error: 'Error logging in', user: false})
  }
});

// api to send feedback
app.post('/sendfeedback', async (req,res) =>{

  // header for token
  const token = req.headers["x-access-token"];

  try{
    const decoded = jwt.verify(token, jwtTokenSecret);
    const username = decoded.username
    // find user
    const user = await UserModel.findOne({username: username})

    // check if user exists
    if (!user) {
      return res.json({status: 'error', error: 'Invalid token'})
    }

    // check if feedback is empty
    if (!req.body.feedbacktext) {
      return res.json({status: 'error', error: 'Cannot send empty feedback'})
    }

    // check if feedback is too long
    if (req.body.feedbacktext.length >= 5000) {
      return res.json({status: 'error', error: 'Feedback must be less than 5000 characters'})
    }

    // attempt to create feedback in database
    await FeedbackModel.create({
      username: username,
      feedback: req.body.feedbacktext
    })
    res.json({status: 'ok'})
  }
  catch(error){
    res.json({status: 'error', error: 'Error sending feedback'})
  }
});


// api to update password
app.post('/updatepassword', async (req,res) =>{

  // header for token
  const token = req.headers["x-access-token"];

  const oldpassword = req.body.oldpassword;
  const newpassword = req.body.newpassword;
  const confirmpassword = req.body.confirmpassword;

  // check if all fields are filled
  if (!oldpassword || !newpassword || !confirmpassword) {
    return res.json({status: 'error', error: 'Please enter all fields'})
  }

  // check if password is between 8-16 characters
  else if (newpassword.length < 8 || newpassword.length > 16) {
    return res.json({status: 'error', error: 'Password must be between 8-16 characters'})
  }

  // check if new password and confirm password match
  else if (newpassword !== confirmpassword) {
    return res.json({status: 'error', error: 'New password and confirm passwords do not match'})
  }

  // check if all field are filled
  else if (oldpassword && newpassword && confirmpassword) {
    try{
      const decoded = jwt.verify(token, jwtTokenSecret);
      const username = decoded.username;
  
      // find user
      const user = await UserModel.findOne({
        username: username
      })
  
      // check if user exists
      if (user){
        bcrypt.compare(oldpassword, user.password, async function(err, result) {
          if(err) {
            return res.json({status: 'error', error: 'Incorrect Password'})
          }
          if(result) {
            // hash password
            const hash = await bcrypt.hash(newpassword, 10);
            // update password
            await UserModel.findOneAndUpdate({username: username}, {password: hash})
            return res.json({status: 'ok'})
            
          } else {
            return res.json({status: 'error', error: 'Incorrect Password'})
          }
        })
      }
      else {
        return res.json({status: 'error', error: 'Incorrect Password'});
      }
    }
    catch(error){
      return res.json({status: 'error', error: 'Error changing password'})
    }
  }
});

// HTTP
// // tell api to start, 3001 port number, react will start at port 3000
// app.listen(3001, () =>{
//     console.log("Server started on port 3001") 
// })

// HTTPS
const sslServer = https.createServer(
  {
  key: fs.readFileSync(path.join(__dirname, 'cert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert/cert.pem')),
  }, 
  app)

sslServer.listen(3001, () =>{
  console.log("HTTPS Server started on port 3001") 
})