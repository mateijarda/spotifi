// Sample song data
const sampleSongs = [
    {
        id: 1,
        title: "Summer Breeze",
        artist: "The Artists",
        duration: "3:45",
        durationInSeconds: 225,
        genre: "electronic"
    },
    {
        id: 2,
        title: "Midnight Dreams",
        artist: "Stellar Sound",
        duration: "4:12",
        durationInSeconds: 252,
        genre: "electronic"
    },
    {
        id: 3,
        title: "Electric Vibes",
        artist: "Neon Lights",
        duration: "3:28",
        durationInSeconds: 208,
        genre: "electronic"
    },
    {
        id: 4,
        title: "Ocean Waves",
        artist: "Coastal Beats",
        duration: "4:05",
        durationInSeconds: 245,
        genre: "electronic"
    },
    {
        id: 5,
        title: "Urban Jungle",
        artist: "City Sounds",
        duration: "3:52",
        durationInSeconds: 232,
        genre: "electronic"
    },
    {
        id: 6,
        title: "Cosmic Journey",
        artist: "Space Travelers",
        duration: "4:33",
        durationInSeconds: 273,
        genre: "electronic"
    },
    // House Music
    {
        id: 7,
        title: "Deep House Nights",
        artist: "House Vibes Collective",
        duration: "4:15",
        durationInSeconds: 255,
        genre: "house"
    },
    {
        id: 8,
        title: "Rhythm & Bass House",
        artist: "DJ Free Flow",
        duration: "3:58",
        durationInSeconds: 238,
        genre: "house"
    },
    {
        id: 9,
        title: "Tech House Evolution",
        artist: "Synth Masters",
        duration: "4:42",
        durationInSeconds: 282,
        genre: "house"
    },
    // Afrobeats
    {
        id: 10,
        title: "Afro Groove",
        artist: "African Rhythm",
        duration: "3:35",
        durationInSeconds: 215,
        genre: "afro"
    },
    {
        id: 11,
        title: "Sunset Vibes Afro",
        artist: "Afro Beats Kings",
        duration: "4:08",
        durationInSeconds: 248,
        genre: "afro"
    },
    {
        id: 12,
        title: "Dancing in Lagos",
        artist: "Afro Soul Band",
        duration: "3:52",
        durationInSeconds: 232,
        genre: "afro"
    },
    // Trap
    {
        id: 13,
        title: "Trap Anthem",
        artist: "Beat Droppers",
        duration: "3:22",
        durationInSeconds: 202,
        genre: "trap"
    },
    {
        id: 14,
        title: "Dark Trap Beats",
        artist: "Trap Masters",
        duration: "3:45",
        durationInSeconds: 225,
        genre: "trap"
    },
    {
        id: 15,
        title: "Trap Freestyle",
        artist: "Street Beats",
        duration: "4:01",
        durationInSeconds: 241,
        genre: "trap"
    },
    // Latino
    {
        id: 16,
        title: "Reggaeton Fuego",
        artist: "Latino Heat",
        duration: "3:48",
        durationInSeconds: 228,
        genre: "latino"
    },
    {
        id: 17,
        title: "Salsa Caliente",
        artist: "Sabor Latinos",
        duration: "4:22",
        durationInSeconds: 262,
        genre: "latino"
    },
    {
        id: 18,
        title: "Bachata Nights",
        artist: "Tropical Vibes",
        duration: "4:15",
        durationInSeconds: 255,
        genre: "latino"
    },
    // Techno
    {
        id: 19,
        title: "Industrial Techno",
        artist: "Techno Revolution",
        duration: "4:38",
        durationInSeconds: 278,
        genre: "techno"
    },
    {
        id: 20,
        title: "Minimal Techno",
        artist: "Synth Pulse",
        duration: "5:02",
        durationInSeconds: 302,
        genre: "techno"
    },
    {
        id: 21,
        title: "Berlin Nights",
        artist: "Electronic Underground",
        duration: "4:25",
        durationInSeconds: 265,
        genre: "techno"
    }
];

