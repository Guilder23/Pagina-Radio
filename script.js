const playBtn = document.getElementById("playBtn");
const bottomPlay = document.getElementById("bottomPlay");
const volumeRange = document.getElementById("volumeRange");
const volumeDownBtn = document.getElementById("volumeDownBtn");
const volumeUpBtn = document.getElementById("volumeUpBtn");
const radioPlayer = document.getElementById("radioPlayer");
const playerStatus = document.getElementById("playerStatus");
const heroPlayer = document.querySelector(".hero-player");
const bottomPlayer = document.querySelector(".bottom-player");
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("mobileSidebar");
const overlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

const streamUrl = "https://stream-02.surfernetwork.com/sfqwqh7vd6quv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJzZnF3cWg3dmQ2cXV2IiwiaG9zdCI6InN0cmVhbS0wMi5zdXJmZXJuZXR3b3JrLmNvbSIsInJ0dGwiOjUsImp0aSI6Ijg1SXZyM2N5U1VhbUNBNlN5ZUJHNUEiLCJpYXQiOjE3NzkzNjk5NjEsImV4cCI6MTc3OTM3MDAyMX0.KrBt2NBm95UItrMElVLnTzmIrNK_rP3KwkDaV7b3GrE&cto-uid=928323b8-fb3a-4c04-9418-24ba93474de6-66cf8cb1-424f&acu-uid=1463883372361&an-uid=6590601941648504964&dot-uid=0d2f2204007fc6007f3535a8&triton-uid=cookie%3A2a7bf438-d03c-43f7-9592-ce02e0e3338b&amb-uid=8290782153782580478&dbm-uid=CAESEDXcVa4TM5l1ttTw8P9wUWs&dyn-uid=1838828465535879092&ttd-uid=7f7a1b71-eab6-4caf-99dd-a160feafc55e&aw_0_req_lsid=f300d633caf8460738d97d65e4487104";

radioPlayer.src = streamUrl;
radioPlayer.volume = Number(volumeRange.value) / 100;

function setPlaybackUI(isPlaying, message) {
    const label = isPlaying ? "Pausar radio" : "Play radio";
    const bottomLabel = isPlaying ? "Pausa" : "Play";

    playBtn.textContent = label;
    bottomPlay.textContent = bottomLabel;
    playBtn.setAttribute("aria-pressed", String(isPlaying));
    bottomPlay.setAttribute("aria-pressed", String(isPlaying));
    playBtn.classList.toggle("is-playing", isPlaying);
    bottomPlay.classList.toggle("is-playing", isPlaying);
    heroPlayer.classList.toggle("is-playing", isPlaying);
    bottomPlayer.classList.toggle("is-playing", isPlaying);

    if (message) {
        playerStatus.textContent = message;
    }
}

function togglePlayback() {
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

function changeVolume(step) {
    const nextVolume = Math.min(1, Math.max(0, radioPlayer.volume + step));
    radioPlayer.volume = nextVolume;
    volumeRange.value = String(Math.round(nextVolume * 100));
}

function syncVolumeFromSlider() {
    radioPlayer.volume = Number(volumeRange.value) / 100;
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
bottomPlay.addEventListener("click", togglePlayback);
volumeRange.addEventListener("input", syncVolumeFromSlider);
volumeDownBtn.addEventListener("click", () => changeVolume(-0.1));
volumeUpBtn.addEventListener("click", () => changeVolume(0.1));
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

setPlaybackUI(false, "Listo para reproducir la radio en vivo.");

const revealTargets = document.querySelectorAll(".hero-left, .hero-player, .highlight-item, .panel");
revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.animationDelay = `${index * 100}ms`;
});