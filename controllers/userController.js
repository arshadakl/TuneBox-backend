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

const cookiePre = {
  httpOnly: true,
  secure: true, 
  sameSite: 'none',
  domain: 'tune-box.vercel.app',
  maxAge: 24 * 60 * 60 * 1000
}

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
      cookiePre
    });
    res.cookie("user", user.username, {
      cookiePre
    });

    res
      .status(200)
      .json({ success: true, message: "Account Created successfully", user });
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
    console.log(username, password);
    if (!(username && password)) {
      throw new CustomError("Please fill all fields", 422);
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new CustomError("Invalid username or password", 401);
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      cookiePre
    });
    res.cookie("user", user.username, {
      cookiePre
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

const _logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      cookiePre
    });
    res.cookie("user", "", {
      cookiePre
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// ==========================
// add new musics Controller
// ==========================

const _addMusic = async (req, res, next) => {
  try {
    const user = req.user;
    const { title, singers, duration, url, thumbnailUrl, startTime, endTime } =
      req.body;
    // console.log(title, singers, duration, url, thumbnailUrl);
    // console.log("user details :", req.user);
    const existingMusic = await Music.findOne({ user: user._id, url });
    console.log(existingMusic);
    if (existingMusic) {
      throw new CustomError("Music already in your Box", 400);
    }
    const newMusicData = new Music({
      user: user._id,
      title,
      singers,
      duration,
      url,
      thumbnailUrl,
      startTime,
      endTime,
    });

    const MusicData = await newMusicData.save();
    console.log(MusicData);
    res
      .status(201)
      .json({ success: true, message: "New Music Added", data: MusicData });
  } catch (error) {
    next(error);
  }
};

const _userPlaylist = async (req, res, next) => {
  try {
    const user = req.user;
    const playList = await Music.find({ user: user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).json({ success: true, music: playList });
  } catch (error) {
    next(error);
  }
};
export { _Signup, _Login, _logout, _addMusic, _userPlaylist };