// Player state
let playerState = {
    isPlaying: false,
    currentSong: null,
    currentTime: 0,
    volume: 70,
    tracks: []
};

// Tracking links storage
let trackingLinks = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

function initializePage() {
    loadSampleSongs();
    setupEventListeners();
    loadTrackingLinks();
}

// Load sample songs into the UI
function loadSampleSongs() {
    const recentlyPlayedList = document.getElementById('recentlyPlayedList');
    const popularTracksList = document.getElementById('popularTracksList');

    // Clear existing content
    recentlyPlayedList.innerHTML = '';
    popularTracksList.innerHTML = '';

    // Add sample songs to both sections
    sampleSongs.forEach((song, index) => {
        const songElement = createSongElement(song);
        recentlyPlayedList.appendChild(songElement.cloneNode(true));
        if (index < 5) {
            popularTracksList.appendChild(songElement.cloneNode(true));
        }
    });
}

// Create a song element
function createSongElement(song) {
    const songItem = document.createElement('div');
    songItem.className = 'song-item';
    songItem.style.cursor = 'pointer';
    songItem.style.transition = 'all 0.2s ease';
    songItem.innerHTML = `
        <div class="song-item-info">
            <div class="song-item-image">
                <i class="fas fa-music"></i>
            </div>
            <div class="song-item-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        </div>
        <div class="song-duration">${song.duration}</div>
    `;

    songItem.addEventListener('click', () => {
        playSong(song);
    });
    
    songItem.addEventListener('mouseenter', () => {
        if (playerState.currentSong?.id !== song.id) {
            songItem.style.backgroundColor = 'var(--bg-tertiary)';
        }
    });
    
    songItem.addEventListener('mouseleave', () => {
        if (playerState.currentSong?.id !== song.id) {
            songItem.style.backgroundColor = '';
        }
    });
    
    return songItem;
}

// Play a song
function playSong(song) {
    playerState.currentSong = song;
    playerState.isPlaying = true;
    playerState.currentTime = 0;
    updatePlayerUI();
    updatePlayButton();
    highlightCurrentSong(song.id);
}

// Highlight the currently playing song
function highlightCurrentSong(songId) {
    // Remove highlight from all songs
    document.querySelectorAll('.song-item').forEach(item => {
        item.style.backgroundColor = '';
        item.style.opacity = '';
    });
    
    // Highlight the current song
    if (playerState.currentSong) {
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach(item => {
            const title = item.querySelector('.song-title')?.textContent;
            const artist = item.querySelector('.song-artist')?.textContent;
            if (title === playerState.currentSong.title && artist === playerState.currentSong.artist) {
                item.style.backgroundColor = 'var(--primary-dark)';
                item.style.opacity = '0.95';
            }
        });
    }
}

// Update player UI with current song info
function updatePlayerUI() {
    const song = playerState.currentSong;
    if (song) {
        document.querySelector('.track-name').textContent = song.title;
        document.querySelector('.artist-name').textContent = song.artist;
        document.getElementById('progressBar').max = song.durationInSeconds;
        document.querySelector('.duration').textContent = song.duration;
        document.getElementById('progressBar').value = playerState.currentTime;
    }
}

