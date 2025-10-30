const playlists = {
  chill: [
    {
      title: "Ocean Breeze",
      artist: "Lo-Fi Surfer",
      cover: "https://via.placeholder.com/300x300?text=Ocean+Breeze",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      title: "Evening Stars",
      artist: "Night Vibes",
      cover: "https://via.placeholder.com/300x300?text=Evening+Stars",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    }
  ],
  workout: [
    {
      title: "Power Up",
      artist: "Gym Beats",
      cover: "https://via.placeholder.com/300x300?text=Power+Up",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
      title: "Push Limits",
      artist: "Iron Pump",
      cover: "https://via.placeholder.com/300x300?text=Push+Limits",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    }
  ],
  top: [
    {
      title: "Hit Track",
      artist: "Pop Star",
      cover: "https://via.placeholder.com/300x300?text=Hit+Track",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
      title: "Number One",
      artist: "Chart Master",
      cover: "https://via.placeholder.com/300x300?text=Number+One",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    }
  ]
};

const trackList = document.getElementById('trackList');
const nowTitle = document.getElementById('now-title');
const nowArtist = document.getElementById('now-artist');
const coverImg = document.getElementById('cover');
const audio = document.getElementById('audio');
const playlistTitle = document.getElementById('playlist-title');

function loadPlaylist(name) {
  playlistTitle.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  trackList.innerHTML = '';
  playlists[name].forEach((track, i) => {
    const div = document.createElement('div');
    div.classList.add('track');
    div.innerHTML = `
      <img src="${track.cover}" alt="${track.title}" />
      <h4>${track.title}</h4>
      <p>${track.artist}</p>
    `;
    div.addEventListener('click', () => playTrack(track));
    trackList.appendChild(div);
  });
}

function playTrack(track) {
  nowTitle.textContent = track.title;
  nowArtist.textContent = track.artist;
  coverImg.src = track.cover;
  audio.src = track.url;
  audio.play();
}

// Load default
loadPlaylist('chill');