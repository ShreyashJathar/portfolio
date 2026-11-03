// Mobile Navigation Toggle
const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Dynamic Copyright Year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// User preferences
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// Navbar Dynamic Elevation on Scroll
const navWrap = document.querySelector(".nav-wrap");
const handleNavScroll = () => {
  if (!navWrap) return;
  if (window.scrollY > 40) {
    navWrap.classList.add("scrolled");
  } else {
    navWrap.classList.remove("scrolled");
  }
};
window.addEventListener("scroll", handleNavScroll, { passive: true });
handleNavScroll();

// Dynamic Hero Role Typewriter
const roleText = document.getElementById("role-text");
if (roleText && !reduceMotion) {
  const roles = [
    "COMPUTER SCIENCE STUDENT · DEVELOPER",
    "FULL-STACK DEVELOPER IN TRAINING",
    "PYTHON & FLASK ENTHUSIAST",
    "BUILDING USEFUL WEB APPS",
    "PROBLEM SOLVER & LEARNER"
  ];
  let roleIdx = 0;
  let charIdx = roles[0].length;
  let isDeleting = true;
  let typingSpeed = 70;

  const runTypewriter = () => {
    const currentRole = roles[roleIdx];
    if (isDeleting) {
      charIdx--;
      roleText.textContent = currentRole.substring(0, charIdx);
      typingSpeed = 30;
    } else {
      charIdx++;
      roleText.textContent = currentRole.substring(0, charIdx);
      typingSpeed = 70;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2400; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(runTypewriter, typingSpeed);
  };
  // Start cycling after an initial delay
  setTimeout(runTypewriter, 2600);
}

// Hero Visual 3D Physics Tilt
const heroVisual = document.querySelector(".hero-visual");
const profileCard = document.querySelector(".profile-card");
if (heroVisual && profileCard && !reduceMotion && finePointer) {
  let tiltFrame = 0;
  let pointerPos = null;

  heroVisual.addEventListener("pointermove", (e) => {
    pointerPos = { x: e.clientX, y: e.clientY };
    if (tiltFrame) return;
    tiltFrame = requestAnimationFrame(() => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (pointerPos.x - rect.left) / rect.width - 0.5;
      const y = (pointerPos.y - rect.top) / rect.height - 0.5;
      profileCard.style.transform = `translate3d(${x * 12}px, ${y * 12}px, 0) rotateX(${-y * 5}deg) rotateY(${x * 6}deg)`;
      tiltFrame = 0;
    });
  });

  heroVisual.addEventListener("pointerleave", () => {
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    profileCard.style.transform = "";
  });
}

// Scroll Progress Indicator with Smooth Gradient Fill
const progressBar = document.getElementById("scroll-progress");
const updateProgress = () => {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Staggered Scroll Reveal with IntersectionObserver
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Interactive Spotlight Hover & Smooth 3D Card Tilt
const hero = document.querySelector(".hero");
const glow = document.querySelector(".cursor-glow");

if (!reduceMotion && finePointer) {
  if (hero && glow) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - r.left}px`;
      glow.style.top = `${e.clientY - r.top}px`;
    });
  }

  // Spotlight Coordinates and 3D Tilt for cards
  const interactiveCards = document.querySelectorAll(".skill-card, .project-card, .contact-panel");
  interactiveCards.forEach((card) => {
    let frame = 0;
    let point = null;

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for spotlight radial glow
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      point = { x: e.clientX, y: e.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const normX = (point.x - rect.left) / rect.width - 0.5;
        const normY = (point.y - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${-normY * 3}deg) rotateY(${normX * 4}deg) translateY(-4px)`;
        frame = 0;
      });
    });

    card.addEventListener("pointerleave", () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      card.style.transform = "";
    });
  });

  // Modern Smooth Custom Cursor Follower
  const cursorDot = document.createElement("div");
  cursorDot.className = "custom-cursor-dot";
  const cursorRing = document.createElement("div");
  cursorRing.className = "custom-cursor-ring";
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let isHovered = false;

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${isHovered ? 1.6 : 1})`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  document.addEventListener("pointerleave", () => {
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
  });
  document.addEventListener("pointerenter", () => {
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
  });

  // Scale ring when hovering over interactive items
  const hoverSelectors = "a, button, .button, .skill-card, .project-card, .stat, .timeline-item, .menu-toggle, .floating-chip";
  document.querySelectorAll(hoverSelectors).forEach((el) => {
    el.addEventListener("pointerenter", () => {
      isHovered = true;
      cursorRing.classList.add("cursor-hover");
    });
    el.addEventListener("pointerleave", () => {
      isHovered = false;
      cursorRing.classList.remove("cursor-hover");
    });
  });
}
