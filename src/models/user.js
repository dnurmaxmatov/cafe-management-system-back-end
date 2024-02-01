import mongoose from "../config/db.js";


const {Schema, model}=mongoose

const UserSchema=new Schema({
    name: {type:String},
    contactNumber: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    status: {type: Boolean, default: false},
    role: {type: String, default: 'user'},

})

export const UserModel=model('User', UserSchema)