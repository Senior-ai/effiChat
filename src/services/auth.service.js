import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";

//env vars
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;
  // Validate user input
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields");
  }
  //check name length
  if (!validator.isLength(name, { min: 2, max: 16 })) {
    throw createHttpError.BadRequest("Name must be between 2 to 16 characters");
  }
  //check state length
  if (status && status.length > 48) {
    throw createHttpError.BadRequest("Status must be less than 48 characters");
  }
  //Check if email is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Please provide a valid email address");
  }
  // Check if user already exists
  const existingUser = await UserModel.findOne(email);
  if (existingUser) {
    throw createHttpError.Conflict("An account with this email already exists");
  }
  //check pass length
  if (!validator.isLength(password, { min: 6, max: 48 })) {
    throw createHttpError.BadRequest(
      "Password must be between 6 to 48 characters"
    );
  }
  // Encrypt password -> to be done in the user model
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  //adding user to mongo
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password: hashedPassword,
  }).save();
  return user;
};
