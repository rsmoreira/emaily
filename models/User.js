const mongoose = require('mongoose');
const { Schema } = mongoose;

// It is our Mongoose Schema for the collection User.
// It will the responsible to map all possible attributes of an User record could have.
const userSchema = new Schema({
    googleId : String
});

// This command below will tell mongoose to create a new collection named 'users', 
// using the userSchema as the model
mongoose.model('users', userSchema); 