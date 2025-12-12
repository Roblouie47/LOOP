// YouTube IFrame API loader
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

let player;
let currentLoop = 0;
let maxLoops = 1;

function getYouTubeID(url) {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
}

function onYouTubeIframeAPIReady() {
    // Placeholder, actual player is created on form submit
}

function createPlayer(videoId) {
    if (player) {
        player.destroy();
    }
    player = new YT.Player('player-container', {
        height: '360',
        width: '640',
        videoId: videoId,
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        currentLoop++;
        if (currentLoop < maxLoops) {
            player.seekTo(0);
            player.playVideo();
        }
    }
}

document.getElementById('youtube-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('youtube-url').value.trim();
    const loopCount = parseInt(document.getElementById('loop-count').value, 10);
    const videoId = getYouTubeID(url);
    if (!videoId) {
        alert('Invalid YouTube URL');
        return;
    }
    maxLoops = Math.max(1, Math.min(100, loopCount));
    currentLoop = 0;
    createPlayer(videoId);
});
