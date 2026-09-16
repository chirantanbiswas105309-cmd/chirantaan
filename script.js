console.log("Chirantan Biswas Portfolio loaded.");

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

if (window.location.hash) {
    history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
}

window.scrollTo(0, 0);
window.addEventListener("load", () => window.scrollTo(0, 0));

const heroSlides = document.querySelectorAll(".hero-bg");
const leftArrow = document.querySelector(".hero-arrow--left");
const rightArrow = document.querySelector(".hero-arrow--right");
const hero = document.querySelector(".hero");
const workSection = document.querySelector(".work");
const qcoCard = document.querySelector(".work-card--qco");
const installationCard = document.querySelector(".work-card--installation");
const illustrationCard = document.querySelector(".work-card--illustration");
const contactForm = document.querySelector("#contact-form");

let currentHeroSlide = 0;
let autoSlideTimer;
let isHeroAnimating = false;

function showSlide(direction) {
    if (isHeroAnimating) {
        return;
    }

    const currentSlide = heroSlides[currentHeroSlide];
    const nextIndex = (currentHeroSlide + direction + heroSlides.length) % heroSlides.length;
    const nextSlide = heroSlides[nextIndex];

    isHeroAnimating = true;
    nextSlide.style.transition = "none";
    nextSlide.style.transform = direction === 1 ? "translateX(100%)" : "translateX(-100%)";
    nextSlide.style.opacity = "1";
    nextSlide.style.zIndex = "2";
    currentSlide.style.zIndex = "1";
    nextSlide.offsetWidth;
    nextSlide.style.transition = "";

    requestAnimationFrame(() => {
        currentSlide.style.transform = direction === 1 ? "translateX(-100%)" : "translateX(100%)";
        nextSlide.style.transform = "translateX(0)";
    });

    window.setTimeout(() => {
        currentSlide.classList.remove("active");
        currentSlide.style.opacity = "";
        currentSlide.style.transform = "";
        currentSlide.style.zIndex = "";
        nextSlide.classList.add("active");
        nextSlide.style.opacity = "";
        nextSlide.style.zIndex = "";
        currentHeroSlide = nextIndex;
        isHeroAnimating = false;
    }, 1200);
}

function restartAutoSlide() {
    window.clearInterval(autoSlideTimer);
    autoSlideTimer = window.setInterval(() => showSlide(1), 5000);
}

leftArrow?.addEventListener("click", () => {
    showSlide(-1);
    restartAutoSlide();
});

rightArrow?.addEventListener("click", () => {
    showSlide(1);
    restartAutoSlide();
});

restartAutoSlide();

const exploreLink = document.querySelector(".explore-button");
const workNavLinks = document.querySelectorAll('a[href="#work"]');
const homeNavLinks = document.querySelectorAll('a[href="#top"]');

function smoothScrollToTop(event) {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function smoothScrollToWork(event) {
    event.preventDefault();
    const target = document.querySelector("#work");

    if (!target) {
        return;
    }

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({
        top: targetY,
        behavior: "smooth"
    });
}

if (exploreLink) {
    exploreLink.addEventListener("click", smoothScrollToWork);
}

workNavLinks.forEach((link) => {
    link.addEventListener("click", smoothScrollToWork);
});

homeNavLinks.forEach((link) => {
    link.addEventListener("click", smoothScrollToTop);
});

function wrapLettersInHeading(element) {
    const fragment = document.createDocumentFragment();
    const children = Array.from(element.childNodes);

    children.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent;
            [...text].forEach((char, index) => {
                const span = document.createElement("span");
                span.className = "letter";
                span.style.setProperty("--i", index);
                span.textContent = char === " " ? "\u00A0" : char;
                fragment.appendChild(span);
            });
        } else if (child.nodeName === "BR") {
            fragment.appendChild(child.cloneNode());
        }
    });

    element.textContent = "";
    element.appendChild(fragment);
}

function setupLetterPopAnimations() {
    const headings = document.querySelectorAll(".hero h1, .work h2, .about h2, .contact h2");

    headings.forEach((heading) => {
        if (heading.querySelector(".letter")) {
            return;
        }

        wrapLettersInHeading(heading);
    });

    document.querySelectorAll(".letter").forEach((letter) => {
        letter.addEventListener("pointerenter", () => {
            letter.classList.remove("pop");
            void letter.offsetWidth;
            letter.classList.add("pop");
        });
    });
}

function updateScrollTransition() {
    if (!hero) {
        return;
    }

    const scrollProgress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
    const navBlur = (scrollProgress * 12).toFixed(2);
    const navbar = document.querySelector(".navbar");
    const workReveal = Math.max(0.7, Math.min(1, (scrollProgress - 0.18) / 0.55));

    if (navbar) {
        navbar.style.setProperty("--nav-blur", `${navBlur}px`);
        navbar.classList.toggle("is-visible", window.scrollY > 30);
    }

    hero.style.setProperty("--hero-bg-scale", (1 + scrollProgress * 0.12).toFixed(3));
    hero.style.setProperty("--hero-bg-blur", `${(scrollProgress * 24).toFixed(2)}px`);
    hero.style.setProperty("--hero-content-y", `${scrollProgress * -70}px`);
    hero.style.setProperty("--hero-content-scale", (1 + scrollProgress * 3.5).toFixed(3));
    hero.style.setProperty("--hero-content-opacity", (1 - scrollProgress).toFixed(3));
    hero.style.setProperty("--hero-content-blur", `${(scrollProgress * 3).toFixed(2)}px`);

    if (workSection) {
        workSection.style.setProperty("--work-opacity", workReveal.toFixed(3));
        workSection.style.setProperty("--work-scale", (0.94 + workReveal * 0.06).toFixed(3));
        workSection.style.setProperty("--work-translate", `${(140 - workReveal * 140).toFixed(2)}px`);
        workSection.style.setProperty("--work-blur", `${(1 - workReveal) * 10}px`);
    }
}

window.addEventListener("scroll", updateScrollTransition, { passive: true });
updateScrollTransition();
setupLetterPopAnimations();

if (workSection) {
    const workObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            workSection.classList.add("is-visible");
            observer.disconnect();
        }
    }, { threshold: 0.01, rootMargin: "0px 0px -10% 0px" });

    workObserver.observe(workSection);
}

if (qcoCard) {
    qcoCard.addEventListener("click", () => {
        window.location.href = "short-films.html";
    });
}

if (installationCard) {
    installationCard.addEventListener("click", () => {
        window.location.href = "installation.html";
    });
}

if (illustrationCard) {
    illustrationCard.addEventListener("click", () => {
        window.location.href = "illustration.html";
    });
}

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const subject = `Portfolio message from ${formData.get("name")}`;
    const body = [
        `Name: ${formData.get("name")}`,
        `Email: ${formData.get("email")}`,
        `Phone: ${formData.get("phone") || "Not provided"}`,
        "",
        formData.get("message")
    ].join("\n");

    window.location.href = `mailto:chirantanbiswas121@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
