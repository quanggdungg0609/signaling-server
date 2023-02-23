const io=require("socket.io-client")
const socket = io();
const { v4: uuidv4 } = require('uuid');

const logger=require("../scripts/logging")
const {CreatePeerConnection}=require('./handle-peer')


const camList= new Map()
const peersList=new Map()



socket.on("connect",()=>{
    logger.info("Connected to server")
    socket.emit("new", {id:uuidv4(), type:"client"})
})

socket.on("list-camera",(data)=>{
    logger.debug("On 'list-camera' event")
    console.log(data)
    // Add camera already connected to server to the camList
    data.forEach(element=>{
        camList.set(element.id,element.name)
    })
    console.log(camList)
})

socket.on("camera-connected",data=>{
    // if listen a event "camera-connected" add the new camera connected to server to the list
    logger.info("New camera connected")
    console.log(data)
    if(!camList.has(data.id)){
        camList.set(data.id, data.name)
    }
    logger.info("Add the new connected camera from the list")
})

socket.on("camera-disconnected", data=> {
    if(camList.has(data.id)){
        camList.delete(data.id)
    }
    logger.info("Remove the disconnected camera from the list")
    // TODO: khi camera ngắt kết nối phải close kết nối với camera đó và xóa khỏi peerList
})

socket.on("offer",async data=>{
    logger.debug("on 'offer' event")
    if (typeof data.payload!=="object"){
        data.payload=JSON.parse(data.payload)
    }
    let peer, answer
    try{
        const result=await CreatePeerConnection(data.payload)
        peer=result.peer
        answer=result.answer
    }catch (error){
        console.log("error: ", error)
    }
    
    peersList.set(data.id,peer)
    const message={
        target:data.id,
        payload:answer.toJSON()
    }
    socket.emit("answer", message)
    // TODO: kiểm tra lại peer và lấy stream từ peer
    
})

