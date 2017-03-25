window.onload = function() {
    var video = document.getElementById("my_video");
    video.style.transform = "rotateY(180deg)"
    navigator.getUserMedia({video: true, audio: false}, function(stream) {
        console.log(stream);
        video.autoplay = true;
        video.src = window.URL.createObjectURL(stream);
    }, function(err) {
        console.log(err);
    });
}