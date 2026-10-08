/* =========================================================
   SCROLL JOURNEY — loader, smooth scroll, section choreography
   ========================================================= */
(function () {
  const D = window.OPS, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const MOBILE = matchMedia("(max-width: 900px)").matches;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S3 = window.OPS3D || {};
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);

  if (!window.gsap) { document.body.classList.remove("is-loading"); $("#loader").remove(); return; }
  gsap.registerPlugin(ScrollTrigger);
  history.scrollRestoration = "manual";

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !RM) {
    lenis = new Lenis({ duration: 1.25, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const lock = on => { if (lenis) on ? lenis.stop() : lenis.start(); document.documentElement.style.overflow = on ? "hidden" : ""; };
  const goTo = id => {
    const el = document.getElementById(id); if (!el) return;
    const st = ScrollTrigger.getAll().find(t => t.trigger === el && t.pin);
    const y = st ? st.start + (id === "home" ? 0 : 1) : el.getBoundingClientRect().top + scrollY;
    lenis ? lenis.scrollTo(y, { duration: 1.6 }) : scrollTo({ top: y, behavior: RM ? "auto" : "smooth" });
  };
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute("href").slice(1); if (!id) return;
    e.preventDefault(); closeMenu(); goTo(id);
  });

  /* ---------- menu ---------- */
  const menu = $("#menu"), burger = $("#burger");
  function closeMenu() { menu.classList.remove("open"); document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); if (!$(".ev-overlay.open,.lightbox.open")) lock(false); }
  burger.addEventListener("click", () => {
    const o = !menu.classList.contains("open");
    if (!o) return closeMenu();
    menu.classList.add("open"); document.body.classList.add("menu-open"); burger.setAttribute("aria-expanded", "true"); lock(true);
  });

  /* ---------- LOADER ---------- */
  function runLoader() {
    const ph = $$(".loader-ph"), n = ph.length;
    const R = MOBILE ? [36, 30] : [34, 32];
    ph.forEach((el, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 + .3;
      gsap.set(el, { left: "50%", top: "50%", xPercent: -50, yPercent: -50,
        x: Math.cos(a) * innerWidth * R[0] / 100 * 2.2, y: Math.sin(a) * innerHeight * R[1] / 100 * 2.2, rotate: (rnd() - .5) * 30, scale: .7 });
      el._to = { x: Math.cos(a) * innerWidth * R[0] / 100, y: Math.sin(a) * innerHeight * R[1] / 100, rotate: (rnd() - .5) * 8 };
    });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (RM) { tl.to("#loader", { opacity: 0, duration: .4 }); }
    else {
      tl.from(".loader-id h2", { opacity: 0, letterSpacing: ".3em", duration: 1.2 }, 0)
        .from(".loader-id p", { opacity: 0, y: 10, duration: .8 }, .3)
        .to("#loaderBar", { scaleX: 1, duration: 2.1, ease: "power2.inOut" }, .2)
        .to(ph, { opacity: 1, scale: 1, x: i => ph[i]._to.x, y: i => ph[i]._to.y, rotate: i => ph[i]._to.rotate, duration: 1.5, stagger: .1, ease: "expo.out" }, .3)
        .to("#loaderWord", { backgroundPosition: "0% 0", duration: 1.4, ease: "power2.inOut" }, 1.2)
        .to(ph, { x: 0, y: 0, rotate: 0, scale: .4, opacity: 0, duration: .8, stagger: .04, ease: "power3.in" }, 2.4)
        .to(".loader-id", { scale: 1.6, opacity: 0, duration: .9, ease: "power3.in" }, 2.75)
        .to("#loader", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, 3.0)
        .from("#heroWord h1", { scale: 1.25, opacity: 0, duration: 1.8, ease: "expo.out" }, 3.2)
        .from("#heroWord .pre", { opacity: 0, y: 20, duration: 1 }, 3.5)
        .from(".hero-bg img", { scale: 1.15, duration: 2.2, ease: "expo.out" }, 3.0)
        .from("#heroTag p, #heroMeta, #heroScroll, #nav", { opacity: 0, y: 24, duration: 1, stagger: .1 }, 3.7);
    }
    tl.call(() => { $("#loader").remove(); document.body.classList.remove("is-loading"); if (lenis) lenis.start(); ScrollTrigger.refresh(); });
  }

  /* ---------- MOUSE (hero layers) ---------- */
  const mx = { x: 0, y: 0 };
  if (!MOBILE && !RM) {
    addEventListener("pointermove", e => { mx.x = e.clientX / innerWidth - .5; mx.y = e.clientY / innerHeight - .5; }, { passive: true });
    const q = $$("#heroStage [data-depth]").map(el => ({ el, d: +el.dataset.depth, x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }) }));
    gsap.ticker.add(() => q.forEach(o => { o.x(-mx.x * 30 * o.d); o.y(-mx.y * 18 * o.d); }));
  }

  /* ---------- HERO → white architecture ---------- */
  const archs = $$(".arch");
  gsap.set(archs, { rotateY: i => (archs[i].dataset.arch > 0 ? -92 : 92), transformOrigin: i => archs[i].dataset.arch > 0 ? "100% 50%" : "0% 50%", transformPerspective: 1200 });
  const heroTL = gsap.timeline({ scrollTrigger: { trigger: "#home", start: "top top", end: MOBILE ? "+=120%" : "+=180%", scrub: 1, pin: true, anticipatePin: 1 } });
  heroTL
    .to("#heroScroll, #heroMeta", { opacity: 0, duration: .1 }, 0)
    .to("#heroTag", { y: -120, opacity: 0, z: -200, duration: .35 }, 0)
    .to("#heroWord", { rotateX: 28, z: -500, y: "-6vh", duration: .4, ease: "power2.in" }, 0)
    .to("#heroWord", { rotateX: 0, z: 900, scale: 1, opacity: 0, duration: .35, ease: "power2.in" }, .4)
    .to(".hero-bg", { scale: 1.25, duration: .8 }, 0)
    .to(".hero-fg", { scale: 1.6, y: "12vh", duration: .8 }, 0)
    .to(archs, { rotateY: 0, duration: .45, stagger: { each: .025, from: "edges" }, ease: "power2.out" }, .35)
    .to("#heroWhite", { opacity: 1, duration: .2 }, .82);

  /* ---------- FLOATING → STORY ---------- */
  const fps = $$(".fp"), FN = fps.length;
  const cols = MOBILE ? 4 : 7;
  function floatLayout() {
    const vw = innerWidth, vh = innerHeight;
    const gap = vw * (MOBILE ? .02 : .012);
    const w = MOBILE ? (vw * .92 - gap * 3) / 4 : Math.min((vw * .8 - gap * 6) / 7, vh * .3);
    const h = w * 1.25, rows = Math.ceil(FN / cols);
    const totalW = cols * w + (cols - 1) * gap, totalH = rows * h + (rows - 1) * gap;
    fps.forEach((el, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      el.style.width = w + "px"; el.style.height = h + "px"; el.style.marginLeft = -w / 2 + "px"; el.style.marginTop = -h / 2 + "px";
      el._fin = { x: -totalW / 2 + w / 2 + c * (w + gap), y: -totalH / 2 + h / 2 + r * (h + gap) + (c % 2 ? h * .12 : -h * .04) - vh * .04 };
      if (!el._start) {
        const sc = .7 + rnd() * 1.1;
        el._start = { x: (rnd() - .5) * vw * 1.1, y: (rnd() - .5) * vh * 1.1, z: -2600 + rnd() * 2900, rx: (rnd() - .5) * 30, ry: (rnd() - .5) * 50, rz: (rnd() - .5) * 20, s: sc };
        // keep the central title readable
        if (Math.abs(el._start.x) < vw * .18 && el._start.z > -600) el._start.x += (el._start.x < 0 ? -1 : 1) * vw * .28;
      }
    });
  }
  floatLayout();
  const floatTL = gsap.timeline({ scrollTrigger: { trigger: "#memories", start: "top top", end: MOBILE ? "+=180%" : "+=260%", scrub: 1.2, pin: true, invalidateOnRefresh: true, onRefresh: floatLayout } });
  floatTL.fromTo(fps,
    { x: i => fps[i]._start.x, y: i => fps[i]._start.y, z: i => fps[i]._start.z - 600, rotateX: i => fps[i]._start.rx, rotateY: i => fps[i]._start.ry, rotateZ: i => fps[i]._start.rz, scale: i => fps[i]._start.s },
    { z: i => fps[i]._start.z + 500, duration: .45, ease: "none" }, 0)
    .to(fps, { x: i => fps[i]._fin.x, y: i => fps[i]._fin.y, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, duration: .45, ease: "power3.inOut", stagger: .012 }, .42)
    .from("#floatCopy > div", { opacity: 0, scale: .9, duration: .12 }, 0)
    .to("#floatCopy", { opacity: 0, scale: .9, duration: .12 }, .5)
    .to("#floatEnd", { opacity: 1, duration: .1 }, .85)
    .to(fps, { filter: "grayscale(0)", duration: .1 }, .9);
  gsap.set(fps, { filter: "grayscale(.5)" });
  if (!MOBILE && !RM) { // subtle mouse depth on floating space
    const fq = { x: gsap.quickTo("#floatSpace", "rotationY", { duration: 1.4 }), y: gsap.quickTo("#floatSpace", "rotationX", { duration: 1.4 }) };
    gsap.ticker.add(() => { fq.x(mx.x * 6); fq.y(-mx.y * 4); });
  }

  /* ---------- CAMPUS ---------- */
  const hs = $$(".hs");
  const campusTL = gsap.timeline({ scrollTrigger: { trigger: "#campus", start: "top top", end: MOBILE ? "+=140%" : "+=200%", scrub: 1, pin: true } });
  campusTL
    .fromTo("#campusFrame", { clipPath: MOBILE ? "inset(30% 8% 30% 8%)" : "inset(28% 36% 28% 36%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .35, ease: "power2.inOut" }, 0)
    .fromTo("#campusImg", { scale: 1.5 }, { scale: 1.05, duration: .9, ease: "power1.out" }, 0)
    .fromTo("#campusWord", { scale: .55, z: -400, y: "18vh", opacity: 0 }, { scale: 1, z: 0, y: 0, opacity: 1, duration: .4, ease: "power2.out" }, .1)
    .fromTo("#campusFill", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: .3 }, .35)
    .to("#campusWord", { y: "-4vh", letterSpacing: ".08em", duration: .4 }, .6)
    .from("#campusIntro", { opacity: 0, y: 40, duration: .2 }, .5)
    .to(hs, { opacity: 1, duration: .08, stagger: .03 }, .55);

  const fp = $("#facPanel");
  function openFac(i) {
    const f = D.facilities[i];
    hs.forEach((h, j) => h.classList.toggle("on", j === i));
    $("#facImg").innerHTML = OPSimg(f.img, f.name, true);
    $("#facNo").textContent = "Facility " + String(i + 1).padStart(2, "0") + " / " + String(D.facilities.length).padStart(2, "0");
    $("#facName").textContent = f.name; $("#facText").textContent = f.text;
    $("#facFacts").innerHTML = f.facts.map(x => `<li>${x}</li>`).join("");
    fp.classList.add("open");
    gsap.fromTo("#facImg img", { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: .9, ease: "expo.out" });
    gsap.fromTo(".fac-body > *", { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .6, ease: "power3.out" });
    gsap.to("#campusImg", { scale: 1.12, xPercent: (50 - f.x) * .08, yPercent: (50 - f.y) * .05, duration: 1.4, ease: "expo.out" });
  }
  function closeFac() { fp.classList.remove("open"); hs.forEach(h => h.classList.remove("on")); gsap.to("#campusImg", { xPercent: 0, yPercent: 0, duration: 1.2, ease: "expo.out" }); }
  hs.forEach((h, i) => h.addEventListener("click", () => openFac(i)));
  $("#facClose").addEventListener("click", closeFac);

  /* ---------- ACADEMICS (book) ---------- */
  const acLis = $$("#acIndex li");
  ScrollTrigger.create({
    trigger: "#academics", start: "top top", end: MOBILE ? "+=380%" : "+=480%", pin: true, scrub: true,
    onUpdate: st => {
      const p = st.progress; if (S3.book) S3.book.setProgress(p);
      const a = S3.book ? S3.book.activeIndex : Math.floor(p * 6.9) - 1;
      acLis.forEach((li, i) => li.classList.toggle("on", i === a));
      gsap.set("#acQuote", { opacity: clamp((p - .82) / .06) * (1 - clamp((p - .95) / .05)) });
      gsap.set(".ac-head,.ac-index", { opacity: 1 - clamp((p - .9) / .06) });
      gsap.set(".ac-word", { scale: 1 + p * .25, opacity: 1 - clamp((p - .85) / .1) });
    }
  });

  /* ---------- ACTIVITIES parallax ---------- */
  $$(".act").forEach(el => {
    const s = MOBILE ? +el.dataset.speed * .4 : +el.dataset.speed;
    gsap.fromTo(el, { y: -s * 400 }, { y: s * 400, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(el.querySelector("img"), { scale: 1.25 }, { scale: 1.05, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(el.querySelector("figcaption"), { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: el, start: "top 80%" } });
  });
  gsap.from(".act-statement", { opacity: 0, y: 40, duration: 1.2, scrollTrigger: { trigger: ".act-statement", start: "top 85%" } });

  /* ---------- SPORTS ---------- */
  gsap.timeline({ scrollTrigger: { trigger: "#spIntro", start: "top top", end: MOBILE ? "+=110%" : "+=170%", pin: true, scrub: true,
    onUpdate: st => S3.ball && S3.ball.setProgress(st.progress) } })
    .fromTo(".sp-word", { scale: 1.3, opacity: .3 }, { scale: 1, opacity: 1, duration: .6 }, 0)
    .to("#spCopy", { opacity: 1, y: 0, duration: .2 }, .55)
    .to("#spStat", { opacity: 1, duration: .2 }, .65)
    .to({}, { duration: .2 });
  gsap.set("#spCopy", { y: 30 });
  const spF = $("#spFloat"), spImgs = $$("#spFloat img"), rows = $$(".sp-row");
  if (!MOBILE) {
    const fx = gsap.quickTo(spF, "left", { duration: .7, ease: "power3" }), fy = gsap.quickTo(spF, "top", { duration: .7, ease: "power3" });
    $("#spList").addEventListener("pointermove", e => { fx(e.clientX + innerWidth * .12); fy(e.clientY); });
    rows.forEach((r, i) => {
      const on = () => { rows.forEach(x => x.classList.toggle("on", x === r)); spImgs.forEach((im, j) => im.classList.toggle("on", i === j)); spF.classList.add("on"); };
      r.addEventListener("pointerenter", on);
      r.addEventListener("focus", () => { on(); const b = r.getBoundingClientRect(); spF.style.left = b.right - innerWidth * .2 + "px"; spF.style.top = b.top + b.height / 2 + "px"; });
      r.addEventListener("blur", () => spF.classList.remove("on"));
    });
    $("#spList").addEventListener("pointerleave", () => { spF.classList.remove("on"); rows.forEach(x => x.classList.remove("on")); });
  }
  gsap.from(rows, { opacity: 0, y: 60, stagger: .08, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: "#spList", start: "top 75%" } });

  /* ---------- EVENTS (3D layers) ---------- */
  const cards = $$(".ev-card"), evBtns = $$("#evList button");
  const GAP = MOBILE ? 1100 : 900;
  const lay = cards.map((c, i) => ({ x: MOBILE ? (i % 2 ? 6 : -6) : [14, -22, 20, -18, 24, -14][i], y: MOBILE ? (i % 2 ? 4 : -2) : [4, -8, 10, -4, 6, -2][i], z: -i * GAP, r: [-4, 5, -3, 4, -5, 3][i] }));
  let evCamZ = 0, evIdx = 0;
  function evRender() {
    cards.forEach((c, i) => {
      const L = lay[i], ez = L.z + evCamZ; // >0 means past focal
      const op = ez > 0 ? clamp(1 - ez / 500) : clamp(1 + (ez + GAP * 2.6) / GAP);
      gsap.set(c, { xPercent: -50, yPercent: -50, x: L.x + "vw", y: L.y + "vh", z: ez, rotateY: L.r + ez * .004, opacity: op, pointerEvents: op > .5 ? "auto" : "none", zIndex: 100 + Math.round(ez / 10) });
    });
  }
  const evST = ScrollTrigger.create({
    trigger: "#events", start: "top top", end: () => "+=" + (cards.length * (MOBILE ? 70 : 80)) + "%", pin: true, scrub: true,
    onUpdate: st => {
      evCamZ = st.progress * (cards.length - 1) * GAP + 200 * st.progress; evRender();
      const n = Math.min(cards.length - 1, Math.round(evCamZ / GAP)); if (n !== evIdx) { evIdx = n; evBtns.forEach((b, i) => b.classList.toggle("on", i === n)); }
      $("#events").style.background = `hsl(60 ${6 - st.progress * 4}% ${96 - st.progress * 4}%)`;
    }
  });
  evRender(); evBtns[0] && evBtns[0].classList.add("on");
  evBtns.forEach((b, i) => b.addEventListener("click", () => {
    const y = evST.start + (evST.end - evST.start) * (i * GAP / ((cards.length - 1) * GAP + 200));
    lenis ? lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: "smooth" });
  }));

  const ov = $("#evOverlay"), ghost = $("#evGhost"); let lastCard = null;
  function openEvent(i) {
    const e = D.events[i]; lastCard = cards[i];
    $("#evOHero").innerHTML = OPSimg(e.img, e.name, true);
    $("#evODate").textContent = e.date; $("#evOName").textContent = e.name; $("#evOText").textContent = e.text;
    $("#evOPhotos").innerHTML = e.photos.map(k => `<figure>${OPSimg(k, e.name + " photograph")}</figure>`).join("");
    const r = cards[i].querySelector(".in").getBoundingClientRect();
    ghost.innerHTML = `<img src="${D.img[e.img]}" alt="">`; ghost.hidden = false; lock(true);
    gsap.set(ghost, { left: r.left, top: r.top, width: r.width, height: r.height, opacity: 1 });
    gsap.to(ghost, { left: 0, top: 0, width: innerWidth, height: innerHeight * .72, duration: RM ? .01 : 1, ease: "expo.inOut",
      onComplete: () => {
        ov.classList.add("open"); ov.scrollTop = 0;
        gsap.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: .35, onComplete: () => { ghost.hidden = true; } });
        gsap.from(".ev-info > *, .ev-photos figure", { y: 40, opacity: 0, stagger: .08, duration: .9, ease: "power3.out", delay: .1 });
        $("#evClose").focus();
      } });
  }
  function closeEvent() {
    if (!ov.classList.contains("open")) return;
    const r = lastCard.querySelector(".in").getBoundingClientRect();
    ghost.hidden = false; gsap.set(ghost, { left: 0, top: -ov.scrollTop, width: innerWidth, height: innerHeight * .72 });
    ov.classList.remove("open");
    gsap.to(ghost, { left: r.left, top: r.top, width: r.width, height: r.height, duration: RM ? .01 : .9, ease: "expo.inOut",
      onComplete: () => { gsap.to(ghost, { opacity: 0, duration: .2, onComplete: () => ghost.hidden = true }); lock(false); lastCard.focus(); } });
  }
  cards.forEach((c, i) => c.addEventListener("click", () => openEvent(i)));
  $("#evClose").addEventListener("click", closeEvent);

  /* ---------- ACHIEVEMENTS ---------- */
  const cats = $$(".ach-cat"), stats = $$(".ach-stat");
  const achTL = gsap.timeline({ scrollTrigger: { trigger: "#achievements", start: "top top", end: MOBILE ? "+=150%" : "+=220%", pin: true, scrub: 1,
    onUpdate: st => S3.trophy && S3.trophy.setProgress(st.progress) } });
  achTL.fromTo(".ach-head", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .15 }, .02)
    .to("#achGlow", { opacity: 1, scale: 1.3, duration: .7 }, 0)
    .to(cats, { opacity: 1, duration: .1, stagger: .08 }, .2)
    .fromTo(cats, { y: 30 }, { y: 0, duration: .1, stagger: .08 }, .2)
    .to(stats, { opacity: 1, duration: .1, stagger: .05 }, .55)
    .add(() => { }, 1);
  const midCat = $(".ach-cat.mid"); if (midCat) Object.assign(midCat.style, { left: "50%", top: MOBILE ? "26%" : "24%", transform: "translateX(-50%)", textAlign: "center", width: "260px", display: MOBILE ? "none" : "" });
  if (midCat) midCat.style.setProperty("--c", "1");
  stats.forEach(s => {
    const b = s.querySelector("b"), to = +b.dataset.to, suf = b.dataset.suffix, o = { v: 0 };
    achTL.to(o, { v: to, duration: .3, ease: "power2.out", onUpdate: () => b.textContent = Math.round(o.v) + suf }, .58);
  });
  if (MOBILE) cats.forEach((c, i) => { if (i < 4) Object.assign(c.style, { top: (i < 2 ? 24 : 62) + "%" }); });

  /* ---------- QUOTE ---------- */
  const words = $$("#quoteText .w");
  ScrollTrigger.create({ trigger: "#quote", start: "top 70%", end: "bottom 60%", scrub: true,
    onUpdate: st => words.forEach((w, i) => w.style.opacity = clamp(st.progress * words.length * 1.3 - i) * .88 + .12) });

  /* ---------- GALLERY ---------- */
  const gi = $$(".g-item"), GN = gi.length;
  function gLayout() {
    const vw = innerWidth, vh = innerHeight, gc = MOBILE ? 3 : 5, gr = Math.ceil(GN / gc);
    const top = vh * (MOBILE ? .36 : .34), bottom = vh * .05, side = vw * (MOBILE ? .04 : .06), gap = MOBILE ? 6 : 14;
    const cw = (vw - side * 2 - gap * (gc - 1)) / gc, ch = Math.min((vh - top - bottom - gap * (gr - 1)) / gr, cw * .8);
    const gw = Math.min(cw, ch / .66), totalW = gw * gc + gap * (gc - 1), totalH = ch * gr + gap * (gr - 1);
    gi.forEach((el, i) => {
      const c = i % gc, r = Math.floor(i / gc);
      Object.assign(el.style, { width: gw + "px", height: ch + "px", marginLeft: -gw / 2 + "px", marginTop: -ch / 2 + "px" });
      el._fin = { x: -totalW / 2 + gw / 2 + c * (gw + gap), y: top + ch / 2 + r * (ch + gap) - vh / 2 + (vh - top - bottom - totalH) / 2 };
      if (!el._st) el._st = { x: (rnd() - .5) * vw * 1.2, y: (rnd() - .5) * vh * 1.1, z: -1800 + rnd() * 1600, ry: (rnd() - .5) * 60, rz: (rnd() - .5) * 24, s: .8 + rnd() * .8 };
    });
  }
  gLayout();
  gsap.timeline({ scrollTrigger: { trigger: "#gallery", start: "top top", end: MOBILE ? "+=140%" : "+=200%", pin: true, scrub: 1.2, invalidateOnRefresh: true, onRefresh: gLayout } })
    .fromTo(gi, { x: i => gi[i]._st.x, y: i => gi[i]._st.y, z: i => gi[i]._st.z, rotateY: i => gi[i]._st.ry, rotateZ: i => gi[i]._st.rz, scale: i => gi[i]._st.s },
      { x: i => gi[i]._fin.x, y: i => gi[i]._fin.y, z: 0, rotateY: 0, rotateZ: 0, scale: 1, duration: .8, ease: "power3.inOut", stagger: .01 }, 0)
    .fromTo(".g-head", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .2 }, .55);
  $$("#gFilters button").forEach(b => b.addEventListener("click", () => {
    $$("#gFilters button").forEach(x => x.classList.toggle("on", x === b));
    const c = b.dataset.c; gi.forEach(el => el.classList.toggle("dim", c !== "All" && el.dataset.c !== c));
  }));
  // lightbox
  const lb = $("#lightbox"); let lbI = 0, lbFrom = null;
  const visible = () => gi.filter(el => !el.classList.contains("dim")).map(el => +el.dataset.i);
  function lbShow(i, dir = 0) {
    lbI = i; const g = D.gallery[i], vis = visible();
    $("#lbImg").src = D.img[g.img]; $("#lbImg").alt = g.caption; $("#lbCap").textContent = g.caption; $("#lbCat").textContent = g.cat;
    $("#lbCount").innerHTML = `<b>${String(vis.indexOf(i) + 1).padStart(2, "0")}</b> / ${String(vis.length).padStart(2, "0")}`;
    gsap.fromTo("#lbImg", { x: dir * 80, opacity: 0, scale: .96 }, { x: 0, opacity: 1, scale: 1, duration: .8, ease: "expo.out" });
  }
  const lbStep = d => { const v = visible(), k = v.indexOf(lbI); lbShow(v[(k + d + v.length) % v.length], d); };
  function lbOpen(i) { lbFrom = gi[i]; lb.classList.add("open"); lock(true); gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: .4 }); lbShow(i); $("#lbClose").focus(); }
  function lbClose() { gsap.to(lb, { opacity: 0, duration: .3, onComplete: () => { lb.classList.remove("open"); lock(false); lbFrom && lbFrom.focus(); } }); }
  gi.forEach((el, i) => el.addEventListener("click", () => lbOpen(i)));
  $("#lbPrev").addEventListener("click", () => lbStep(-1)); $("#lbNext").addEventListener("click", () => lbStep(1)); $("#lbClose").addEventListener("click", lbClose);
  let tx = 0; lb.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
  lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) lbStep(d < 0 ? 1 : -1); });
  addEventListener("keydown", e => {
    if (lb.classList.contains("open")) { if (e.key === "Escape") lbClose(); if (e.key === "ArrowRight") lbStep(1); if (e.key === "ArrowLeft") lbStep(-1); return; }
    if (ov.classList.contains("open") && e.key === "Escape") return closeEvent();
    if (fp.classList.contains("open") && e.key === "Escape") return closeFac();
    if (menu.classList.contains("open") && e.key === "Escape") closeMenu();
  });

  /* ---------- PEOPLE ---------- */
  $$(".fac").forEach(f => gsap.from(f.children, { opacity: 0, y: 40, stagger: .1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: f, start: "top 80%" } }));
  function showStudent(i) {
    const s = D.students[i];
    $$("#recTabs button").forEach((b, j) => { b.classList.toggle("on", i === j); b.setAttribute("aria-selected", i === j); });
    $("#sImg").innerHTML = OPSimg(s.img, "Demo student photograph", true);
    $("#sName").textContent = s.name; $("#sId").textContent = s.id; $("#sCls").textContent = s.cls; $("#sSec").textContent = s.section;
    $("#sFa").textContent = s.father; $("#sMo").textContent = s.mother; $("#sPh").textContent = s.phone;
    gsap.fromTo(".card-body > *", { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .07, duration: .6, ease: "power3.out" });
  }
  $$("#recTabs button").forEach((b, i) => { b.setAttribute("role", "tab"); b.addEventListener("click", () => showStudent(i)); });
  showStudent(0);
  gsap.from("#cardId", { rotateX: 18, y: 80, opacity: 0, transformPerspective: 1200, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: "#cardId", start: "top 85%" } });

  /* ---------- ADMISSIONS (gallery reorganises into strip) ---------- */
  const strip = $$("#admStrip figure");
  gsap.fromTo(strip, { y: i => (i % 2 ? -1 : 1) * 220, x: i => (i - 4) * 90, rotate: i => (i - 4) * 6, scale: 2.2, opacity: 0 },
    { y: 0, x: 0, rotate: 0, scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: "#admissions", start: "top 95%", end: "top 25%", scrub: 1 } });
  gsap.from(".adm-top h2", { letterSpacing: ".2em", opacity: 0, scrollTrigger: { trigger: ".adm-top", start: "top 90%", end: "top 45%", scrub: 1 } });
  gsap.to(".steps .bar", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "#steps", start: "top 75%", end: "bottom 55%", scrub: 1 } });
  gsap.from("#steps li", { opacity: 0, y: 40, stagger: .12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#steps", start: "top 80%" } });
  gsap.from(".adm-cols > div", { opacity: 0, y: 40, stagger: .12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".adm-cols", start: "top 85%" } });

  /* ---------- CONTACT ---------- */
  gsap.fromTo("#ctBg", { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1, ease: "none", scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".ct-panel", { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: "#contact", start: "top 60%" } });
  const form = $("#ctForm");
  const rules = { name: v => v.trim().length > 1, email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), phone: v => /^\+?\d{10,13}$/.test(v.replace(/[\s-]/g, "")), message: v => v.trim().length > 4 };
  const check = el => { const ok = rules[el.name](el.value); el.parentElement.classList.toggle("err", !ok); el.setAttribute("aria-invalid", !ok); return ok; };
  $$("input,textarea", form).forEach(el => el.addEventListener("blur", () => el.value && check(el)));
  $$("input,textarea", form).forEach(el => el.addEventListener("input", () => el.parentElement.classList.contains("err") && check(el)));
  form.addEventListener("submit", e => {
    e.preventDefault();
    const els = $$("input,textarea", form), ok = els.map(check).every(Boolean);
    if (!ok) { els.find(el => el.parentElement.classList.contains("err")).focus(); gsap.fromTo(".ct-panel", { x: -8 }, { x: 0, duration: .5, ease: "elastic.out(1,.4)" }); return; }
    $("#ctPanel").classList.add("sent");
    gsap.from(".ct-ok > *", { opacity: 0, y: 20, stagger: .1, duration: .8, ease: "power3.out" });
    form.reset();
  });
  $("#ctAgain").addEventListener("click", () => $("#ctPanel").classList.remove("sent"));
  gsap.from(".ft-word", { xPercent: -10, opacity: 0, scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top 30%", scrub: 1 } });

  /* ---------- NAV state, progress, chapter ---------- */
  const nav = $("#nav"), prog = $("#progress");
  const secs = $$("main > section[id]");
  const navMap = { memories: "home", quote: "achievements", people: "admissions" };
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: st => {
    gsap.set(prog, { scaleX: st.progress });
    nav.classList.toggle("scrolled", scrollY > 40);
    const mid = innerHeight * .5;
    let cur = secs[0];
    for (const s of secs) { const r = s.getBoundingClientRect(); if (r.top <= mid) cur = s; }
    // pinned sections: use pin-spacer bounds
    const dark = cur.classList.contains("on-dark") || (cur.id === "home" && scrollY < innerHeight * .9);
    nav.classList.toggle("dark", dark && cur.id !== "home");
    if (cur.id === "home" && scrollY > 40) nav.classList.toggle("dark", heroTL.progress() < .55);
    const id = navMap[cur.id] || cur.id;
    $$("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === id));
    $("#chNum").textContent = String(secs.indexOf(cur) + 1).padStart(2, "0");
    $("#chName").textContent = cur.dataset.ch || "";
  } });

  /* ---------- go ---------- */
  addEventListener("load", () => ScrollTrigger.refresh());
  const start = () => { scrollTo(0, 0); runLoader(); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(start, 120));
  setTimeout(() => { if (document.body.classList.contains("is-loading") && !$("#loader")._s) { } }, 6000);
})();
