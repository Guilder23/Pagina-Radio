const playlistViewport = document.getElementById("playlistViewport");
const playlistPrev = document.getElementById("playlistPrev");
const playlistNext = document.getElementById("playlistNext");
const spotifyEmbed = document.getElementById("spotifyEmbed");
const spotifyEmbedWrapper = document.getElementById("spotifyEmbedWrapper");
const playlistCards = document.querySelectorAll(".playlist-card");
const playlistButtons = document.querySelectorAll(".playlist-play-btn");
const radioPlayerForPlaylist = document.getElementById("radioPlayer");
const spotifyThumbnailCache = new Map();

function getSpotifyTrackUrl(spotifyUri) {
    return `https://open.spotify.com/track/${spotifyUri}`;
}

async function fetchSpotifyThumbnail(spotifyUri) {
    if (!spotifyUri) {
        return null;
    }

    if (spotifyThumbnailCache.has(spotifyUri)) {
        return spotifyThumbnailCache.get(spotifyUri);
    }

    try {
        const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(getSpotifyTrackUrl(spotifyUri))}`);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const thumbnailUrl = data.thumbnail_url || null;

        if (thumbnailUrl) {
            spotifyThumbnailCache.set(spotifyUri, thumbnailUrl);
        }

        return thumbnailUrl;
    } catch {
        return null;
    }
}

async function setSpotifyCoverImage(card) {
    const spotifyUri = card.dataset.spotifyUri;
    const img = getCardImage(card);
    if (!spotifyUri || !img) {
        return;
    }

    const thumbnailUrl = await fetchSpotifyThumbnail(spotifyUri);
    if (!thumbnailUrl) {
        return;
    }

    img.src = thumbnailUrl;
    if (card.dataset.trackTitle) {
        img.alt = `${card.dataset.trackTitle} portada de Spotify`;
    }
}

function getCardImage(card) {
    return card?.querySelector("img");
}

function initializePlaylistCoverImages() {
    playlistCards.forEach((card) => {
        setSpotifyCoverImage(card);
    });
}

// Open Spotify track when clicking on card
playlistCards.forEach((card) => {
    card.addEventListener("click", (e) => {
        // Don't open Spotify if clicking the play button
        if (e.target.closest(".playlist-play-btn")) {
            return;
        }
        const spotifyUri = card.dataset.spotifyUri;
        if (spotifyUri) {
            window.open(`https://open.spotify.com/track/${spotifyUri}`, "_blank");
        }
    });
});

initializePlaylistCoverImages();

function getCarouselStep() {
    const firstCard = playlistCards[0];

    if (!firstCard) {
        return 0;
    }

    const gap = Number.parseFloat(getComputedStyle(firstCard.parentElement).columnGap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
}

function updateCarouselButtons() {
    const maxScroll = playlistViewport.scrollWidth - playlistViewport.clientWidth - 2;

    playlistPrev.disabled = playlistViewport.scrollLeft <= 2;
    playlistNext.disabled = playlistViewport.scrollLeft >= maxScroll;
}

function movePlaylistCarousel(direction) {
    playlistViewport.scrollBy({
        left: getCarouselStep() * direction,
        behavior: "smooth",
    });
}

function updatePlaylistCards(activeButton, isPlaying) {
    playlistButtons.forEach((button) => {
        const buttonPlaying = button === activeButton && isPlaying;
        button.textContent = buttonPlaying ? "Pausa" : "Play";
        button.classList.toggle("is-playing", buttonPlaying);
        button.setAttribute("aria-pressed", String(buttonPlaying));
    });

    playlistCards.forEach((card) => {
        const belongsToActiveButton = activeButton ? card.contains(activeButton) : false;
        card.classList.toggle("is-playing", belongsToActiveButton && isPlaying);
    });
}

function playPlaylistTrack(button) {
    const card = button.closest(".playlist-card");

    if (!card) {
        return;
    }

    const spotifyUri = card.dataset.spotifyUri;
    if (!spotifyUri) {
        return;
    }

    const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${spotifyUri}`;

    if (button.classList.contains("is-playing")) {
        spotifyEmbed.removeAttribute("src");
        spotifyEmbedWrapper.hidden = true;
        updatePlaylistCards(button, false);
        return;
    }

    if (!radioPlayerForPlaylist.paused) {
        radioPlayerForPlaylist.pause();
    }

    spotifyEmbedWrapper.hidden = false;
    spotifyEmbed.setAttribute("src", spotifyEmbedUrl);
    updatePlaylistCards(button, true);
}

playlistPrev.addEventListener("click", () => movePlaylistCarousel(-1));
playlistNext.addEventListener("click", () => movePlaylistCarousel(1));
playlistViewport.addEventListener("scroll", updateCarouselButtons);
window.addEventListener("resize", updateCarouselButtons);

playlistViewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePlaylistCarousel(-1);
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        movePlaylistCarousel(1);
    }
});

playlistButtons.forEach((button) => {
    button.addEventListener("click", () => playPlaylistTrack(button));
});

updateCarouselButtons();