// Update play button state
function updatePlayButton() {
    const playBtn = document.getElementById('playBtn');
    if (playerState.isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Play button
    document.getElementById('playBtn').addEventListener('click', togglePlayPause);

    // Next/Previous buttons
    const controlButtons = document.querySelectorAll('.player-buttons .control-btn');
    if (controlButtons.length >= 5) {
        // Previous button
        controlButtons[1].addEventListener('click', playPreviousSong);
        // Next button
        controlButtons[3].addEventListener('click', playNextSong);
    }

    // Create playlist button
    document.getElementById('createPlaylistBtn').addEventListener('click', openPlaylistModal);

    // Playlist modal
    const playlistModal = document.getElementById('playlistModal');
    const linkModal = document.getElementById('linkModal');
    const closeBtns = document.querySelectorAll('.close');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            modal.classList.remove('active');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === playlistModal) {
            playlistModal.classList.remove('active');
        }
        if (e.target === linkModal) {
            linkModal.classList.remove('active');
        }
    });

    // Confirm playlist button
    document.getElementById('confirmPlaylistBtn').addEventListener('click', createPlaylist);

    // Manage links button
    document.getElementById('manageLinkBtn').addEventListener('click', openLinkModal);

    // Confirm link button
    document.getElementById('confirmLinkBtn').addEventListener('click', addTrackingLink);

    // Progress bar
    document.getElementById('progressBar').addEventListener('input', (e) => {
        playerState.currentTime = e.target.value;
        updateProgressDisplay();
    });

    // Volume slider
    document.getElementById('volumeSlider').addEventListener('input', (e) => {
        playerState.volume = e.target.value;
        updateVolumeDisplay();
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Claim offer button
    const claimOfferBtn = document.getElementById('claimOfferBtn');
    if (claimOfferBtn) {
        claimOfferBtn.addEventListener('click', claimOffer);
    }

    // Simulate progress bar movement when playing
    setInterval(() => {
        if (playerState.isPlaying && playerState.currentSong) {
            playerState.currentTime += 0.016; // Smoother increment (16ms = ~60fps)
            
            if (playerState.currentTime <= playerState.currentSong.durationInSeconds) {
                updateProgressDisplay();
            } else {
                // Song finished, move to next or stop
                playerState.isPlaying = false;
                playerState.currentTime = playerState.currentSong.durationInSeconds;
                updateProgressDisplay();
                updatePlayButton();
                // Auto-play next song
                const currentIndex = sampleSongs.findIndex(s => s.id === playerState.currentSong.id);
                if (currentIndex < sampleSongs.length - 1) {
                    setTimeout(() => {
                        playSong(sampleSongs[currentIndex + 1]);
                    }, 1000);
                }
            }
        }
    }, 16);
}

// Toggle play/pause
function togglePlayPause() {
    if (playerState.currentSong) {
        playerState.isPlaying = !playerState.isPlaying;
        updatePlayButton();
    } else {
        // Play first song if none selected
        playSong(sampleSongs[0]);
    }
}

// Play next song
function playNextSong() {
    if (playerState.currentSong) {
        const currentIndex = sampleSongs.findIndex(s => s.id === playerState.currentSong.id);
        if (currentIndex < sampleSongs.length - 1) {
            playSong(sampleSongs[currentIndex + 1]);
        } else {
            // Loop back to first song
            playSong(sampleSongs[0]);
        }
    } else {
        playSong(sampleSongs[0]);
    }
}

// Play previous song
function playPreviousSong() {
    if (playerState.currentSong) {
        const currentIndex = sampleSongs.findIndex(s => s.id === playerState.currentSong.id);
        if (currentIndex > 0) {
            playSong(sampleSongs[currentIndex - 1]);
        } else {
            // Loop to last song
            playSong(sampleSongs[sampleSongs.length - 1]);
        }
    } else {
        playSong(sampleSongs[0]);
    }
}

// Update progress display
function updateProgressDisplay() {
    if (!playerState.currentSong) return;
    
    const progressBar = document.getElementById('progressBar');
    const progress = document.querySelector('.progress');
    const timeDisplay = document.querySelector('.time');

    progressBar.value = playerState.currentTime;
    const percent = (playerState.currentTime / playerState.currentSong.durationInSeconds) * 100;
    progress.style.width = percent + '%';
    timeDisplay.textContent = formatTime(Math.floor(playerState.currentTime));
}

// Update volume display
function updateVolumeDisplay() {
    const volumeSlider = document.getElementById('volumeSlider');
    const value = (volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min) * 100;
    volumeSlider.style.background = `linear-gradient(to right, var(--primary-dark) 0%, var(--primary-dark) ${value}%, var(--bg-tertiary) ${value}%, var(--bg-tertiary) 100%)`;
}

// Format time display
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Open playlist modal
function openPlaylistModal() {
    document.getElementById('playlistModal').classList.add('active');
    document.getElementById('playlistName').focus();
}

// Create playlist
function createPlaylist() {
    const name = document.getElementById('playlistName').value.trim();
    if (name) {
        const playlistsList = document.querySelector('.playlists-list');
        const newPlaylist = document.createElement('div');
        newPlaylist.className = 'playlist-item';
        newPlaylist.textContent = name;
        playlistsList.appendChild(newPlaylist);

        // Clear inputs
        document.getElementById('playlistName').value = '';
        document.getElementById('playlistDesc').value = '';

        // Close modal
        document.getElementById('playlistModal').classList.remove('active');
    }
}

// Open link management modal
function openLinkModal() {
    document.getElementById('linkModal').classList.add('active');
    document.getElementById('trackingLink').focus();
    displayAddedLinks();
}

// Add tracking link
function addTrackingLink() {
    const linkInput = document.getElementById('trackingLink').value.trim();
    const labelInput = document.getElementById('linkLabel').value.trim();

    if (linkInput) {
        const linkObject = {
            id: Date.now(),
            url: linkInput,
            label: labelInput || new URL(linkInput).hostname,
            createdAt: new Date().toLocaleString()
        };

        trackingLinks.push(linkObject);
        saveTrackingLinks();

        // Clear inputs
        document.getElementById('trackingLink').value = '';
        document.getElementById('linkLabel').value = '';

        // Update display
        displayAddedLinks();
    }
}

// Display added links
function displayAddedLinks() {
    const linksList = document.getElementById('linksList');
    linksList.innerHTML = '';

    if (trackingLinks.length === 0) {
        linksList.innerHTML = '<div style="color: var(--text-secondary); font-size: 12px;">No links added yet</div>';
        return;
    }

    trackingLinks.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `
            <div class="link-item-text" title="${link.url}">
                <strong>${link.label}</strong><br>
                <small>${link.url.substring(0, 40)}...</small>
            </div>
            <button class="link-delete-btn" onclick="deleteTrackingLink(${link.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        linksList.appendChild(linkItem);
    });
}

// Delete tracking link
function deleteTrackingLink(id) {
    trackingLinks = trackingLinks.filter(link => link.id !== id);
    saveTrackingLinks();
    displayAddedLinks();
}

// Save tracking links to localStorage
function saveTrackingLinks() {
    localStorage.setItem('trackingLinks', JSON.stringify(trackingLinks));
}

// Load tracking links from localStorage
function loadTrackingLinks() {
    const saved = localStorage.getItem('trackingLinks');
    if (saved) {
        trackingLinks = JSON.parse(saved);
    }
}

// Search functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase();

    // Get all song items
    const songItems = document.querySelectorAll('.song-item');

    songItems.forEach(item => {
        const title = item.querySelector('.song-title')?.textContent.toLowerCase() || '';
        const artist = item.querySelector('.song-artist')?.textContent.toLowerCase() || '';

        if (title.includes(query) || artist.includes(query) || query === '') {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Navigation items
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Claim offer function - redirects to premium offer page
function claimOffer() {
    window.location.href = 'premium-offer.html';
}

// Playlist items click handler
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('playlist-item') && e.target.textContent !== 'Liked Songs' && e.target.textContent !== 'Discover Weekly' && e.target.textContent !== 'Release Radar') {
        // Custom action for clicked playlists
        console.log('Clicked playlist:', e.target.textContent);
    }
});

// Initialize volume display on load
window.addEventListener('load', () => {
    updateVolumeDisplay();
});
