const typingElement = document.getElementById("typing");
const themeButton = document.getElementById("themeBtn");
const revealElements = document.querySelectorAll(".reveal");
const counterElements = document.querySelectorAll("[data-count]");
const tiltCards = document.querySelectorAll(".tilt-card");
const filterChips = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const starfield = document.getElementById("starfield");

const typingWords = [
  "Building modern web experiences",
  "Shipping premium software interfaces",
  "Crafting reliable frontend systems",
  "Turning ideas into launch-ready products"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeHeadline() {
  if (!typingElement) {
    return;
  }

  const currentWord = typingWords[wordIndex];
  typingElement.textContent = currentWord.slice(0, charIndex);

  if (!isDeleting) {
    charIndex += 1;
    if (charIndex > currentWord.length) {
      isDeleting = true;
      window.setTimeout(typeHeadline, 1200);
      return;
    }
  } else {
    charIndex -= 1;
    if (charIndex < 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      charIndex = 0;
    }
  }

  const speed = isDeleting ? 45 : 80;
  window.setTimeout(typeHeadline, speed);
}

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  window.localStorage.setItem("portfolio-theme", theme);
}

const savedTheme = window.localStorage.getItem("portfolio-theme");
if (savedTheme) {
  applyTheme(savedTheme);
}

themeButton?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(nextTheme);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealElements.forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const element = entry.target;
    const target = Number(element.dataset.count || 0);
    const duration = 1400;
    const start = performance.now();

    function animateCounter(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.round(progress * target);
      element.textContent = `${value}+`;

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    }

    requestAnimationFrame(animateCounter);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.5 });

counterElements.forEach((counter) => counterObserver.observe(counter));

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 12;

    card.classList.add("is-tilting");
    card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.classList.remove("is-tilting");
    card.style.transform = "";
  });
});

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;

    filterChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

contactForm?.addEventListener("submit", (event) => {
  if (window.location.protocol !== "file:" && window.location.hostname !== "127.0.0.1" && window.location.hostname !== "localhost") {
    return;
  }

  event.preventDefault();

  if (!contactForm.reportValidity()) {
    formNote.textContent = "Please fill in every required field before sending.";
    formNote.className = "form-note error";
    return;
  }

  formNote.textContent = "Local preview mode: validation passed and the inquiry is ready for Netlify or another form backend.";
  formNote.className = "form-note success";
  contactForm.reset();
});

function setupStarfield() {
  if (!starfield) {
    return;
  }

  const context = starfield.getContext("2d");
  if (!context) {
    return;
  }

  const stars = [];
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    starfield.width = window.innerWidth;
    starfield.height = window.innerHeight;
    stars.length = 0;

    const density = Math.max(70, Math.floor(window.innerWidth * 0.08));
    for (let index = 0; index < density; index += 1) {
      stars.push({
        x: Math.random() * starfield.width,
        y: Math.random() * starfield.height,
        size: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.16 + 0.03,
        alpha: Math.random() * 0.65 + 0.2
      });
    }
  }

  function render() {
    context.clearRect(0, 0, starfield.width, starfield.height);

    stars.forEach((star) => {
      context.beginPath();
      context.fillStyle = `rgba(175, 214, 255, ${star.alpha})`;
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();

      if (!isReducedMotion) {
        star.y += star.speed;
        if (star.y > starfield.height) {
          star.y = -4;
          star.x = Math.random() * starfield.width;
        }
      }
    });

    requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener("resize", resize);
}

typeHeadline();
setupStarfield();
