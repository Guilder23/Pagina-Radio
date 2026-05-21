const playBtn = document.getElementById("playBtn");
const livePlayBtn = document.getElementById("livePlayBtn");
const bottomPlay = document.getElementById("bottomPlay");
const volumeRange = document.getElementById("volumeRange");
const heroVolumeDownBtn = document.getElementById("heroVolumeDownBtn");
const heroVolumeUpBtn = document.getElementById("heroVolumeUpBtn");
const watchLiveBtn = document.getElementById("watchLiveBtn");
const youtubeLiveFrame = document.getElementById("youtubeLiveFrame");
const sharePageBtn = document.getElementById("sharePageBtn");
const volumeDownBtn = document.getElementById("volumeDownBtn");
const volumeUpBtn = document.getElementById("volumeUpBtn");
const radioPlayer = document.getElementById("radioPlayer");
const playlistPlayer = document.getElementById("playlistPlayer");
const playerStatus = document.getElementById("playerStatus");
const heroPlayer = document.querySelector(".hero-player");
const bottomPlayer = document.querySelector(".bottom-player");
const playlistCards = document.querySelectorAll(".playlist-card");
const playlistButtons = document.querySelectorAll(".playlist-play-btn");
const heroTitle = document.querySelector(".hero-title");
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("mobileSidebar");
const overlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

const streamUrl = "https://stream-02.surfernetwork.com/sfqwqh7vd6quv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJzZnF3cWg3dmQ2cXV2IiwiaG9zdCI6InN0cmVhbS0wMi5zdXJmZXJuZXR3b3JrLmNvbSIsInJ0dGwiOjUsImp0aSI6Ijg1SXZyM2N5U1VhbUNBNlN5ZUJHNUEiLCJpYXQiOjE3NzkzNjk5NjEsImV4cCI6MTc3OTM3MDAyMX0.KrBt2NBm95UItrMElVLnTzmIrNK_rP3KwkDaV7b3GrE&cto-uid=928323b8-fb3a-4c04-9418-24ba93474de6-66cf8cb1-424f&acu-uid=1463883372361&an-uid=6590601941648504964&dot-uid=0d2f2204007fc6007f3535a8&triton-uid=cookie%3A2a7bf438-d03c-43f7-9592-ce02e0e3338b&amb-uid=8290782153782580478&dbm-uid=CAESEDXcVa4TM5l1ttTw8P9wUWs&dyn-uid=1838828465535879092&ttd-uid=7f7a1b71-eab6-4caf-99dd-a160feafc55e&aw_0_req_lsid=f300d633caf8460738d97d65e4487104";

radioPlayer.src = streamUrl;
radioPlayer.volume = Number(volumeRange.value) / 100;
playlistPlayer.src = "audio/audio1.mp3";
playlistPlayer.preload = "metadata";

function setPlaybackUI(isPlaying, message) {
    const playLabel = playBtn.querySelector("span");
    const label = isPlaying ? "Pausar radio" : "Escuchar radio";
    const bottomLabel = isPlaying ? "Pausa" : "Play";
    const liveLabel = isPlaying ? ".  Reproduciendo" : ".  Escuchar en vivo";

    if (playLabel) {
        playLabel.textContent = label;
    } else {
        playBtn.textContent = label;
    }
    bottomPlay.textContent = bottomLabel;
    livePlayBtn.textContent = liveLabel;
    playBtn.setAttribute("aria-label", isPlaying ? "Pausar radio" : "Reproducir radio");
    livePlayBtn.setAttribute("aria-label", isPlaying ? "Radio reproduciendose, tocar para pausar" : "Escuchar en vivo");
    bottomPlay.setAttribute("aria-label", isPlaying ? "Pausar radio" : "Reproducir radio");
    playBtn.setAttribute("aria-pressed", String(isPlaying));
    livePlayBtn.setAttribute("aria-pressed", String(isPlaying));
    bottomPlay.setAttribute("aria-pressed", String(isPlaying));
    playBtn.classList.toggle("is-playing", isPlaying);
    livePlayBtn.classList.toggle("is-playing", isPlaying);
    bottomPlay.classList.toggle("is-playing", isPlaying);
    heroPlayer.classList.toggle("is-playing", isPlaying);
    bottomPlayer.classList.toggle("is-playing", isPlaying);

    if (message) {
        playerStatus.textContent = message;
    }
}

function togglePlayback() {
    showRadioMode();

    if (radioPlayer.paused) {
        playerStatus.textContent = "Conectando con la radio...";
        radioPlayer.play().catch(() => {
            setPlaybackUI(false, "No se pudo iniciar la transmision. Intenta de nuevo.");
        });
        return;
    }

    radioPlayer.pause();
    setPlaybackUI(false, "Radio en pausa.");
}

function showVideoMode() {
    if (!youtubeLiveFrame.getAttribute("src")) {
        youtubeLiveFrame.setAttribute("src", youtubeLiveFrame.dataset.src);
    }

    heroPlayer.classList.add("is-video");
    watchLiveBtn.classList.add("is-active");
    watchLiveBtn.setAttribute("aria-pressed", "true");
    watchLiveBtn.querySelector("span").textContent = "Solo escuchar";
    watchLiveBtn.setAttribute("aria-label", "Volver a solo escuchar la radio");
    playerStatus.textContent = radioPlayer.paused
        ? "Video en vivo muteado. Puedes activar la radio cuando quieras."
        : "Video en vivo muteado. La radio sigue sonando.";
}

