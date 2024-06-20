import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";
import jwt from "jsonwebtoken";
import { Music } from "../models/musicsModel.js";

// ==========================
// JWT Token Generator
// ==========================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// ==========================
// Siginup Controller
// ==========================
const _Signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    if (!(username && email && password)) {
      throw new CustomError("Please fill the all fields", 422);
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new CustomError("Email already exists", 400);
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new CustomError("Username already exists", 400);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const UserData = await User({
      username,
      email,
      password: encryptedPassword,
    });

    await UserData.save();

    const token = generateToken(UserData);
    const user = { username, email, token };
    res.cookie("token", token, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({success:true, message: "Account Created successfully", user });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Login Controller
// ==========================
const _Login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!(username && password)) {
        throw new CustomError("Please fill all fields", 422);
      }
  
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new CustomError("Invalid username or password", 401);
      }
  
      const token = generateToken(user);
      res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });
    } catch (error) {
      next(error); 
    }
  };


  // ==========================
// add new musics Controller
// ==========================

const _addMusic = async(req,res,next)=>{
  try {
      const {title,singers,duration,url,language} = req.body
      console.log(title,singers,duration,url,language);
      const MusicData = await Music.create({
        title,singers,duration,url,language
      })
     console.log(MusicData);
      res.status(201).json({message:"New Music Added"})
  } catch (error) {
    next(error)
  }
}
export { _Signup,_Login,_addMusic };
