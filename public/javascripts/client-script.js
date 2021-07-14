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
    });

    let text = $('input')

    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('')
        }
    });

    socket.on('create-message', (message) => {
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToButton()
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
};

const scrollToButton = () => {
    var d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"))
};

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton()
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const setMuteButton = () => {
    const html = `
        <i class="mute fas fa-microphone"></i>
        <span>Mute</span>
    `;
    document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `;
    document.querySelector('.main_mute_button').innerHTML = html;
}