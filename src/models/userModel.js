import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide your name"] },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: [true, "This email is already registered"],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  picture: {
    type: String,
    default: 'https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png',
  },
  status: {
    type: String,
    default: 'Hey! Looks like I am using EffiChat'
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength:[6, 'Please make sure your password is at least 6 characters long'],
    maxLength:[48, 'Please make sure your password is less than 48 characters long'],
  },

}, {
    collection: 'users',
    timestamps: true
});

const UserModel = mongoose.models.UserModel || mongoose.model( 'UserModel', userSchema );

export default UserModel;