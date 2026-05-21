const playBtn = document.getElementById("playBtn");
const bottomPlay = document.getElementById("bottomPlay");
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("mobileSidebar");
const overlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

let isPlaying = false;

function togglePlayback() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playBtn.textContent = "Pausar radio";
        bottomPlay.textContent = "Pausa";
    } else {
        playBtn.textContent = "Play radio";
        bottomPlay.textContent = "Play";
    }
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

const revealTargets = document.querySelectorAll(".hero-left, .hero-player, .highlight-item, .panel");
revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.animationDelay = `${index * 100}ms`;
});