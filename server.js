const { Server } = require("socket.io");
const express=require("express");
const { createServer } = require("http");
const morgan= require("morgan")
const path=require("path");
const cors=require("cors")

morgan(':method :url :status :res[content-length] - :response-time ms')

const HandleIO=require("./scripts/handleIO")

const app=express()
const httpServer=createServer(app)

app.use(morgan('combined'))
app.set('view engine','ejs')
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"))
app.use(cors())

HandleIO(httpServer)

app.get("/",(req,res)=>{
    res.render("index");
})

httpServer.listen(3000,()=>{
    console.log("Listening on port 3000")
});