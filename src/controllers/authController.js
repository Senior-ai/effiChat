import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import {findUser} from '../services/user.service.js'
import createHttpError from 'http-errors';
export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;

    // Create user in our database
    const user = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });

    // Generate JWT
    const access_token = await generateToken(
      { userId: user._id },
      "7d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refresh_token = await generateToken(
      { userId: user._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    // Send response
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "apiv1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }); //30days
    res.status(200);
    res.json({
      message: "register success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        access_token: access_token
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await signUser(email, password);
    // Generate JWT
    const access_token = await generateToken(
      { userId: user._id },
      "7d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refresh_token = await generateToken(
      { userId: user._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    // Send response
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "apiv1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }); //30days
    res.status(200);
    res.json({
      message: "login success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        access_token: access_token
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {path: "apiv1/auth/refreshtoken"});
    res.status(200).json({
      message: "Logout success"
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) throw createHttpError.Unauthorized("Please login");
    const check = await verifyToken(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = await findUser(check.userId);

    const access_token = await generateToken(
      { userId: user._id },
      "7d",
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        access_token: access_token
      },
    });
  } catch (err) {
    next(err);
  }
};
