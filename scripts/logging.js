

const Logger={
    
    debug(message){
        const today = new Date();
        const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        console.log(`[DEBUG] - ${dateTime} - ${message}`)
    },
    info(message){
        const today = new Date();
        const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        console.log(`[INFO] - ${dateTime} - ${message}`)
    },
    warning(message){
        const today = new Date();
        const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        console.log(`[WARNING] - ${dateTime} - ${message}`)
    },error(message){
        const today = new Date();
        const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        console.log(`[ERROR] - ${dateTime} - ${message}`)
    }
}

module.exports=Logger