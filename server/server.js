import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { port } from './config/config.js'
import { connectDB } from './db/db.js'
import authRouter from './route/authRoutes/authRoutes.js'
import profileAuth from './route/profileAuth/profileAuth.js'
import testRoutes from './route/TestRoutes/testRoutes.js'
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))

//Api  End Points
app.get('/',(req,res)=>{
    res.send("<h1>API working</h1>")
})

app.use('/api/auth',authRouter)

app.use('/profile',profileAuth)

app.use('/api/tests', testRoutes);
const startServer = async()=>{
    try{
        await connectDB()
        app.listen(port,()=>{
            console.log(`server running on http://127.0.0.1:${port}`)
        })
    }catch(error){
        console.log(`the error is ${error}`)
    }
}

startServer()