const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const revealTargets = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll(".section-anchor");
const navLinks = document.querySelectorAll(".site-nav a");
const counters = document.querySelectorAll("[data-count]");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const backToTop = document.querySelector(".back-to-top");
const testimonials = document.querySelectorAll(".testimonial-card");
const prevButton = document.querySelector(".slider-button.prev");
const nextButton = document.querySelector(".slider-button.next");
let testimonialIndex = 0;

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progress) progress.style.width = `${scrollPercent}%`;
  if (header) header.classList.toggle("scrolled", scrollTop > 24);

  sections.forEach((section) => {
    const top = section.offsetTop - 150;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollTop >= top && scrollTop < bottom) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
};

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count || 0);
  const duration = 900;
  const start = performance.now();

  const tick = (time) => {
    const progressValue = Math.min((time - start) / duration, 1);
    counter.textContent = Math.round(progressValue * target);

    if (progressValue < 1) {
      requestAnimationFrame(tick);
    } else if (target === 100) {
      counter.textContent = "100%";
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
  counters.forEach(animateCounter);
}

const showTestimonial = (index) => {
  testimonials.forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === index);
  });
};

const moveTestimonial = (direction) => {
  testimonialIndex = (testimonialIndex + direction + testimonials.length) % testimonials.length;
  showTestimonial(testimonialIndex);
};

if (prevButton && nextButton && testimonials.length) {
  prevButton.addEventListener("click", () => moveTestimonial(-1));
  nextButton.addEventListener("click", () => moveTestimonial(1));
  window.setInterval(() => moveTestimonial(1), 5200);
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.className = `lightbox-image ${item.className.replace("gallery-item", "")}`;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
};

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

window.addEventListener(
  "scroll",
  () => {
    const parallax = document.querySelector(".hero-image");
    if (!parallax) return;
    parallax.style.transform = `translateY(${window.scrollY * 0.025}px)`;
  },
  { passive: true }
);
