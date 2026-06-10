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
      const apply = () => {
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        window.dispatchEvent(new Event("themechange"));
      };
      // circular reveal from the toggle (View Transitions API, progressive)
      if (!document.startViewTransition || reduceMotion) { apply(); return; }
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(apply).ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: "cubic-bezier(.22,.61,.36,1)", pseudoElement: "::view-transition-new(root)" }
        );
      }).catch(() => {});
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
    const cmd = 'curl -X POST /hire --data "role=SDE-2"';
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

    // radial glow follows cursor (project + skill cards)
    $$(".proj-card, .skill-card").forEach((el) => {
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

  /* ---------------- Accent themer ---------------- */
  const ACCENTS = [
    { id: "cyan",    label: "Cyan",    color: "#22d3ee" },
    { id: "violet",  label: "Violet",  color: "#a855f7" },
    { id: "emerald", label: "Emerald", color: "#34d399" },
    { id: "amber",   label: "Amber",   color: "#fbbf24" },
    { id: "rose",    label: "Rose",    color: "#fb7185" },
  ];
  function applyAccent(id) {
    if (id === "cyan") document.documentElement.removeAttribute("data-accent");
    else document.documentElement.setAttribute("data-accent", id);
    try { localStorage.setItem("accent", id); } catch (e) {}
    window.dispatchEvent(new Event("themechange"));
  }
  applyAccent(localStorage.getItem("accent") || "cyan");

  /* ---------------- Toast ---------------- */
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 1900);
  }

  /* ---------------- Command palette (⌘K / Ctrl K) ---------------- */
  (() => {
    const cmdk = $("#cmdk");
    if (!cmdk) return;
    const input = $("#cmdkInput");
    const listEl = $("#cmdkList");
    const trigger = $("#cmdkTrigger");
    const isMac = /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);
    const keyEl = $("#cmdkKey");
    if (keyEl && !isMac) keyEl.textContent = "Ctrl";

    const nav = (sel) => () => { const el = $(sel); if (el) el.scrollIntoView({ behavior: "smooth" }); };
    const ext = (url) => () => window.open(url, "_blank", "noopener");
    const mail = () => { window.location.href = "mailto:hvsisodia02@gmail.com"; };
    const copyEmail = () => {
      const addr = "hvsisodia02@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(() => toast("Email copied  ✓"), mail);
      } else { mail(); }
    };

    const commands = [
      { group: "Navigate", glyph: "#", label: "Home",       run: nav("#top") },
      { group: "Navigate", glyph: "#", label: "About",      run: nav("#about") },
      { group: "Navigate", glyph: "#", label: "Stack",      run: nav("#stack") },
      { group: "Navigate", glyph: "#", label: "Experience", run: nav("#work") },
      { group: "Navigate", glyph: "#", label: "Projects",   run: nav("#projects") },
      { group: "Navigate", glyph: "#", label: "Contact",    run: nav("#contact") },
      { group: "Actions", glyph: "@", label: "Copy email",          meta: "hvsisodia02@gmail.com", run: copyEmail },
      { group: "Actions", glyph: "◐", label: "Toggle light / dark", run: () => $("#themeToggle").click() },
      { group: "Links", glyph: "↗", label: "GitHub",       meta: "@WildxHV",        run: ext("https://github.com/WildxHV") },
      { group: "Links", glyph: "↗", label: "LinkedIn",     run: ext("https://www.linkedin.com/in/harshvardhansinghsisodia/") },
      { group: "Links", glyph: "↗", label: "CookFit repo", meta: "WildxHV/cookfit", run: ext("https://github.com/WildxHV/cookfit") },
      { group: "Links", glyph: "✉", label: "Email me",     run: mail },
      ...ACCENTS.map((a) => ({ group: "Accent color", swatch: a.color, label: a.label, run: () => { applyAccent(a.id); toast(a.label + " accent applied"); } })),
    ];

    let filtered = [], active = 0;
    const itemsDom = () => $$(".cmdk__item", listEl);

    function highlight() {
      const els = itemsDom();
      els.forEach((el, i) => el.classList.toggle("active", i === active));
      els[active] && els[active].scrollIntoView({ block: "nearest" });
    }
    function render(q) {
      const f = (q || "").trim().toLowerCase();
      filtered = commands.filter((c) => !f || (c.label + " " + (c.meta || "") + " " + c.group).toLowerCase().includes(f));
      listEl.innerHTML = "";
      if (!filtered.length) { listEl.innerHTML = '<div class="cmdk__empty">No matches</div>'; return; }
      let lastG = null;
      filtered.forEach((c) => {
        if (c.group !== lastG) {
          const g = document.createElement("div");
          g.className = "cmdk__group"; g.textContent = c.group;
          listEl.appendChild(g); lastG = c.group;
        }
        const it = document.createElement("div");
        it.className = "cmdk__item"; it.setAttribute("role", "option");
        const ico = c.swatch
          ? `<span class="ico"><span class="swatch" style="background:${c.swatch}"></span></span>`
          : `<span class="ico">${c.glyph || "›"}</span>`;
        it.innerHTML = `${ico}<span class="lbl">${c.label}</span>${c.meta ? `<span class="meta">${c.meta}</span>` : ""}`;
        it.addEventListener("click", () => run(c));
        const idx = filtered.indexOf(c);
        it.addEventListener("mousemove", () => { active = idx; highlight(); });
        listEl.appendChild(it);
      });
      active = 0; highlight();
    }
    function open() { cmdk.hidden = false; document.body.style.overflow = "hidden"; input.value = ""; render(""); setTimeout(() => input.focus(), 20); }
    function close() { cmdk.hidden = true; document.body.style.overflow = ""; if (trigger) trigger.focus(); }
    function run(c) { if (!c) return; close(); setTimeout(() => c.run(), 10); }

    if (trigger) trigger.addEventListener("click", open);
    const closer = cmdk.querySelector("[data-cmdk-close]");
    if (closer) closer.addEventListener("click", close);
    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (e) => {
      if (!filtered.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % filtered.length; highlight(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + filtered.length) % filtered.length; highlight(); }
      else if (e.key === "Enter") { e.preventDefault(); run(filtered[active]); }
    });
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmdk.hidden ? open() : close(); }
      else if (e.key === "Escape" && !cmdk.hidden) { close(); }
    });
  })();

  /* ---------------- Scroll-spy dots + back-to-top ---------------- */
  (() => {
    const dotItems = $$(".dots__item");
    const secIds = ["hero", "about", "stack", "work", "projects", "contact"];
    const pairs = secIds.map((id, i) => [document.getElementById(id), dotItems[i]]).filter(([s, d]) => s && d);
    if (pairs.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          dotItems.forEach((d) => d.classList.remove("active"));
          const p = pairs.find(([s]) => s === e.target);
          if (p) p[1].classList.add("active");
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      pairs.forEach(([s]) => obs.observe(s));
    }

    const toTop = $("#toTop");
    if (toTop) {
      const onScroll = () => toTop.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  })();

  /* ---------------- Hero letter cascade ---------------- */
  (() => {
    const h = $(".hero__name");
    if (!h || reduceMotion) return;
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let gi = 0;
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      for (const ch of node.textContent) {
        if (/\s/.test(ch)) { frag.appendChild(document.createTextNode(ch)); continue; }
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        s.style.setProperty("--d", (0.08 + gi * 0.034).toFixed(3) + "s");
        gi++;
        frag.appendChild(s);
      }
      node.parentNode.replaceChild(frag, node);
    });
    // slice the gradient across the second line so it reads as one sweep
    const g = $(".grad-text", h);
    if (g) {
      const chs = $$(".ch", g), n = chs.length;
      chs.forEach((c, i) => {
        c.style.setProperty("--gs", n * 100 + "%");
        c.style.setProperty("--gp", (n > 1 ? (i / (n - 1)) * 100 : 0).toFixed(2) + "%");
      });
    }
    h.classList.add("split");
  })();

  /* ---------------- Section-title decode effect ---------------- */
  (() => {
    if (reduceMotion) return;
    const CHARS = "!<>-_/[]{}=+*^?#$%&";
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        o.unobserve(e.target);
        const el = e.target, orig = el.textContent;
        el.setAttribute("aria-label", orig);
        const totalFrames = Math.max(orig.length * 3, 24);
        let frame = 0;
        const tick = () => {
          frame++;
          const solved = Math.floor((frame / totalFrames) * orig.length);
          el.textContent =
            orig.slice(0, solved) +
            orig.slice(solved).split("").map((c) => (c === " " ? " " : CHARS[(Math.random() * CHARS.length) | 0])).join("");
          if (solved < orig.length) requestAnimationFrame(tick);
          else el.textContent = orig;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    $$(".section__title").forEach((t) => obs.observe(t));
  })();

  /* ---------------- Timeline scroll-draw + marker ignition ---------------- */
  (() => {
    const tl = $(".timeline");
    if (!tl || reduceMotion) return;
    tl.classList.add("has-progress");
    const bar = document.createElement("span");
    bar.className = "timeline__progress";
    bar.setAttribute("aria-hidden", "true");
    tl.appendChild(bar);
    const items = $$(".tl-item", tl);
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = tl.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * 0.72 - r.top) / r.height, 0), 1);
      bar.style.transform = `scaleY(${p.toFixed(4)})`;
      items.forEach((it) => {
        it.classList.toggle("passed", it.getBoundingClientRect().top < innerHeight * 0.72);
      });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  /* ---------------- Tag stagger indices ---------------- */
  $$(".skill-card").forEach((card) => $$(".tag", card).forEach((t, i) => t.style.setProperty("--i", i)));

  /* ---------------- Hero parallax exit ---------------- */
  (() => {
    if (reduceMotion) return;
    const inner = $(".hero__inner"), hint = $(".hero__scroll");
    if (!inner) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      if (y > innerHeight * 1.2) return;
      inner.style.transform = `translateY(${(y * 0.22).toFixed(1)}px)`;
      inner.style.opacity = Math.max(1 - y / (innerHeight * 0.9), 0).toFixed(3);
      if (hint) hint.style.opacity = Math.max(1 - y / 220, 0).toFixed(3);
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  })();

  /* ---------------- Marquee: pause offscreen ---------------- */
  (() => {
    const m = $(".marquee");
    if (!m) return;
    new IntersectionObserver((es) =>
      es.forEach((e) => m.classList.toggle("offscreen", !e.isIntersecting))
    ).observe(m);
  })();

  console.log("%c⚡ built from scratch — distributed by design", "color:#22d3ee;font-family:monospace;font-size:13px");
})();
