const playlistViewport = document.getElementById("playlistViewport");
const playlistPrev = document.getElementById("playlistPrev");
const playlistNext = document.getElementById("playlistNext");
const playlistPlayer = document.getElementById("playlistPlayer");
const playlistCards = document.querySelectorAll(".playlist-card");
const playlistButtons = document.querySelectorAll(".playlist-play-btn");
const radioPlayerForPlaylist = document.getElementById("radioPlayer");

playlistPlayer.preload = "metadata";

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

    const trackSrc = card.dataset.trackSrc || "audio/audio1.mp3";

    if (button.classList.contains("is-playing")) {
        playlistPlayer.pause();
        updatePlaylistCards(button, false);
        return;
    }

    if (!radioPlayerForPlaylist.paused) {
        radioPlayerForPlaylist.pause();
    }

    if (playlistPlayer.getAttribute("src") !== trackSrc) {
        playlistPlayer.setAttribute("src", trackSrc);
    }

    playlistPlayer.currentTime = 0;
    playlistPlayer.play().then(() => {
        updatePlaylistCards(button, true);
    }).catch(() => {
        updatePlaylistCards(button, false);
    });
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

playlistPlayer.addEventListener("pause", () => {
    updatePlaylistCards(null, false);
});

playlistPlayer.addEventListener("ended", () => {
    updatePlaylistCards(null, false);
});

updateCarouselButtons();
