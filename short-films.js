const backgroundSlides = document.querySelectorAll(".short-films-bg");
const shortFilmsPage = document.querySelector(".short-films-page");
const expandableFilmRows = document.querySelectorAll("[data-expandable]");

function getImageBrightness(backgroundElement) {
    const computedStyle = window.getComputedStyle(backgroundElement);
    const match = computedStyle.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);

    if (!match || !match[2]) {
        return 0.5;
    }

    return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
            const sampleSize = 40;
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = sampleSize;
            canvas.height = sampleSize;
            context.drawImage(image, 0, 0, sampleSize, sampleSize);

            const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;
            let totalBrightness = 0;

            for (let index = 0; index < pixels.length; index += 4) {
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                totalBrightness += (red * 0.299 + green * 0.587 + blue * 0.114);
            }

            const averageBrightness = totalBrightness / (sampleSize * sampleSize * 255);
            resolve(averageBrightness);
        };
        image.onerror = () => resolve(0.5);
        image.src = match[2];
    });
}

async function updateBackgroundTextContrast() {
    if (!backgroundSlides.length || !shortFilmsPage) {
        return;
    }

    const background = backgroundSlides[0];
    const brightness = await getImageBrightness(background);
    shortFilmsPage.classList.toggle("is-light", brightness > 0.55);
}

function stopFilmVideos() {
    expandableFilmRows.forEach((row) => {
        row.querySelectorAll("iframe").forEach((videoFrame) => {
            if (!videoFrame.dataset.originalSrc) {
                videoFrame.dataset.originalSrc = videoFrame.src;
            }
            videoFrame.src = "about:blank";
        });
    });
}

function startFilmVideos(row) {
    row.querySelectorAll("iframe").forEach((videoFrame) => {
        const originalSrc = videoFrame.dataset.originalSrc || videoFrame.src;
        videoFrame.dataset.originalSrc = originalSrc;
        const videoUrl = new URL(originalSrc);
        videoUrl.searchParams.set("autoplay", "1");
        videoFrame.src = videoUrl.toString();
    });
}

document.addEventListener("click", (event) => {
    const clickedBox = event.target.closest(".qco-blank-large, .qco-blank-small");

    if (clickedBox) {
        return;
    }

    const clickedRow = event.target.closest("[data-expandable]");

    if (!clickedRow) {
        stopFilmVideos();
        expandableFilmRows.forEach((row) => row.classList.remove("is-expanded"));
        return;
    }

    const wasOpen = clickedRow.classList.contains("is-expanded");
    stopFilmVideos();
    expandableFilmRows.forEach((row) => row.classList.remove("is-expanded"));

    if (!wasOpen) {
        clickedRow.classList.add("is-expanded");
        startFilmVideos(clickedRow);

        window.setTimeout(() => {
            window.scrollBy({
                top: 140,
                behavior: "smooth"
            });
        }, 100);
    }
});

window.addEventListener("load", updateBackgroundTextContrast);
