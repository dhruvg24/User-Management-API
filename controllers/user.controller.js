import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const registerUser = async(req, res)=>{
    try{
        const {username, email, password} = req.body;
        // check if user already exists
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: 'User already exists'});
        }
        // hash the password
        const hashedPswd = await bcrypt.hash(password, 10);

        // create new user
        const user = await User.create({
            username, email, password: hashedPswd
        })
        res.status(201).json({msg: "User registered successfully", user});
    }catch(err){
        console.error(err);
        res.status(500).json({msg: err.message});
    }
}


export const loginUser = async(req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: "User not found!"});
        }

        // compare the password in body and actual pswd
        const pswdMatch = await bcrypt.compare(password, user.password)
        if(!pswdMatch){
            return res.status(400).json({msg: 'Invalid credentials'});
        }

        // generate token 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn: "1h"});

        res.json({msg: "Login successfull", token});

    }catch(err){
        console.error(err);
        res.status(500).json({msg: err.message});
    }
}


export const getProfile= async(req,res)=>{
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user){
            return res.status(404).json({msg: "User not found!!"});
        }
        res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({msg: err.message});
    }
}

export const updateProfile = async(req,res)=>{
    try{
        const {username} = req.body;
        const updatedData = {username};

        // check for file updation/upload
        if(req.file){
            updatedData.avatar = req.file.path;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updatedData, {new:true}).select("-password");

        res.json({msg: 'Profile updated successfully', user});
        
    }catch(err){
        console.error(err);
        res.status(500).json({msg: err.message});
    }
}