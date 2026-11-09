/* CEDRO Soluções Empresariais · comportamento do site (sem dependências) */

/* ===== Dados de contato: altere aqui e o site inteiro é atualizado ===== */
const CEDRO = {
  whatsapp: "5584999999999",              // DDI + DDD + número, só dígitos (PROVISÓRIO)
  whatsappLabel: "(84) 9 9999-9999",      // como aparece na tela (PROVISÓRIO)
  email: "contato@cedrosolucoesempresariais.com.br",  // (PROVISÓRIO)
  instagram: "cedrosolucoes",             // sem @ (PROVISÓRIO)
  defaultMessage: "Olá! Vim pelo site da CEDRO e gostaria de falar com um especialista sobre licitações."
};

document.documentElement.classList.remove("no-js");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Cenário: luz ambiente, filtro de refração e barra de progresso ---------- */
(function scene() {
  const amb = document.createElement("div");
  amb.className = "ambient";
  amb.setAttribute("aria-hidden", "true");
  amb.innerHTML =
    '<div class="ambient__grid"></div>' +
    '<div class="ambient__orb ambient__orb--gold"></div>' +
    '<div class="ambient__orb ambient__orb--blue"></div>' +
    '<div class="ambient__orb ambient__orb--teal"></div>' +
    '<div class="ambient__orb ambient__orb--ember"></div>' +
    '<div class="ambient__grain"></div>';
  document.body.prepend(amb);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.innerHTML =
    '<filter id="lg-distort" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise"/>' +
    '<feGaussianBlur in="noise" stdDeviation="2" result="soft"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G"/>' +
    "</filter>";
  document.body.appendChild(svg);

  // Refração real só no Chromium, que suporta filtros SVG em backdrop-filter.
  const brands = (navigator.userAgentData && navigator.userAgentData.brands) || [];
  if (brands.some((b) => /Chromium/.test(b.brand))) document.documentElement.classList.add("lg-refract");

  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);
  if (!CSS.supports("animation-timeline: scroll()")) {
    let t = false;
    const upd = () => {
      t = false;
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    };
    addEventListener("scroll", () => { if (!t) { t = true; requestAnimationFrame(upd); } }, { passive: true });
  }

  // Cabeçalho levemente compacto após rolar
  let s = false;
  const head = () => { s = false; document.body.classList.toggle("is-scrolled", scrollY > 24); };
  addEventListener("scroll", () => { if (!s) { s = true; requestAnimationFrame(head); } }, { passive: true });
  head();
})();

/* ---------- Títulos que sobem palavra por palavra ---------- */
document.querySelectorAll(".hero h1, .page-hero h1").forEach((h) => {
  if (reduced) return;
  const words = h.textContent.trim().split(/\s+/);
  h.setAttribute("aria-label", h.textContent.trim());
  h.textContent = "";
  h.classList.add("words");
  words.forEach((w, i) => {
    const wl = document.createElement("span");
    wl.className = "wl";
    wl.setAttribute("aria-hidden", "true");
    const wi = document.createElement("span");
    wi.className = "wi";
    wi.style.setProperty("--d", i);
    wi.textContent = w;
    wl.appendChild(wi);
    h.appendChild(wl);
    if (i < words.length - 1) h.appendChild(document.createTextNode(" "));
  });
});

/* ---------- Faixa infinita de segmentos ---------- */
document.querySelectorAll(".segments[data-marquee]").forEach((list) => {
  const items = Array.from(list.children);
  list.innerHTML = "";
  list.classList.add("segments--marquee");
  for (let k = 0; k < 2; k++) {
    const track = document.createElement("div");
    track.className = "segments__track";
    if (k === 1) track.setAttribute("aria-hidden", "true");
    items.forEach((li) => track.appendChild(k === 0 ? li : li.cloneNode(true)));
    // repete itens para cobrir telas largas
    items.forEach((li) => { const c = li.cloneNode(true); c.setAttribute("aria-hidden", "true"); track.appendChild(c); });
    list.appendChild(track);
  }
});

/* ---------- Reflexo do vidro seguindo o ponteiro ---------- */
const GLASS = ".glass, .plan, .step, .faq details, .checklist, .contact-panel, .phase, .article-card, .stages, .form-glass, .principle, .pillar, .front, .service-row, .feature-card, .mv > div, .cta-band__inner, .chip";
if (finePointer && !reduced) {
  let last = null, raf = 0, ev = null;
  document.addEventListener("pointermove", (e) => {
    ev = e;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const el = ev.target.closest && ev.target.closest(GLASS);
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
      }
      last = el;
    });
  }, { passive: true });

  /* Inclinação 3D suave nos cartões de plano */
  document.querySelectorAll(".plan, .article-card").forEach((card) => {
    card.classList.add("glass--tilt");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 6).toFixed(2) + "deg) translateY(-6px)";
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });

  /* Botões magnéticos */
  document.querySelectorAll(".btn:not(.btn--block)").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--tx", ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px");
      b.style.setProperty("--ty", ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px");
    });
    b.addEventListener("pointerleave", () => { b.style.setProperty("--tx", "0px"); b.style.setProperty("--ty", "0px"); });
  });

  /* Paralaxe leve da arte do hero */
  const art = document.querySelector(".hero__art");
  if (art) {
    document.addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      art.style.transform = "translate3d(" + (x * -14).toFixed(1) + "px," + (y * -14).toFixed(1) + "px,0)";
    }, { passive: true });
  }
}

