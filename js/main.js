let setLightsActive = () => {};

document.addEventListener("DOMContentLoaded", () => {
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  initLights(motionOk);
  initScroll(motionOk);
  initReserve();
  initNavToggle();
  initTeamMore();
});

function initTeamMore() {
  const members = [...document.querySelectorAll(".team-member")];

  if (members.length === 0) {
    return;
  }

  const updateToggle = (member) => {
    const toggle = member.querySelector(".team-member__more");
    const text = member.querySelector(".team-member__text");

    if (!toggle || !text) {
      return;
    }

    if (member.classList.contains("is-open")) {
      toggle.hidden = false;
      return;
    }

    toggle.hidden = text.scrollHeight <= text.clientHeight + 1;
  };

  members.forEach((member) => {
    const toggle = member.querySelector(".team-member__more");
    const text = member.querySelector(".team-member__text");

    if (!toggle || !text) {
      return;
    }

    const setOpen = (open) => {
      member.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "weniger" : "mehr lesen";
      updateToggle(member);
    };

    toggle.addEventListener("click", () => {
      setOpen(!member.classList.contains("is-open"));
    });
  });

  const refresh = () => members.forEach(updateToggle);
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);
  if (document.fonts?.ready) {
    document.fonts.ready.then(refresh);
  }
  refresh();
}

function initNavToggle() {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");

  if (!nav || !toggle) {
    return;
  }

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
}

