/* =========================================================
   3D SCENES — Book (Knowledge), Ball (Sports), Trophy (Achievements)
   Each scene: setProgress(0..1), renders only while visible.
   ========================================================= */
(function () {
  const T = window.THREE; if (!T) return;
  const D = window.OPS;
  const MOBILE = matchMedia("(max-width: 900px)").matches;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(devicePixelRatio || 1, MOBILE ? 1.5 : 2);
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener("pointermove", e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const seg = (p, a, b) => clamp((p - a) / (b - a));

  function makeScene(canvas, opts) {
    const renderer = new T.WebGLRenderer({ canvas, antialias: !MOBILE, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(DPR);
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = opts.exposure || 1;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(opts.fov || 35, 1, .1, 200);
    const S = { renderer, scene, camera, p: 0, visible: false, update: null, dirty: true, t: 0 };
    const resize = () => {
      const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); S.dirty = true;
      opts.onResize && opts.onResize(w, h);
    };
    addEventListener("resize", resize); resize();
    new IntersectionObserver(es => es.forEach(e => S.visible = e.isIntersecting), { rootMargin: "100px" }).observe(canvas);
    let last = performance.now();
    const loop = now => {
      requestAnimationFrame(loop);
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (!S.visible) return;
      S.t += dt;
      mouse.sx = lerp(mouse.sx, mouse.x, .05); mouse.sy = lerp(mouse.sy, mouse.y, .05);
      S.update && S.update(dt, S.t);
      renderer.render(scene, camera);
    };
    requestAnimationFrame(loop);
    S.setProgress = p => { S.p = p; };
    return S;
  }

  /* simple studio environment for metals */
  function studioEnv(renderer, warm) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
    const g = c.getContext("2d");
    const bg = g.createLinearGradient(0, 0, 0, 512);
    bg.addColorStop(0, warm ? "#3a3022" : "#2a2a2a"); bg.addColorStop(.5, "#121212"); bg.addColorStop(1, "#060606");
    g.fillStyle = bg; g.fillRect(0, 0, 1024, 512);
    const box = (x, y, w, h, col) => { const r = g.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) / 1.4); r.addColorStop(0, col); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(x - w, y - h, w * 3, h * 3); };
    box(150, 120, 180, 90, warm ? "rgba(255,236,190,1)" : "#fff");
    box(640, 90, 260, 70, "rgba(255,255,255,.9)");
    box(420, 330, 300, 40, warm ? "rgba(244,196,48,.55)" : "rgba(200,200,200,.4)");
    box(880, 260, 90, 160, "rgba(255,240,210,.7)");
    const tex = new T.CanvasTexture(c); tex.mapping = T.EquirectangularReflectionMapping; tex.encoding = T.sRGBEncoding;
    const pm = new T.PMREMGenerator(renderer); const env = pm.fromEquirectangular(tex).texture; tex.dispose(); pm.dispose();
    return env;
  }

  const imgCache = {};
  function loadImg(key) {
    if (imgCache[key]) return imgCache[key];
    return imgCache[key] = new Promise(res => {
      const im = new Image(); im.crossOrigin = "anonymous";
      im.onload = () => res(im); im.onerror = () => res(null); im.src = D.img[key] || key;
    });
  }
  function cover(g, im, x, y, w, h, gray) {
    if (!im) { // striped placeholder
      g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = "#e6e5df"; g.fillRect(x, y, w, h);
      g.strokeStyle = "#efeee9"; g.lineWidth = 12; for (let i = -h; i < w; i += 28) { g.beginPath(); g.moveTo(x + i, y + h); g.lineTo(x + i + h, y); g.stroke(); }
      g.restore(); return;
    }
    const r = Math.max(w / im.width, h / im.height), iw = im.width * r, ih = im.height * r;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    if (gray) g.filter = "grayscale(1)";
    g.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih); g.restore();
  }

  /* ======================= BOOK ======================= */
  function initBook() {
    const canvas = document.getElementById("bookCanvas"); if (!canvas) return null;
    const S = makeScene(canvas, { fov: 30, exposure: 1.05 });
    const { scene, camera, renderer } = S;
    scene.add(new T.HemisphereLight(0xffffff, 0xd8d4c8, .75));
    const key = new T.DirectionalLight(0xfff3dc, 1.1); key.position.set(-3, 6, 8); scene.add(key);
    const goldL = new T.PointLight(0xf4c430, .5, 20); goldL.position.set(4, 2, 4); scene.add(goldL);

    const W = 3, H = 4.1, TW = 768, TH = Math.round(768 * H / W);
    const SUB = D.subjects;
    const PAPER = "#F8F6EF", INK = "#2B2B2B", GOLD = "#C99A12";

    function pageTex(draw) {
      const c = document.createElement("canvas"); c.width = TW; c.height = TH;
      const g = c.getContext("2d"); const tex = new T.CanvasTexture(c);
      tex.encoding = T.sRGBEncoding; tex.anisotropy = 8;
      const paint = async () => { await draw(g, c); tex.needsUpdate = true; S.dirty = true; };
      paint(); return tex;
    }
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const serif = (s, w = 400, it = "") => `${it} ${w} ${s}px "Playfair Display", Georgia, serif`;
    const sans = (s, w = 600) => `${w} ${s}px Manrope, Helvetica, sans-serif`;
    const spaced = (g, txt, x, y, sp) => { g.save(); try { g.letterSpacing = sp + "px"; } catch (e) { } g.fillText(txt, x, y); g.restore(); };
    const paper = (g, left) => {
      g.fillStyle = PAPER; g.fillRect(0, 0, TW, TH);
      const gr = left ? g.createLinearGradient(TW, 0, TW - 90, 0) : g.createLinearGradient(0, 0, 90, 0);
      gr.addColorStop(0, "rgba(0,0,0,.13)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, TW, TH);
    };
    const wrap = (g, txt, x, y, maxW, lh) => {
      const words = txt.split(" "); let line = "", yy = y;
      for (const w of words) { const t = line ? line + " " + w : w; if (g.measureText(t).width > maxW && line) { g.fillText(line, x, yy); line = w; yy += lh; } else line = t; }
      g.fillText(line, x, yy);
    };

    const covTex = pageTex(async g => {
      await fontsReady; const im = await loadImg("campus");
      g.fillStyle = "#232323"; g.fillRect(0, 0, TW, TH);
      cover(g, im, 0, 0, TW, TH, true); g.fillStyle = "rgba(25,25,25,.78)"; g.fillRect(0, 0, TW, TH);
      g.strokeStyle = GOLD; g.lineWidth = 3; g.strokeRect(40, 40, TW - 80, TH - 80); g.lineWidth = 1; g.strokeRect(54, 54, TW - 108, TH - 108);
      g.textAlign = "center"; g.fillStyle = "#F4C430";
      g.save(); g.translate(TW / 2, 250); g.rotate(Math.PI / 4); g.strokeStyle = "#F4C430"; g.lineWidth = 2; g.strokeRect(-40, -40, 80, 80); g.restore();
      g.font = serif(46, 500); g.fillText("O", TW / 2, 266);
      g.fillStyle = "#f2f2ee"; g.font = serif(118, 500); g.fillText("OXFORD", TW / 2, 520);
      g.font = sans(20, 600); spaced(g, "PUBLIC SCHOOL", TW / 2 + 6, 570, 12);
      g.fillStyle = "#F4C430"; g.fillRect(TW / 2 - 40, 640, 80, 2);
      g.font = serif(56, 400, "italic"); g.fillStyle = "#F4C430"; g.fillText("Knowledge", TW / 2, 760);
      g.font = sans(16, 600); g.fillStyle = "#bdbdb7"; spaced(g, "THE ACADEMIC VOLUME", TW / 2 + 4, TH - 120, 8);
    });
    // typographic left page for subject i
    const leftTex = i => pageTex(async g => {
      await fontsReady; paper(g, true); const s = SUB[i];
      g.fillStyle = GOLD; g.font = serif(30, 400, "italic"); g.fillText("Chapter " + ["I", "II", "III", "IV", "V", "VI"][i], 80, 130);
      g.fillStyle = "#e7e3d6"; g.font = serif(520, 400); g.textAlign = "right"; g.fillText(String(i + 1), TW - 40, TH - 260); g.textAlign = "left";
      g.fillStyle = INK; g.font = serif(s.name.length > 10 ? 74 : 88, 500); g.fillText(s.name.toUpperCase(), 80, TH - 190);
      g.fillStyle = GOLD; g.fillRect(80, TH - 150, 70, 3);
      g.font = sans(15, 600); g.fillStyle = "#8a8a85"; spaced(g, "OXFORD PUBLIC SCHOOL · ACADEMICS", 80, TH - 90, 5);
    });
    const rightTex = i => pageTex(async g => {
      await fontsReady; paper(g, false); const s = SUB[i]; const im = await loadImg(s.img);
      cover(g, im, 70, 80, TW - 140, 560);
      g.fillStyle = "#F4C430"; g.fillRect(70, 640, 120, 6);
      g.fillStyle = GOLD; g.font = sans(16, 700); spaced(g, String(i + 1).padStart(2, "0") + " / 06", 70, 720, 6);
      g.fillStyle = INK; g.font = serif(60, 500); g.fillText(s.name, 70, 800);
      g.fillStyle = "#555"; g.font = sans(27, 400); wrap(g, s.text, 70, 870, TW - 160, 42);
      g.fillStyle = "#b8b4a6"; g.font = serif(26, 400, "italic"); g.textAlign = "right"; g.fillText(String(i * 2 + 2), TW - 70, TH - 60);
    });
    const finalLeft = pageTex(async g => {
      await fontsReady; paper(g, true); g.textAlign = "center";
      g.fillStyle = INK; g.font = serif(84, 400); g.fillText("Knowledge", TW / 2, TH / 2 - 60);
      g.font = serif(84, 400, "italic"); g.fillStyle = GOLD; g.fillText("opens", TW / 2, TH / 2 + 40);
      g.fillStyle = INK; g.font = serif(84, 400); g.fillText("possibilities.", TW / 2, TH / 2 + 140);
    });
    const finalRight = pageTex(async g => {
      await fontsReady; paper(g, false); const im = await loadImg("music");
      cover(g, im, 70, 80, TW - 140, TH - 260);
      g.fillStyle = "#8a8a85"; g.font = sans(16, 700); spaced(g, "NEXT · STUDENT LIFE", 70, TH - 100, 6);
    });

    const book = new T.Group(); scene.add(book);
    const pivotRoot = new T.Group(); book.add(pivotRoot);
    // back board (right side) & left board appear as the book opens
    const boardMat = new T.MeshStandardMaterial({ color: 0x252525, roughness: .6, metalness: .1 });
    const boardR = new T.Mesh(new T.BoxGeometry(W + .08, H + .1, .06), boardMat); boardR.position.set(W / 2, 0, -.13); book.add(boardR);
    const blockMat = new T.MeshStandardMaterial({ color: 0xefece2, roughness: .9 });
    const blockR = new T.Mesh(new T.BoxGeometry(W - .04, H - .04, .16), blockMat); blockR.position.set(W / 2, 0, -.04); book.add(blockR);
    const blockL = blockR.clone(); blockL.position.x = -W / 2; blockL.scale.z = .02; book.add(blockL);
    const spine = new T.Mesh(new T.CylinderGeometry(.14, .14, H + .1, 16, 1, true, Math.PI, Math.PI), boardMat); spine.rotation.z = 0; spine.rotation.y = Math.PI / 2; spine.position.set(0, 0, -.1); book.add(spine);
    // final right page sits under all leaves
    const pageGeo = (segs) => { const g = new T.PlaneGeometry(W, H, segs, 1); g.translate(W / 2, 0, 0); return g; };
    const under = new T.Mesh(pageGeo(1), new T.MeshStandardMaterial({ map: finalRight, roughness: .85 })); under.position.z = .045; book.add(under);

    // leaves: [cover, p1..p6]
    const leaves = [];
    const mkLeaf = (front, back, isCover, idx) => {
      const geo = pageGeo(24); const base = geo.attributes.position.array.slice();
      const fm = new T.MeshStandardMaterial({ map: front, roughness: isCover ? .55 : .85, metalness: isCover ? .05 : 0 });
      back.wrapS = T.RepeatWrapping; back.repeat.x = -1; back.offset.x = 1;
      const bm = new T.MeshStandardMaterial({ map: back, roughness: .85, side: T.BackSide });
      const piv = new T.Group(); const a = new T.Mesh(geo, fm), b = new T.Mesh(geo, bm); piv.add(a, b);
      piv.position.z = .05 + (7 - idx) * .006; pivotRoot.add(piv);
      if (isCover) { const edge = new T.Mesh(new T.BoxGeometry(W + .08, H + .1, .05), boardMat); edge.position.set(W / 2, 0, -.03); piv.add(edge); }
      leaves.push({ piv, geo, base, isCover, rot: 0 });
    };
    mkLeaf(covTex, leftTex(0), true, 0);
    for (let i = 0; i < 6; i++) mkLeaf(rightTex(i), i < 5 ? leftTex(i + 1) : finalLeft, false, i + 1);

    const bend = (L, r) => { // r: 0..PI
      const pos = L.geo.attributes.position, arr = pos.array, b = L.base, k = Math.sin(r) * (L.isCover ? .05 : .55);
      for (let i = 0; i < arr.length; i += 3) { const u = b[i] / W; arr[i + 2] = b[i + 2] + k * Math.sin(u * Math.PI * .9) * (1 - u * .3); }
      pos.needsUpdate = true;
    };

    // timeline: cover turn at .08-.18, pages turn evenly .24 → .84
    const turns = [[.08, .18]]; for (let i = 0; i < 6; i++) { const s = .25 + i * .105; turns.push([s, s + .07]); }
    S.activeIndex = -1;
    S.update = (dt) => {
      const p = S.p;
      const open = ease(seg(p, .02, .18));
      let active = -1;
      leaves.forEach((L, i) => {
        const tp = easeIO(seg(p, turns[i][0], turns[i][1]));
        const r = tp * Math.PI * .995;
        L.piv.rotation.y = -r;
        L.piv.position.z = (tp > .5 ? .05 + i * .006 : .05 + (7 - i) * .006);
        bend(L, r);
        if (tp > .5 && i < 6) active = i;
      });
      if (p < .2) active = -1;
      S.activeIndex = active;
      blockL.scale.z = .05 + seg(p, .08, .9) * .95; blockL.position.z = -.04 - (1 - blockL.scale.z) * .0;
      blockR.scale.z = 1 - seg(p, .25, .9) * .8;
      // book placement
      const closedX = -W / 2;
      book.position.x = lerp(closedX, 0, open);
      book.rotation.x = lerp(-.55, -.12, open) + mouse.sy * .04;
      book.rotation.y = lerp(.5, 0, open) + mouse.sx * .06;
      book.rotation.z = lerp(.08, 0, open);
      // camera dive at end
      const dive = easeIO(seg(p, .88, 1));
      const baseZ = camera.aspect < .8 ? 19 : 12.5;
      camera.position.set(lerp(0, -W * .5, dive), lerp(.2, 0, dive), lerp(baseZ, 2.2, dive));
      camera.lookAt(lerp(0, -W * .5, dive), 0, 0);
      goldL.intensity = .3 + Math.sin(S.t * .8) * .1 + open * .3;
    };
    return S;
  }

  /* ======================= BALL ======================= */
  function initBall() {
    const canvas = document.getElementById("ballCanvas"); if (!canvas) return null;
    const S = makeScene(canvas, { fov: 32, exposure: 1.1 });
    const { scene, camera, renderer } = S;
    scene.environment = studioEnv(renderer, true);
    const key = new T.DirectionalLight(0xfff0d0, 2.2); key.position.set(-4, 5, 6); scene.add(key);
    const rim = new T.DirectionalLight(0xf4c430, 3); rim.position.set(5, 1, -4); scene.add(rim);
    scene.add(new T.AmbientLight(0xffffff, .12));

    // leather texture
    const c = document.createElement("canvas"); c.width = 1024; c.height = 512; const g = c.getContext("2d");
    g.fillStyle = "#6e1515"; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? "0,0,0" : "255,190,170"},${Math.random() * .05})`; g.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2); }
    // quarter seams (faint)
    g.strokeStyle = "rgba(40,5,5,.5)"; g.lineWidth = 2;
    [128, 384].forEach(y => { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); });
    // main seam band (vertical in equirect = meridian) — draw as two columns at u=.25 and .75
    const seamX = [256, 768];
    seamX.forEach(x => {
      g.fillStyle = "#4a0c0c"; g.fillRect(x - 10, 0, 20, 512);
      g.fillStyle = "#efe7d6";
      for (let y = 6; y < 512; y += 11) { [-15, 15].forEach(o => { g.save(); g.translate(x + o, y); g.rotate(o > 0 ? .5 : -.5); g.fillRect(-5, -1.6, 10, 3.2); g.restore(); }); }
    });
    const tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding; tex.anisotropy = 8;
    const bump = new T.CanvasTexture(c);
    const ball = new T.Mesh(new T.SphereGeometry(1, MOBILE ? 48 : 96, MOBILE ? 32 : 64),
      new T.MeshStandardMaterial({ map: tex, bumpMap: bump, bumpScale: .015, roughness: .38, metalness: .05, envMapIntensity: .8 }));
    const grp = new T.Group(); grp.add(ball); scene.add(grp);
    // shadow disc
    const sh = new T.Mesh(new T.CircleGeometry(1.4, 48), new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .5 }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = -1.6; scene.add(sh);
    // dust motes
    const N = MOBILE ? 60 : 160, pg = new T.BufferGeometry(), pa = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pa[i * 3] = (Math.random() - .5) * 14; pa[i * 3 + 1] = (Math.random() - .5) * 8; pa[i * 3 + 2] = (Math.random() - .5) * 10 - 2; }
    pg.setAttribute("position", new T.BufferAttribute(pa, 3));
    const pts = new T.Points(pg, new T.PointsMaterial({ color: 0xf4c430, size: .03, transparent: true, opacity: .6 })); scene.add(pts);

    let spin = 0;
    S.update = (dt, t) => {
      const p = S.p;
      const a = ease(seg(p, 0, .6));
      const z = lerp(-60, 0, a), y = lerp(3, 0, a), x = lerp(-6, 0, a);
      grp.position.set(x, y, z);
      const spd = lerp(18, .25, a);
      spin += spd * dt * (RM ? .1 : 1);
      ball.rotation.set(spin * .4 + .3, spin, .35);
      sh.material.opacity = .5 * a; sh.position.z = z; sh.scale.setScalar(.6 + a * .4);
      const orbit = seg(p, .45, 1) * 1.1 + mouse.sx * .08;
      const R = camera.aspect < .8 ? 9 : 6.5;
      camera.position.set(Math.sin(orbit) * R, .6 + mouse.sy * -.3 + seg(p, .45, 1) * .8, Math.cos(orbit) * R);
      camera.lookAt(0, 0, 0);
      pts.rotation.y = t * .02; rim.intensity = 2 + seg(p, .4, 1) * 2;
    };
    return S;
  }

  /* ======================= TROPHY ======================= */
  function initTrophy() {
    const canvas = document.getElementById("trophyCanvas"); if (!canvas) return null;
    const S = makeScene(canvas, { fov: 30, exposure: 1.05 });
    const { scene, camera, renderer } = S;
    scene.environment = studioEnv(renderer, true);
    const gold = new T.MeshStandardMaterial({ color: 0xe8b93a, metalness: 1, roughness: .22, envMapIntensity: 1.3 });
    const dark = new T.MeshStandardMaterial({ color: 0x1b1b1b, metalness: .4, roughness: .35 });
    const key = new T.SpotLight(0xffe2a0, 0, 30, .5, .6); key.position.set(0, 10, 4); scene.add(key); key.target.position.set(0, 0, 0); scene.add(key.target);
    const fill = new T.PointLight(0xf4c430, 1, 20); fill.position.set(-4, 1, 3); scene.add(fill);

    const tro = new T.Group(); scene.add(tro);
    // profile (x = radius, y = height)
    const prof = [[0, 0], [.95, 0], [.95, .08], [.88, .1], [.62, .14], [.5, .24], [.42, .34], [.2, .46], [.15, .62], [.14, .9], [.18, 1.0], [.26, 1.06], [.14, 1.14], [.13, 1.24], [.3, 1.34],
      [.62, 1.5], [.88, 1.78], [1.02, 2.15], [1.06, 2.55], [1.02, 2.62], [1.1, 2.66], [1.08, 2.7], [.98, 2.66], [.94, 2.55], [.9, 2.2], [.76, 1.86], [.5, 1.6], [0, 1.52]];
    const lathe = new T.LatheGeometry(prof.map(([x, y]) => new T.Vector2(x, y)), MOBILE ? 64 : 128);
    const cup = new T.Mesh(lathe, gold); tro.add(cup);
    // handles
    [-1, 1].forEach(s => {
      const h = new T.Mesh(new T.TorusGeometry(.42, .055, 16, 48, Math.PI * 1.15), gold);
      h.position.set(s * 1.02, 2.1, 0); h.rotation.z = s > 0 ? -Math.PI * .58 : Math.PI * 1.58; tro.add(h);
    });
    // plinth
    const pl = new T.Mesh(new T.BoxGeometry(1.7, .6, 1.7), dark); pl.position.y = -.3; tro.add(pl);
    const pl2 = new T.Mesh(new T.BoxGeometry(1.9, .08, 1.9), gold); pl2.position.y = -.62; tro.add(pl2);
    const band = new T.Mesh(new T.BoxGeometry(1.72, .05, 1.72), gold); band.position.y = -.1; tro.add(band);
    // star finial
    const fin = new T.Mesh(new T.OctahedronGeometry(.16), gold); fin.position.y = 2.95; tro.add(fin);
    tro.position.y = -1.3;

    // particles
    const N = MOBILE ? 90 : 260, pg = new T.BufferGeometry(), pa = new Float32Array(N * 3), sp = new Float32Array(N);
    for (let i = 0; i < N; i++) { const r = 1.5 + Math.random() * 4, a = Math.random() * 6.28; pa[i * 3] = Math.cos(a) * r; pa[i * 3 + 1] = Math.random() * 7 - 3; pa[i * 3 + 2] = Math.sin(a) * r - 1; sp[i] = .1 + Math.random() * .3; }
    pg.setAttribute("position", new T.BufferAttribute(pa, 3));
    const dot = document.createElement("canvas"); dot.width = dot.height = 32; const dg = dot.getContext("2d");
    const rg = dg.createRadialGradient(16, 16, 0, 16, 16, 16); rg.addColorStop(0, "rgba(255,230,150,1)"); rg.addColorStop(1, "rgba(255,200,60,0)"); dg.fillStyle = rg; dg.fillRect(0, 0, 32, 32);
    const pm = new T.PointsMaterial({ size: .09, map: new T.CanvasTexture(dot), transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0 });
    const pts = new T.Points(pg, pm); scene.add(pts);

    let rot = 0;
    S.update = (dt, t) => {
      const p = S.p;
      rot += dt * (RM ? .05 : .22);
      tro.rotation.y = rot + p * Math.PI * 1.2 + mouse.sx * .15;
      tro.position.y = -1.3 + lerp(-1.2, 0, ease(seg(p, 0, .35)));
      const glow = seg(p, .1, .7);
      key.intensity = 30 + glow * 140; fill.intensity = .6 + glow * 1.6;
      gold.envMapIntensity = .9 + glow * .9;
      pm.opacity = .15 + glow * .7;
      const arr = pg.attributes.position.array;
      if (!RM) { for (let i = 0; i < N; i++) { arr[i * 3 + 1] += sp[i] * dt * .4; if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -3; } pg.attributes.position.needsUpdate = true; }
      const narrow = camera.aspect < .8;
      camera.position.set(mouse.sx * .3, .4 - mouse.sy * .2, narrow ? 13 : 9.5 - glow * .6);
      camera.lookAt(0, .1, 0);
    };
    return S;
  }

  window.OPS3D = { book: initBook(), ball: initBall(), trophy: initTrophy(), mouse };
})();