/* Escalonamento das revelações: irmãos entram um após o outro */
document.querySelectorAll(".reveal").forEach((el) => {
  const sibs = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
  el.style.setProperty("--i", sibs.indexOf(el));
});
/* Itens de grades revelam em cascata */
document.querySelectorAll(".steps, .plans, .articles, .faq, .checklist, .phases, .principles, .pillars, .fronts, .services").forEach((grid) => {
  Array.from(grid.children).forEach((c, i) => {
    if (!c.classList.contains("reveal")) { c.classList.add("reveal"); c.style.setProperty("--i", i); }
  });
});

/* ---------- Links de contato ---------- */
function waUrl(text) {
  return "https://wa.me/" + CEDRO.whatsapp + "?text=" + encodeURIComponent(text || CEDRO.defaultMessage);
}
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = waUrl(el.getAttribute("data-wa"));
  el.target = "_blank";
  el.rel = "noopener";
});
document.querySelectorAll("[data-email]").forEach((el) => {
  el.href = "mailto:" + CEDRO.email;
  if (!el.textContent.trim()) el.textContent = CEDRO.email;
});
document.querySelectorAll("[data-instagram]").forEach((el) => {
  el.href = "https://instagram.com/" + CEDRO.instagram;
  el.target = "_blank";
  el.rel = "noopener";
  if (!el.textContent.trim()) el.textContent = "@" + CEDRO.instagram;
});
document.querySelectorAll("[data-wa-label]").forEach((el) => { el.textContent = CEDRO.whatsappLabel; });
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

/* ---------- Menu ---------- */
const toggle = document.querySelector(".nav-toggle");
if (toggle) {
  const close = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* Marca a página atual no menu */
(function markCurrent() {
  const here = location.pathname.split("/").pop() || "index.html";
  const section = document.body.getAttribute("data-section"); // ex.: artigos marcam "conteudos.html"
  document.querySelectorAll(".nav__list a").forEach((a) => {
    const target = a.getAttribute("href");
    if (target === here || target === section) a.setAttribute("aria-current", "page");
  });
})();

/* ---------- Revelação ao rolar (uma vez só) ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("is-in");
        // depois da entrada, libera transform/transição para os efeitos de hover
        const wait = 1000 + (parseInt(getComputedStyle(el).getPropertyValue("--i"), 10) || 0) * 90;
        setTimeout(() => el.classList.remove("reveal", "is-in"), wait);
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
}

/* ---------- Frase de assinatura: palavras acendem em ordem ---------- */
document.querySelectorAll("[data-words]").forEach((block) => {
  const goldWords = (block.getAttribute("data-gold") || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const words = block.textContent.trim().split(/\s+/);
  block.textContent = "";
  const spans = words.map((w, i) => {
    const s = document.createElement("span");
    s.className = "w";
    const bare = w.toLowerCase().replace(/[.,;:!?]/g, "");
    if (goldWords.includes(bare)) s.classList.add("gold");
    s.textContent = w;
    block.appendChild(s);
    if (i < words.length - 1) block.appendChild(document.createTextNode(" "));
    return s;
  });
  if (reduced || !("IntersectionObserver" in window)) { spans.forEach((s) => s.classList.add("on")); return; }

  // Uma única escuta de rolagem, limitada por requestAnimationFrame.
  let ticking = false;
  const update = () => {
    ticking = false;
    const trigger = window.innerHeight * 0.72;
    spans.forEach((s) => {
      if (s.getBoundingClientRect().top < trigger) s.classList.add("on");
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { window.addEventListener("scroll", onScroll, { passive: true }); update(); }
      else window.removeEventListener("scroll", onScroll);
    });
  });
  watcher.observe(block);
});

/* ---------- Formulário de contato → WhatsApp ---------- */
const form = document.getElementById("contact-form");
if (form) {
  const status = form.querySelector(".form__status");
  const setError = (field, msg) => {
    const wrap = field.closest(".field");
    const out = wrap.querySelector(".field__error");
    wrap.classList.toggle("has-error", Boolean(msg));
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (out) out.textContent = msg || "";
  };
  const rules = {
    nome: (v) => (v.trim().length < 3 ? "Informe seu nome completo." : ""),
    empresa: (v) => (v.trim().length < 2 ? "Informe o nome da empresa." : ""),
    email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Informe um e-mail válido, como nome@empresa.com.br." : ""),
    telefone: (v) => (v.replace(/\D/g, "").length < 10 ? "Informe um telefone com DDD." : ""),
    interesse: (v) => (!v ? "Escolha o assunto do contato." : "")
  };
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    if (field) field.addEventListener("blur", () => setError(field, rules[name](field.value)));
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstInvalid = null;
    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      const msg = rules[name](field.value);
      setError(field, msg);
      if (msg && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      status.className = "form__status is-error";
      status.textContent = "Revise os campos destacados para enviar sua mensagem.";
      firstInvalid.focus();
      return;
    }
    const f = form.elements;
    const lines = [
      "Olá, CEDRO! Gostaria de falar com um especialista.",
      "",
      "Nome: " + f.nome.value.trim(),
      "Empresa: " + f.empresa.value.trim(),
      f.cidade && f.cidade.value.trim() ? "Cidade/UF: " + f.cidade.value.trim() : "",
      "E-mail: " + f.email.value.trim(),
      "Telefone: " + f.telefone.value.trim(),
      "Assunto: " + f.interesse.value,
      f.mensagem && f.mensagem.value.trim() ? "Mensagem: " + f.mensagem.value.trim() : ""
    ].filter((l, i) => l !== "" || i === 1);
    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
    status.className = "form__status is-ok";
    status.textContent = "Abrimos o WhatsApp com sua mensagem pronta. Se a janela não abriu, escreva para " + CEDRO.email + ".";
  });
}
