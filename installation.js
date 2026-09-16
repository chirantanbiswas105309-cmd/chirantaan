const installationImage = document.querySelector(".installation-showcase img");

if (installationImage) {
    installationImage.setAttribute("loading", "eager");
}

const installationPlay = document.querySelector(".installation-play");
const installationFeature = document.querySelector(".installation-feature");
const installationInlineVideo = document.querySelector(".installation-inline-video");

if (installationPlay && installationFeature && installationInlineVideo) {
    const playInstallationVideo = () => {
        installationFeature.querySelector("img").hidden = true;
        installationPlay.hidden = true;
        installationInlineVideo.hidden = false;
        installationFeature.classList.add("is-playing");
    };

    installationFeature.addEventListener("click", playInstallationVideo, { once: true });
}

