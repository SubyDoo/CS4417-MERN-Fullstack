// how the Users "table" should be formatted

const mongoose = require("mongoose")

const UserScheme = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
    },
    {collection: "users"}
);


// create a model out the schema

const UserModel = mongoose.model("users", UserScheme)

//export to outside of this file so you have access to the model to make changes throughout the application
module.exports = UserModel;
