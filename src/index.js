
import express from 'express'
import cors from 'cors'
import userRoute from './routes/user.js'
import categoryRoute from './routes/caregory.js'


const app=express()
app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/user', userRoute);
app.use('/category', categoryRoute)



export default app;
