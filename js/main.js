/* =====================================================================
   Harshvardhan Singh Sisodia — Portfolio interactivity
   Vanilla JS. No dependencies.
   ===================================================================== */
(() => {
  "use strict";

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------- Footer year ---------------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------------- Theme toggle ---------------- */
  (() => {
    const root = document.documentElement;
    const btn = $("#themeToggle");
    const saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
    btn?.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      window.dispatchEvent(new Event("themechange"));
    });
  })();

  /* ---------------- Nav: scrolled state + mobile menu ---------------- */
  (() => {
    const nav = $("#nav");
    const burger = $("#navBurger");
    const links = $("#navLinks");

    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    burger?.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    $$(".nav__link", links).forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  })();

  /* ---------------- Scroll progress bar ---------------- */
  (() => {
    const bar = $("#scrollProgress");
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  })();

  /* ---------------- Active nav link via section observer ---------------- */
  (() => {
    const links = new Map($$(".nav__link").map((a) => [a.getAttribute("href").slice(1), a]));
    const sections = ["about", "stack", "work", "projects", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            links.get(e.target.id)?.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
  })();

  /* ---------------- Reveal on scroll (with stagger) ---------------- */
  (() => {
    const items = $$(".reveal");
    if (reduceMotion) { items.forEach((i) => i.classList.add("is-in")); return; }

    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          // stagger relative to siblings sharing the same parent
          const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
          const idx = Math.max(0, sibs.indexOf(el));
          el.style.transitionDelay = Math.min(idx * 70, 420) + "ms";
          el.classList.add("is-in");
          o.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    items.forEach((i) => obs.observe(i));
  })();

  /* ---------------- Count-up stats ---------------- */
  (() => {
    const nums = $$(".stat__num");
    const run = (el) => {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const dur = 1700;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const val = target * ease(p);
        el.textContent = val.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
    };

    if (reduceMotion) {
      nums.forEach((el) => {
        el.textContent = parseFloat(el.dataset.target).toFixed(parseInt(el.dataset.decimals || "0", 10)) + (el.dataset.suffix || "");
      });
      return;
    }
    const obs = new IntersectionObserver(
      (entries, o) => entries.forEach((e) => { if (e.isIntersecting) { run(e.target); o.unobserve(e.target); } }),
      { threshold: 0.5 }
    );
    nums.forEach((n) => obs.observe(n));
  })();

  /* ---------------- Typed role text ---------------- */
  (() => {
    const el = $("#typed");
    if (!el) return;
    const phrases = [
      "Backend Software Engineer",
      "Distributed Systems Builder",
      "Low-Latency API Craftsman",
      "Performance & Reliability Nerd",
    ];
    if (reduceMotion) { el.textContent = phrases[0]; return; }

    let p = 0, c = 0, deleting = false;
    const tick = () => {
      const word = phrases[p];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      let delay = deleting ? 38 : 78;
      if (!deleting && c === word.length) { delay = 1500; deleting = true; }
      else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 360; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 700);
  })();

  /* ---------------- Contact terminal line ---------------- */
  (() => {
    const el = $("#contactCmd");
    if (!el) return;
    const cmd = 'curl -X POST /hire --data "role=backend|platform"';
    if (reduceMotion) { el.textContent = cmd; return; }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        o.disconnect();
        let i = 0;
        const type = () => { el.textContent = cmd.slice(0, i++); if (i <= cmd.length) setTimeout(type, 42); };
        type();
      });
    }, { threshold: 0.4 });
    obs.observe($("#contactTerminal"));
  })();

  /* ---------------- Cursor glow + magnetic + tilt + card glow ---------------- */
  if (!isTouch && !reduceMotion) {
    const glow = $("#cursorGlow");
    let gx = innerWidth / 2, gy = innerHeight / 2, cx = gx, cy = gy, shown = false;

    window.addEventListener("mousemove", (e) => {
      gx = e.clientX; gy = e.clientY;
      if (!shown) { glow.style.opacity = "1"; shown = true; }
    });
    window.addEventListener("mouseout", (e) => { if (!e.relatedTarget) { glow.style.opacity = "0"; shown = false; } });
    (function loop() {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    // magnetic buttons
    $$(".magnetic").forEach((el) => {
      const strength = 0.32;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    // tilt cards
    $$(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * 4}deg) rotateY(${px * 5}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    // project card radial glow follows cursor
    $$(".proj-card").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* ---------------- Live request-trace widget ---------------- */
  (() => {
    const flow = $("#traceFlow");
    const latEl = $("#traceLat");
    const logEl = $("#traceLog");
    if (!flow) return;

    const nodes = $$(".node", flow);          // client, api, cache, db
    const hops = $$(".hop", flow);            // 3 hops
    const routes = [
      "GET /v1/wallet/balance",
      "POST /v1/wallet/refund",
      "GET /v1/deposits/imps",
      "POST /v1/llm/complete",
      "GET /v1/search?q=invoice",
    ];
    const logs = [];
    const pushLog = (html) => {
      logs.push(html);
      while (logs.length > 3) logs.shift();
      logEl.innerHTML = logs.join("<br>");
    };

    const lightOn = (i) => nodes[i]?.classList.add("active");
    const lightOff = (i) => nodes[i]?.classList.remove("active");
    const fireHop = async (i) => {
      const h = hops[i];
      h.classList.remove("fire"); void h.offsetWidth; h.classList.add("fire");
      await sleep(420);
    };
    const clearAll = () => nodes.forEach((n) => n.classList.remove("active"));

    if (reduceMotion) {
      latEl.textContent = "62 ms";
      pushLog('<span class="req">GET /v1/wallet/balance</span> → <b>200 · redis HIT · 41ms</b>');
      return;
    }

    async function runOnce() {
      clearAll();
      const route = routes[Math.floor(Math.random() * routes.length)];
      const hit = Math.random() > 0.32;            // redis hit ~68%
      pushLog(`<span class="req">${route}</span> …`);
      latEl.textContent = "··· ms";
      latEl.style.color = "var(--warn)";

      lightOn(0); await sleep(220);                 // client
      await fireHop(0); lightOn(1); await sleep(160); // api

      let lat;
      if (hit) {
        await fireHop(1); lightOn(2); await sleep(240); // redis
        lat = 28 + Math.floor(Math.random() * 64);      // 28–92ms
        lightOff(2);
      } else {
        await fireHop(1); lightOn(2); await sleep(180);
        lightOff(2);
        await fireHop(2); lightOn(3); await sleep(320); // db
        lat = 120 + Math.floor(Math.random() * 150);    // 120–270ms
        lightOff(3);
      }
      // response travels back
      lightOff(1); await sleep(120); lightOff(0);

      latEl.textContent = lat + " ms";
      latEl.style.color = lat < 100 ? "var(--ok)" : "var(--warn)";
      const tail = hit ? `<b>200 · redis HIT · ${lat}ms</b>` : `200 · db read · <span style="color:var(--warn)">${lat}ms</span>`;
      pushLog(`<span class="req">${route}</span> → ${tail}`);
      await sleep(1400);
    }

    let running = false;
    const loop = async () => { while (running) await runOnce(); };

    // only animate while the widget is on screen (saves cycles)
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !running) { running = true; loop(); }
        else if (!e.isIntersecting) { running = false; }
      });
    }, { threshold: 0.25 });
    obs.observe(flow);
  })();

  /* ---------------- Node-network background canvas ---------------- */
  (() => {
    const canvas = $("#net");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");

    let w, h, dpr, nodes = [], raf;
    let nodeColor = "180,210,255", lineColor = "120,150,220";
    const mouse = { x: -9999, y: -9999 };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      nodeColor = cs.getPropertyValue("--net-node").trim() || nodeColor;
      lineColor = cs.getPropertyValue("--net-line").trim() || lineColor;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(96, (w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const LINK = 132;          // link distance
    const MOUSE_R = 190;       // mouse influence radius

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // gentle mouse repulsion
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_R) {
          const f = (MOUSE_R - d) / MOUSE_R * 0.6;
          n.x += (dx / d) * f; n.y += (dy / d) * f;
        }
      }

      // links between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const o = (1 - dist / LINK) * 0.5;
            ctx.strokeStyle = `rgba(${lineColor},${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // links to mouse + node dots
      for (const n of nodes) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dm = Math.hypot(dx, dy);
        let near = dm < MOUSE_R;
        if (near) {
          const o = (1 - dm / MOUSE_R) * 0.65;
          ctx.strokeStyle = `rgba(${nodeColor},${o})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${nodeColor},${near ? 0.95 : 0.55})`;
        ctx.arc(n.x, n.y, near ? n.r * 1.7 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseout", () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener("resize", resize);
    window.addEventListener("themechange", readColors);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });

    readColors();
    resize();
    draw();
  })();

  console.log("%c⚡ built from scratch — distributed by design", "color:#22d3ee;font-family:monospace;font-size:13px");
})();
