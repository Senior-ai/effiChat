import { createUser } from "../services/auth.service";
export const register = async (req, res, next) => {
    try {
        const { name, email, picture, status, password } = req.body;

      // Create user in our database
      const user = await createUser({
        name,
        email,
        picture,
        status,
        password
      });
      
      // Generate JWT
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Send response
      res.status(200)
      res.json(user)
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {

  } catch (err) {
    next(err);
  }
}

export const logout = async (req,res, next) => {
    try {

    } catch (err) { 
        next(err);
    }
}

export const refreshToken = async (req,res, next) => {
    try {

    } catch (err) { 
        next(err);
    }
}