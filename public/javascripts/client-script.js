const socket = io('/');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid')
myVideo.muted = true;

let myVideoStream;

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3023'
})

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream)

    // call peer
    peer.on('call', (call) => {
        call.answer(stream);
        const video = document.createElement('video')
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream)
    })
});

peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (uservideoStream) => {
        addVideoStream(video, uservideoStream)
    })
}
 
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    
    videoGrid.append(video);
}