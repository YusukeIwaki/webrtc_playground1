window.onload = function() {
    var video = document.getElementById("my_video");
    video.style.transform = "rotateY(180deg)"
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function(stream) {
            console.log(stream);
            video.autoplay = true;
            video.src = window.URL.createObjectURL(stream);
        })
        .catch(function(err) {
            console.log(err);
        });
}