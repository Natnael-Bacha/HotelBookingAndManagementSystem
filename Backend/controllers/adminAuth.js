import User from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function handleAdminSignup(req, res) {
  const {
    firstName,
    middleName,
    lastName,
    email,
    idNumber,
    password,
    confirmPassword,
  } = req.body;
  try {
    const user = await User.findOne({ idNumber });
    if (password !== confirmPassword) {
      return res
        .status(404)
        .json({ message: "Sign up failed! please try again" });
    }
    if (user) {
      return res
        .status(404)
        .json({ message: "Sign up failed! please try again" });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      idNumber,
      password: hashPassword,
    });
    await newUser.save();
    console.log("Signed up!!");
    return res.status(200).json({message: "Signed up successfull!"});
  } catch (error) {
    console.log("Error signing up: ", error)
    return res.status(400).json({message: "Signup FAILED!"});
  }
}

export async function handleAdminSignin(req, res) {
   
  const {idNumber, password} = req.body;

  try {
     const user = await User.findOne({idNumber});
     if(!user){
      console.log("Error signing in no user");
        return res.status(404).json({message: "Error signing in!"})
     }
    
     const verifyPassword =  await bcrypt.compare(password, user.password);
     if(!verifyPassword){
      console.log("Error signing in password");
      return res.status(404).json({message: "Error signing in!"})
     }

    const token = jwt.sign({firstName: user.firstName, middleName: user.middleName, lastName: user.lastName}, process.env.KEY, {expiresIn: '24h'});
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: '/',
      maxAge: 3600000
    });
    return res.status(200).json({message: "Signed in successfully!"});
  } catch (error) {
    console.log("Error signing in", error);
    return res.status(404).json({message: "Error signing in!"});
  }


}
