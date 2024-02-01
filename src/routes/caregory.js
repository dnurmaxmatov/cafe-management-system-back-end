import { Router } from "express"
import { CategoryModel } from "../models/category.js"
import auth from '../services/authentication.js'
import checkRoles from "../services/checkRole.js"
import catchAsync from "../services/trycatch.js"

const router=Router()

router.post('/add', auth, checkRoles, catchAsync(async (req,res)=>{
    const {name}=req.body
    await CategoryModel.create({name})
    return res.status(201).json({message: "Category created successfully"})
}))

router.get('/get', auth,  catchAsync(async (req,res)=>{
    const results=await CategoryModel.find().sort({name: 'asc'})
    return res.status(200).json(results)
}))

router.patch('/update', auth, checkRoles, catchAsync(async (req,res)=>{
    const {id, name}=req.body;
    if(!id||!name){
        return res.status(404).json({messge: "invalid credintials"})
    }
    await CategoryModel.updateOne({_id: id}, {
        name
    })
    return res.status(200).json({message: "category updated Successfully"})
}))


export default router