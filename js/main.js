(() => {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const navBackdrop = document.querySelector(".nav-backdrop");

  // Mobile nav
  const setNav = (open) => {
    body.classList.toggle("nav-open", open);
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.textContent = open ? "Close" : "Menu";
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      setNav(!body.classList.contains("nav-open"));
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", () => setNav(false));
  }

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Hero + inline videos: play when in view, pause when out
  const videos = document.querySelectorAll("video[data-autoplay-on-view]");
  if ("IntersectionObserver" in window && videos.length) {
    const vio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            v.muted = true;
            const p = v.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: [0, 0.35, 0.7] }
    );
    videos.forEach((v) => vio.observe(v));
  }

  // Slideshows
  document.querySelectorAll("[data-slideshow]").forEach((root) => {
    const slides = Array.from(root.querySelectorAll("img"));
    const caption = root.querySelector("[data-slideshow-caption]");
    const dotsWrap = root.querySelector("[data-slideshow-dots]");
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;

    const paint = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((img, i) => img.classList.toggle("is-active", i === index));
      if (caption) {
        caption.textContent = slides[index].getAttribute("data-caption") || "";
      }
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((dot, i) => {
          dot.classList.toggle("is-active", i === index);
        });
      }
    };

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", `Show photo ${i + 1}`);
        if (i === 0) btn.classList.add("is-active");
        btn.addEventListener("click", () => {
          paint(i);
          restart();
        });
        dotsWrap.appendChild(btn);
      });
    }

    const restart = () => {
      if (timer) window.clearInterval(timer);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        timer = window.setInterval(() => paint(index + 1), 4500);
      }
    };

    paint(0);
    restart();

    root.addEventListener("mouseenter", () => {
      if (timer) window.clearInterval(timer);
    });
    root.addEventListener("mouseleave", restart);
    root.addEventListener("focusin", () => {
      if (timer) window.clearInterval(timer);
    });
    root.addEventListener("focusout", restart);
  });

  // Join form local ack
  const joinForm = document.querySelector("#joinForm");
  const formOk = document.querySelector("#formOk");
  if (joinForm) {
    joinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!joinForm.checkValidity()) {
        joinForm.reportValidity();
        return;
      }
      if (formOk) formOk.hidden = false;
      joinForm.reset();
    });
  }
})();
