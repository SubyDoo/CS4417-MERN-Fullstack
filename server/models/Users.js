// how the Users "table" should be formatted

const mongoose = require("mongoose")

const UserScheme = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
});


// create a model out the schema

const UserModel = mongoose.model("users", UserScheme)

//export to outside of this file so you have access to the model to make changes throughout the application
module.exports = UserModel;
