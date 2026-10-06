document.addEventListener("DOMContentLoaded", () => {
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
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

    requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", updatePointer, { passive: true });
  requestAnimationFrame(tick);
});
