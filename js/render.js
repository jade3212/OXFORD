/* Renders all data-driven markup from window.OPS */
(function () {
  const D = window.OPS, $ = (s, r = document) => r.querySelector(s);
  const src = k => D.img[k] || k;
  const label = k => k.replace(/\d+$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
  const img = (k, alt, eager) =>
    `<img src="${src(k)}" alt="${alt}" ${eager ? "" : 'loading="lazy"'} decoding="async" data-ph="${label(k)} photo">`;
  window.OPSimg = img;

  /* nav */
  const navP = D.nav.primary.map(n => `<a href="#${n.id}" data-nav="${n.id}">${n.label}</a>`).join("");
  const navS = D.nav.secondary.map(n => `<a href="#${n.id}" data-nav="${n.id}" class="${n.id === "admissions" ? "cta" : ""}">${n.id === "admissions" ? "Apply" : n.label}</a>`).join("");
  $("#navLinks").innerHTML = navP;
  $("#navSec").innerHTML = navS;
  $("#menuLinks").innerHTML = [...D.nav.primary, ...D.nav.secondary]
    .map((n, i) => `<a href="#${n.id}" data-nav="${n.id}"><small>${String(i + 1).padStart(2, "0")}</small>${n.label}</a>`).join("");
  $("#menuFoot").innerHTML = D.school.address.join("<br>") + "<br>" + D.school.phone;

  /* loader */
  const lbl = ["Students", "Campus", "Academics", "Sports", "Events", "Achievements"];
  $("#loaderPhotos").innerHTML = D.loaderPhotos.map((k, i) =>
    `<figure class="loader-ph" data-i="${i}">${img(k, "", true)}<figcaption>${lbl[i]}</figcaption></figure>`).join("");

  /* floating */
  $("#floatSpace").innerHTML = D.floating.map((k, i) =>
    `<figure class="fp" data-i="${i}">${img(k, label(k) + " at Oxford Public School")}</figure>`).join("");

  /* facilities */
  $("#hotspots").innerHTML = D.facilities.map((f, i) =>
    `<button class="hs" style="left:${f.x}%;top:${f.y}%" data-i="${i}" aria-label="Open ${f.name}"><span class="hs-dot"></span><span class="hs-l">${f.name}</span></button>`).join("");

  /* academics index */
  $("#acIndex").innerHTML = D.subjects.map((s, i) => `<li data-i="${i}">${s.name}</li>`).join("");
  $("#acFallback").innerHTML = D.subjects.map(s => `<div><figure>${img(s.img, s.name)}</figure><h3>${s.name}</h3><p>${s.text}</p></div>`).join("");

  /* activities */
  $("#actGrid").innerHTML = D.activities.map((a, i) =>
    `<article class="act ${a.size}" data-speed="${[0.12, -0.18, 0.08, -0.1, 0.16, -0.22, 0.06, -0.14][i]}">
      <span class="no">${String(i + 1).padStart(2, "0")}</span>
      <figure>${img(a.img, a.name + " at Oxford Public School")}</figure>
      <figcaption><h3>${a.name}</h3><span>${a.note}</span></figcaption>
    </article>`).join("");

  /* sports */
  $("#spList").innerHTML = D.sports.map((s, i) =>
    `<button class="sp-row" data-i="${i}">
      <span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${s.name}</h3><p>${s.text}</p><span class="ar">→</span>
      <span class="thumb">${img(s.img, s.name)}</span>
    </button>`).join("");
  $("#spFloat").innerHTML = D.sports.map((s, i) => `<img src="${src(s.img)}" alt="" data-i="${i}" loading="lazy">`).join("");

  /* events */
  $("#evCam").innerHTML = D.events.map((e, i) =>
    `<button class="ev-card" data-i="${i}" aria-label="Open ${e.name}">
      <span class="in">${img(e.img, e.name)}<span class="cap"><h3>${e.name}</h3><span>${e.date}</span></span></span>
    </button>`).join("");
  $("#evList").innerHTML = D.events.map((e, i) => `<li><button data-i="${i}">${e.name}</button></li>`).join("");

  /* achievements */
  const pos = [["l", 8, 34], ["r", 8, 34], ["l", 12, 58], ["r", 12, 58], ["l", 50, 26]];
  $("#achCats").innerHTML = D.achievements.categories.map((c, i) => {
    const [side, x, y] = pos[i];
    const st = i === 4 ? "" : `${side === "l" ? "left" : "right"}:${x}%;top:${y}%`;
    return `<div class="ach-cat ${side === "r" ? "r" : ""} ${i === 4 ? "mid" : ""}" style="${st}"><b>${c.name}</b><span>${c.text}</span></div>`;
  }).join("");
  $("#achStats").innerHTML = D.achievements.stats.map(s =>
    `<div class="ach-stat"><b data-to="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</b><span>${s.label}</span></div>`).join("");

  /* quote */
  const q = D.quote.text.split(" ").map(w => {
    const clean = w.replace(/[^a-z]/gi, "").toLowerCase();
    return `<span class="w">${["fire", "lighting"].includes(clean) ? `<em>${w}</em>` : w}</span>`;
  }).join(" ");
  $("#quoteText").innerHTML = q;
  $("#quoteBy").textContent = "— " + D.quote.by;

  /* gallery */
  const cats = ["All", ...new Set(D.gallery.map(g => g.cat))];
  $("#gFilters").innerHTML = cats.map((c, i) => `<button data-c="${c}" class="${i ? "" : "on"}">${c}</button>`).join("");
  $("#gSpace").innerHTML = D.gallery.map((g, i) =>
    `<button class="g-item" data-i="${i}" data-c="${g.cat}" aria-label="View ${g.caption}">
      <span class="in">${img(g.img, g.caption)}<span class="cap"><span>${g.cat}</span><b>${g.caption}</b></span></span>
    </button>`).join("");

  /* faculty */
  $("#facList").innerHTML = D.faculty.map((f, i) =>
    `<article class="fac">
      <span class="n">${String(i + 1).padStart(2, "0")}</span>
      <div class="fac-id"><h3>${f.name}</h3><span class="role"><b>${f.role}</b> · ${f.subject}</span></div>
      <div class="fac-r"><figure>${img(f.img, "Portrait of " + f.name)}</figure><p>${f.text}</p></div>
    </article>`).join("");
  $("#recTabs").innerHTML = D.students.map((s, i) => `<button data-i="${i}" class="${i ? "" : "on"}">${s.name}</button>`).join("");

  /* admissions */
  const A = D.admissions;
  $("#admStrip").innerHTML = D.gallery.slice(0, 9).map(g => `<figure>${img(g.img, "")}</figure>`).join("");
  $("#steps").innerHTML = `<i class="bar"></i>` + A.steps.map((s, i) =>
    `<li><span class="k"><span>${i + 1}</span></span><h3>${s.t}</h3><p>${s.d}</p></li>`).join("");
  $("#admElig").innerHTML = A.eligibility.map(x => `<li>${x}</li>`).join("");
  $("#admDocs").innerHTML = A.documents.map(x => `<li>${x}</li>`).join("");
  $("#admDates").innerHTML = A.dates.map(x => `<li>${x.label}<b>${x.value}</b></li>`).join("");

  /* contact + footer */
  const addr = D.school.address.join("<br>");
  $("#ctAddr").innerHTML = addr;
  $("#ctPhone").innerHTML = `<a href="tel:${D.school.phone.replace(/\s/g, "")}">${D.school.phone}</a>`;
  $("#ctEmail").innerHTML = `<a href="mailto:${D.school.email}">${D.school.email}</a>`;
  $("#ctMap").innerHTML = `<iframe title="Map — Oxford Public School" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(D.school.mapQuery)}&output=embed"></iframe>`;
  $("#ftNav").innerHTML = ["home", "campus", "academics", "events", "sports", "activities", "achievements", "gallery", "admissions", "contact"]
    .map(id => `<a href="#${id}">${id[0].toUpperCase() + id.slice(1)}</a>`).join("");
  $("#ftAddr").innerHTML = `<p>${addr}</p><p><a href="tel:${D.school.phone.replace(/\s/g, "")}">${D.school.phone}</a></p><p><a href="mailto:${D.school.email}">${D.school.email}</a></p>`;
  $("#ftSoc").innerHTML = D.school.socials.map(s => `<a href="${s.href}">${s.label}</a>`).join("");
  $("#ftYear").textContent = new Date().getFullYear();

  /* placeholder fallback for any missing photo */
  document.querySelectorAll("img[data-ph]").forEach(im => {
    const fail = () => { const p = im.parentElement; p.classList.add("ph"); p.setAttribute("data-label", im.dataset.ph); };
    if (im.complete && im.naturalWidth === 0 && im.src) fail(); else im.addEventListener("error", fail, { once: true });
  });
})();