function showRadioMode() {
    heroPlayer.classList.remove("is-video");
    watchLiveBtn.classList.remove("is-active");
    watchLiveBtn.setAttribute("aria-pressed", "false");
    watchLiveBtn.querySelector("span").textContent = "Ver en vivo";
    watchLiveBtn.setAttribute("aria-label", "Ver transmision en vivo");

    if (youtubeLiveFrame.getAttribute("src")) {
        youtubeLiveFrame.removeAttribute("src");
    }
}

function toggleVideoMode() {
    if (heroPlayer.classList.contains("is-video")) {
        showRadioMode();
        playerStatus.textContent = radioPlayer.paused ? "Radio en pausa." : "Transmitiendo en vivo.";
        return;
    }

    showVideoMode();
}

async function sharePage() {
    const shareData = {
        title: document.title,
        text: "Escucha La Nueva Latina en vivo.",
        url: window.location.href,
    };

    if (navigator.share) {
        await navigator.share(shareData).catch(() => {});
        return;
    }

    if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        playerStatus.textContent = "Enlace copiado para compartir.";
        return;
    }

    playerStatus.textContent = "Copia el enlace de la barra del navegador para compartir.";
}

function changeVolume(step) {
    const nextVolume = Math.min(1, Math.max(0, radioPlayer.volume + step));
    radioPlayer.volume = nextVolume;
    volumeRange.value = String(Math.round(nextVolume * 100));
}

function syncVolumeFromSlider() {
    radioPlayer.volume = Number(volumeRange.value) / 100;
}

function typeHeroTitle() {
    if (!heroTitle) {
        return;
    }

    const lines = Array.from(heroTitle.querySelectorAll(".hero-title-line"));
    const texts = lines.map((line) => line.dataset.text || "");

    heroTitle.classList.add("is-typing");
    heroTitle.classList.remove("is-done");
    lines.forEach((line) => {
        line.textContent = "";
    });

    let lineIndex = 0;
    let charIndex = 0;

    const tick = () => {
        const currentLine = lines[lineIndex];

        if (!currentLine) {
            heroTitle.classList.remove("is-typing");
            heroTitle.classList.add("is-done");
            return;
        }

        const text = texts[lineIndex];
        currentLine.textContent = text.slice(0, charIndex + 1);
        charIndex += 1;

        if (charIndex < text.length) {
            window.setTimeout(tick, 90);
            return;
        }

        lineIndex += 1;
        charIndex = 0;

        if (lineIndex < lines.length) {
            window.setTimeout(tick, 220);
            return;
        }

        heroTitle.classList.remove("is-typing");
        heroTitle.classList.add("is-done");
    };

    tick();
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

function togglePlaylistPreview(button) {
    const card = button.closest(".playlist-card");

    if (!card) {
        return;
    }

    if (!playlistPlayer.paused && !button.classList.contains("is-playing")) {
        playlistPlayer.pause();
    }

    if (button.classList.contains("is-playing")) {
        playlistPlayer.pause();
        updatePlaylistCards(button, false);
        return;
    }

    if (!radioPlayer.paused) {
        radioPlayer.pause();
    }

    playlistPlayer.currentTime = 0;
    playlistPlayer.play().then(() => {
        updatePlaylistCards(button, true);
    }).catch(() => {
        updatePlaylistCards(button, false);
    });
}

function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("no-scroll");
    menuToggle.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");
}

function closeSidebarMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    menuToggle.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
}

playBtn.addEventListener("click", togglePlayback);
livePlayBtn.addEventListener("click", togglePlayback);
bottomPlay.addEventListener("click", togglePlayback);
watchLiveBtn.addEventListener("click", toggleVideoMode);
sharePageBtn.addEventListener("click", sharePage);
volumeRange.addEventListener("input", syncVolumeFromSlider);
heroVolumeDownBtn.addEventListener("click", () => changeVolume(-0.1));
heroVolumeUpBtn.addEventListener("click", () => changeVolume(0.1));
volumeDownBtn.addEventListener("click", () => changeVolume(-0.1));
volumeUpBtn.addEventListener("click", () => changeVolume(0.1));
playlistButtons.forEach((button) => {
    button.addEventListener("click", () => togglePlaylistPreview(button));
});
menuToggle.addEventListener("click", openSidebar);
closeSidebar.addEventListener("click", closeSidebarMenu);
overlay.addEventListener("click", closeSidebarMenu);

sidebarLinks.forEach((link) => {
    link.addEventListener("click", closeSidebarMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebarMenu();
    }
});

radioPlayer.addEventListener("playing", () => {
    setPlaybackUI(true, "Transmitiendo en vivo.");
});

radioPlayer.addEventListener("pause", () => {
    setPlaybackUI(false, "Radio en pausa.");
});

radioPlayer.addEventListener("waiting", () => {
    playerStatus.textContent = "Cargando la transmision...";
});

radioPlayer.addEventListener("error", () => {
    setPlaybackUI(false, "No se pudo cargar la radio. Verifica el enlace o reintenta.");
});

playlistPlayer.addEventListener("pause", () => {
    updatePlaylistCards(null, false);
});

playlistPlayer.addEventListener("ended", () => {
    updatePlaylistCards(null, false);
});

setPlaybackUI(false, "Listo para reproducir la radio en vivo.");

const revealTargets = document.querySelectorAll(".hero-left, .hero-player, .highlight-item, .panel");
revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.animationDelay = `${index * 100}ms`;
});

window.setTimeout(() => {
    typeHeroTitle();
}, 220);
