import env from "./config/env.js";
import http from 'http'
import  app from './index.js'

const server=http.createServer(app);

server.listen(env.PORT, ()=>{
    console.log(`Server is running ${env.PORT} port`);
})
