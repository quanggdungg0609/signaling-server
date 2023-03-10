const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');
const Logger=require("./logging")

function HandleIO(server){
    const io = new Server(server,
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
            transports: ['websocket', 'polling'],
        },
        allowEIO3: true
    });
    
    const camList=new Map()
    let clientList= new Map()

    io.on("connection", (socket) => {
        socket.on("new",(data)=>{
            if (typeof data !== "object"){
                data=JSON.parse(data)
            }
            // If camera connect
            if (data.type==="camera"){
                if (!camList.has(data.name)){
                    Logger.info(`${data.type} connected`)
                    camList.set(socket.id, {id:data.id, name:data.name})
                    socket.join("cam-room")
                }

                // handle the notice action from camera to all clients
                if(clientList.size===0){
                    Logger.info("No client connected...")
                }
                else{
                    // send the connected camera list to client
                    const message = [...clientList.values()];
                    socket.emit("list-client", message)
                    
                    // emit a message to all camera new client has connected
                    Logger.info("Notice to all client a new camera connected...")
                    socket.to("client-room").emit("camera-connected",camList.get(socket.id,))
                }
                
            }

            // If Client connect
            else{
                Logger.info("Client connected")
                if (!clientList.has(socket.id)){
                    clientList.set(socket.id,`client_${data.id}`)
                    socket.join("client-room")
                }
                // handle the notice action from client to all camera
                if( camList.size===0 ){
                    Logger.info("No camera connected")
                }
                else{
                    // send the connected camera list to client
                    const message = [...camList.values()];
                    socket.emit("list-camera", message)
                    
                    // emit a message to all camera new client has connected
                    Logger.info("Notice to all camera a new client connected...")
                    socket.to("cam-room").emit("client-connected",clientList.get(socket.id))
                }
            }
        })


        socket.on("offer",(data)=>{
            let foundKey
            for (const [key, value] of clientList.entries()) {
                if (value === data.target) {
                  foundKey = key;
                  break;
                }
            }
            message={
                id: camList.get(socket.id)["id"],
                payload: data.payload
            }
            io.sockets.sockets.get(foundKey).emit("offer",message)
        })
        
        socket.on("answer",(data)=>{
            let foundKey
            for (const [key, value] of camList.entries()) {
                if (value.id === data.target) {
                  foundKey = key;
                  break;
                }
            }
            message={
                id: clientList.get(socket.id),
                payload: data.payload
            }
            io.sockets.sockets.get(foundKey).emit("answer", message)

        })

        socket.on("icecandidate",(data)=>{

        })

        socket.on("disconnect", (reason) => {
            let address=socket.handshake.address
            Logger.info(`[${address}] disconnected: - ${reason}`)

            // If a camera has disconnected
            if (camList.has(socket.id)){
                Logger.info("Remove the camera disconnected ...")
                io.to("client-room").emit("camera-disconnected",{id:camList.get(socket.id)["id"], name: camList.get(socket.id)["name"]})
                camList.delete(socket.id)
            }

            // If a client has disconnected
            if (clientList.has(socket.id)){
                Logger.info("Remove the client disconnected ...")
                io.to("cam-room").emit("client-disconnect", clientList.get(socket.id))
                clientList.delete(socket.id)
            }

        })

    });
}

module.exports=HandleIO