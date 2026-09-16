const illustrationImages = Array.from(document.querySelectorAll(".illustration-track img"));
const illustrationTrack = document.querySelector(".illustration-track");
const illustrationShowcase = document.querySelector(".illustration-showcase");
const previousIllustrationButton = document.querySelector(".illustration-arrow--left");
const nextIllustrationButton = document.querySelector(".illustration-arrow--right");
let activeIllustrationIndex = 0;
let illustrationZoom = 1;

function setActiveIllustration(index) {
    if (!illustrationImages.length || !illustrationTrack) {
        return;
    }

    activeIllustrationIndex = (index + illustrationImages.length) % illustrationImages.length;
    illustrationTrack.style.transform = `translateX(-${activeIllustrationIndex * 100}%)`;
    illustrationZoom = 1;

    illustrationImages.forEach((image, imageIndex) => {
        image.classList.toggle("is-active", imageIndex === activeIllustrationIndex);
        image.classList.toggle("is-before", imageIndex < activeIllustrationIndex);
        image.classList.toggle("is-after", imageIndex > activeIllustrationIndex);
        image.style.transform = imageIndex === activeIllustrationIndex ? "scale(1)" : "scale(.96)";
    });

    illustrationShowcase?.classList.remove("zoomed");
    if (illustrationShowcase) {
        illustrationShowcase.style.transformOrigin = "50% 50%";
        illustrationShowcase.style.transform = "scale(1)";
    }
}

function moveToIllustration(direction) {
    if (!illustrationImages.length) {
        return;
    }

    setActiveIllustration(activeIllustrationIndex + direction);
}

function updateIllustrationZoom(nextZoom, pointerX, pointerY) {
    if (!illustrationShowcase) {
        return;
    }

    const rect = illustrationShowcase.getBoundingClientRect();
    const x = ((pointerX - rect.left) / rect.width) * 100;
    const y = ((pointerY - rect.top) / rect.height) * 100;

    illustrationZoom = Math.min(2.8, Math.max(1, nextZoom));
    illustrationShowcase.style.transformOrigin = `${x}% ${y}%`;
    illustrationShowcase.style.transform = `scale(${illustrationZoom})`;
    illustrationShowcase.classList.toggle("zoomed", illustrationZoom > 1);
}

if (illustrationImages.length) {
    setActiveIllustration(0);
}

previousIllustrationButton?.addEventListener("click", () => {
    moveToIllustration(-1);
});

nextIllustrationButton?.addEventListener("click", () => {
    moveToIllustration(1);
});

illustrationShowcase?.addEventListener("wheel", (event) => {
    if (!illustrationImages.length) {
        return;
    }

    event.preventDefault();
    const nextZoom = illustrationZoom + (event.deltaY > 0 ? 0.12 : -0.12);
    updateIllustrationZoom(nextZoom, event.clientX, event.clientY);
}, { passive: false });

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        moveToIllustration(-1);
    }

    if (event.key === "ArrowRight") {
        moveToIllustration(1);
    }
});
