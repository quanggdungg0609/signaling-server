

async function CreatePeerConnection(sdp){
    const config={
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302'
          }
        ]
    }
    const peer=new RTCPeerConnection(config)
    peer.ontrack = (event) => {
        console.log(event)
     };
    peer.onconnectionstatechange  = (event) => {
        console.log(event)
    };
    peer.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return { peer, answer };
}

module.exports={CreatePeerConnection}