window.onload = function() {
    var video = document.getElementById("my_video");
    video.style.transform = "rotateY(180deg)"
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function(stream) {
            sendOffer(stream);

            video.autoplay = true;
            video.src = window.URL.createObjectURL(stream);
        })
        .catch(function(err) {
            console.log(err);
        });
        
    var socket = io.connect("http://webrtc-playground1-yusukeiwaki.c9users.io:8082/");
    socket.on("connect", function(evt) {
        console.log("socket.io: connect", evt);
    });
    socket.on("message", function(evt) {
        console.log("socket.io: message:", evt);
    });
    window._socket = socket;
}

function createPeerConnection(stream) {
    var peerConnection = new RTCPeerConnection({"iceServers":[]});
    peerConnection.onicecandidate = function(evt) {
        if (evt.candidate !== undefined) {
            console.log("ice_candidate:", evt.candidate);
        }
    };
    peerConnection.ontrack = function(evt) {
        console.log(evt);
        if (evt.streams !== undefined) {
            onRemoteStream(evt.streams[0])
        }
    };
    
    return peerConnection;
}

function onRemoteStream(remoteStream) {
    var anotherVideo = document.getElementById("another_video");
    anotherVideo.autoplay = true;
    anotherVideo.src = window.URL.createObjectURL(remoteStream);
}

function sendOffer(localStream) {
    var peerConnection = createPeerConnection(localStream);
    
    peerConnection.createOffer({'mandatory': {'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }})
        .then(function(sessionDescription) {
            peerConnection.setLocalDescription(sessionDescription);

            console.log("SDP:", JSON.stringify(sessionDescription));
            window._socket.json.send(sessionDescription);
        })
        .catch(function(err){
            console.log(err);    
        });
}