function initReserve() {
  const reserve = document.querySelector(".reserve");
  const toggle = document.querySelector(".reserve__toggle");

  if (!reserve || !toggle) {
    return;
  }

  const setOpen = (open) => {
    reserve.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!reserve.classList.contains("is-open"));
  });

  document.addEventListener("click", (event) => {
    if (!reserve.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
}

function initLights(motionOk) {
  const orbs = [...document.querySelectorAll(".orb")];

  if (!motionOk || orbs.length === 0) {
    return;
  }

  const lights = [
    {
      el: orbs[0],
      ax: [0.46, 0.28, 0.18],
      ay: [0.22, 0.38, 0.24],
      fx: [0.028, 0.017, 0.041],
      fy: [0.021, 0.033, 0.013],
      phase: [0.4, 1.7, 3.1, 0.9, 2.4, 4.2],
      spin: 0.018,
      morph: 0.022,
    },
    {
      el: orbs[1],
      ax: [0.22, 0.4, 0.26],
      ay: [0.44, 0.18, 0.26],
      fx: [0.019, 0.036, 0.012],
      fy: [0.027, 0.015, 0.039],
      phase: [2.2, 0.3, 4.8, 1.5, 3.6, 0.7],
      spin: -0.014,
      morph: 0.016,
    },
    {
      el: orbs[2],
      ax: [0.38, 0.2, 0.32],
      ay: [0.16, 0.34, 0.36],
      fx: [0.014, 0.025, 0.037],
      fy: [0.031, 0.011, 0.023],
      phase: [3.8, 5.1, 1.2, 4.4, 0.2, 2.9],
      spin: 0.011,
      morph: 0.019,
    },
  ].filter((light) => light.el);

  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  const startedAt = performance.now();

  const updatePointer = (event) => {
    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    pointerTargetX = (event.clientX / width - 0.5) * 2;
    pointerTargetY = (event.clientY / height - 0.5) * 2;
  };

  const wander = (time, freqs, amps, phases) =>
    Math.sin(time * freqs[0] + phases[0]) * amps[0] +
    Math.sin(time * freqs[1] + phases[1]) * amps[1] +
    Math.sin(time * freqs[2] + phases[2]) * amps[2];

  const tick = (now) => {
    const time = ((now - startedAt) / 1000) * 6.5;
    const width = window.innerWidth;
    const height = window.innerHeight;

    pointerX += (pointerTargetX - pointerX) * 0.04;
    pointerY += (pointerTargetY - pointerY) * 0.04;

    lights.forEach((light) => {
      const x = wander(time, light.fx, light.ax, light.phase) + pointerX * 0.04;
      const y = wander(time, light.fy, light.ay, light.phase.slice(3)) + pointerY * 0.03;
      const rotate =
        Math.sin(time * light.spin + light.phase[0]) * 16 +
        Math.cos(time * light.spin * 0.7 + light.phase[1]) * 10;
      const scaleX = 1 + Math.sin(time * light.morph + light.phase[2]) * 0.1;
      const scaleY = 1 + Math.cos(time * light.morph * 0.8 + light.phase[4]) * 0.12;

      light.el.style.transform = `translate(-50%, -50%) translate(${x * width * 0.5}px, ${y * height * 0.5}px) rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`;
    });
  };

  window.addEventListener("pointermove", updatePointer, { passive: true });

  let scrollLights = true;
  let lightsRaf = 0;
  const lightsRunning = () => scrollLights && !document.hidden;

  const run = (now) => {
    if (!lightsRunning()) {
      lightsRaf = 0;
      return;
    }
    tick(now);
    lightsRaf = requestAnimationFrame(run);
  };

  const syncLights = () => {
    const active = lightsRunning();
    orbs.forEach((orb) => {
      orb.style.visibility = active ? "visible" : "hidden";
    });
    if (active && !lightsRaf) {
      lightsRaf = requestAnimationFrame(run);
    }
  };

  setLightsActive = (active) => {
    scrollLights = active;
    syncLights();
  };

  document.addEventListener("visibilitychange", syncLights);

  lightsRaf = requestAnimationFrame(run);
}

function initScroll(motionOk) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
  }
  gsap.ticker.lagSmoothing(0);

  const intro = document.querySelector(".intro");
  const home = document.querySelector(".panel--home");
  const philosophie = document.querySelector("#philosophie");
  const menue = document.querySelector("#menue");
  const ingredients = document.querySelector(".philosophie-bg");
  const menueBg = document.querySelector(".menue-bg");
  const navLinks = [...document.querySelectorAll(".site-nav a")];

  let currentSection = "home";
  const setCurrent = (id) => {
    if (currentSection === id) {
      return;
    }
    currentSection = id;
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${id}`;
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const setTriangleReveal = (progress) => {
    if (!ingredients) {
      return;
    }
    const t = Math.max(0, Math.min(1, progress));
    ingredients.style.transform = `scale(${t})`;
  };

  let ingredientsIn = 0;
  let ingredientsOut = 0;
  const applyIngredients = () => {
    setTriangleReveal(ingredientsIn * (1 - ingredientsOut));
  };

  const setMenueTriangle = (progress) => {
    if (!menueBg) {
      return;
    }
    const t = Math.max(0, Math.min(1, progress));
    menueBg.style.transform = `scale(${t})`;
  };

  let menueIn = 0;
  let menueOut = 0;
  const applyMenue = () => {
    setMenueTriangle(menueIn * (1 - menueOut));
  };

  if (motionOk && intro && home && philosophie) {
    const philosophiePage = philosophie.querySelector(".page");
    gsap.set(philosophie, { y: "100vh" });
    if (philosophiePage) {
      gsap.set(philosophiePage, { autoAlpha: 0 });
    }

    const introFade = gsap.timeline({
      scrollTrigger: {
        id: "intro-fade",
        trigger: intro,
        start: "top top",
        end: "+=120%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub: 0.45,
        onUpdate: (self) => {
          const pastHome = self.progress > 0.32;
          const homeEvents = pastHome ? "none" : "auto";
          const philoEvents = pastHome ? "auto" : "none";
          if (home.style.pointerEvents !== homeEvents) {
            home.style.pointerEvents = homeEvents;
          }
          if (philosophie.style.pointerEvents !== philoEvents) {
            philosophie.style.pointerEvents = philoEvents;
          }
          setCurrent(self.progress < 0.35 ? "home" : "philosophie");
          setLightsActive(self.progress < 0.55);
          ingredientsIn = self.progress;
          applyIngredients();
        },
      },
    });

    introFade
      .to(home, { autoAlpha: 0, ease: "power2.in", duration: 0.55 }, 0)
      .to(".orb", { autoAlpha: 0, ease: "power2.in", duration: 0.55 }, 0)
      .to(philosophie, { y: 0, ease: "none", duration: 1 }, 0)
      .to(philosophiePage, { autoAlpha: 1, ease: "none", duration: 1 }, 0);

    if (ingredients) {
      ScrollTrigger.create({
        trigger: "#menue",
        start: "top 85%",
        end: "top 35%",
        scrub: 0.45,
        onUpdate: (self) => {
          ingredientsOut = self.progress;
          applyIngredients();
        },
      });
    }

    const menuePage = menue?.querySelector(".page");
    if (menue && menuePage) {
      gsap.set(menuePage, { y: "100vh", autoAlpha: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            id: "menue-fade",
            trigger: menue,
            start: "top top",
            end: "+=120%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            scrub: 0.45,
            onUpdate: (self) => {
              menueIn = self.progress;
              applyMenue();
            },
          },
        })
        .to(menuePage, { y: 0, ease: "none", duration: 1 }, 0)
        .to(menuePage, { autoAlpha: 1, ease: "none", duration: 1 }, 0);

      ScrollTrigger.create({
        trigger: "#experience",
        start: "top 85%",
        end: "top 35%",
        scrub: 0.45,
        onUpdate: (self) => {
          menueOut = self.progress;
          applyMenue();
        },
      });
    }

    const refreshLayout = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshLayout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshLayout);
    }
  } else {
    if (ingredients && philosophie) {
      ScrollTrigger.create({
        trigger: philosophie,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => setTriangleReveal(1),
        onLeave: () => setTriangleReveal(0),
        onEnterBack: () => setTriangleReveal(1),
        onLeaveBack: () => setTriangleReveal(0),
      });
    }

    if (menueBg && menue) {
      ScrollTrigger.create({
        trigger: menue,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => setMenueTriangle(1),
        onLeave: () => setMenueTriangle(0),
        onEnterBack: () => setMenueTriangle(1),
        onLeaveBack: () => setMenueTriangle(0),
      });
    }
  }

  document.querySelectorAll(".pages .panel--page").forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top 55%",
      end: "bottom 55%",
      onEnter: () => setCurrent(panel.id),
      onEnterBack: () => setCurrent(panel.id),
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) {
        return;
      }

      event.preventDefault();
      const id = href.slice(1);

      if (id === "home") {
        gsap.to(window, { duration: 1.05, scrollTo: 0, ease: "power2.inOut" });
        return;
      }

      if (id === "philosophie") {
        const introFade = ScrollTrigger.getById("intro-fade");
        const y = introFade ? introFade.end : philosophie?.offsetTop || 0;
        gsap.to(window, { duration: 1.2, scrollTo: y, ease: "power2.inOut" });
        return;
      }

      if (id === "menue") {
        const menueFade = ScrollTrigger.getById("menue-fade");
        const y = menueFade ? menueFade.end : menue?.offsetTop || 0;
        gsap.to(window, { duration: 1.2, scrollTo: y, ease: "power2.inOut" });
        return;
      }

      const target = document.getElementById(id);
      if (!target) {
        return;
      }

      gsap.to(window, {
        duration: 1.15,
        scrollTo: { y: target, offsetY: 0 },
        ease: "power2.inOut",
      });
    });
  });
}
