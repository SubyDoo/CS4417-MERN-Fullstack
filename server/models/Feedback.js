
const mongoose = require("mongoose")

// how the Users "table" should be formatted
const FeedbackScheme = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
        },
        feedback:{
            type: String,
            required: true,
        },
    },
    {collection: "feedback"}
);

// create a model out the schema
const FeedbackModel = mongoose.model("feedback", FeedbackScheme)

// export to outside of this file so you have access to the model to make changes throughout the application
module.exports = FeedbackModel;