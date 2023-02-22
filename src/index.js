const io=require("socket.io-client")
const socket = io();

const logger=require("../scripts/logging")

const camList=[]
//TODO: tạo Peer, nhận SDP và gửi trả lại SDP cho camera để hoàn thành kết nối
socket.on("connect",()=>{
    logger.info("Connected to server")
    socket.emit("new", {type:"client"})
})
socket.on("list-camera",(data)=>{
    logger.debug("On 'list-camera' event")
    // Add camera already connected to server to the camList
    data.forEach(element=>{
        camList.push(element)
    })
    console.log(camList)
})

socket.on("camera-connected",data=>{
    // if listen a event "camera-connected" add the new camera connected to server to the list
    logger.info("New camera connected")
    console.log(data)
    if(camList.some(element=>element.id===data.id)===false){
        camList.push(data)
    }
    console.log(camList)
})
// TODO: Sự kiện khi 1 camera disconnect khỏi server
socket.on("camera-disconnected", data=> {
    logger.debug("camera-disconnected")
    console.log(data)
})

// socket.on("offer", data=>{
//     logger.debug("on offer event")
//     console.log(data)  
// })

