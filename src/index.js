
import express from 'express'
import cors from 'cors'
import userRoute from './routes/user.js'


const app=express()
app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/user', userRoute)



export default app;
