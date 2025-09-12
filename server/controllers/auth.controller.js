import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export async function SignUp(req,res){
    try{
        const {name,email,password}=req.body;
        const user=await User.findOne({email});
        if(user){
            return res.status(409).json({message:"User Already Exists,Log in please",success:false});
        }
        const hashedPass=await bcrypt.hash(password,10);
        const UserModel=new User({name,email,password:hashedPass});
        await UserModel.save();
        return res.status(201).json({message:"SignUp success",success:true})

    }
    catch(error){
        return res.status(500).json({message:"Internal server error",error:error.message});
    }
}

export async function Login(req,res){
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email}).select("+password");
        if(!user){
            return res.status(403).json({message:"User doesnt exist or credentials are wrong ,Please sign up",success:false})

        }

        const isPassEqual=await bcrypt.compare(password,user.password);
        if(!isPassEqual){
            return res.status(403).json({message:"password not correct",success:false})

        }
        const jwtToken=jwt.sign({_id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        )
        return res.status(200).json({message:"Logged in Successfully",success:true,jwtToken,email,name:user.name})
    }
    catch(error){
 
        return res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}