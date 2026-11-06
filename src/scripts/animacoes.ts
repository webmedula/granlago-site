import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const movimento = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

/* ---------- Rolagem suave ---------- */
let lenis: Lenis | null = null;
if (movimento) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Cabeçalho ---------- */
const cab = $('[data-cabecalho]');
let ultimoY = 0;
const aoRolar = () => {
  const y = window.scrollY;
  cab?.classList.toggle('solido', y > 40);
  cab?.classList.toggle('oculto', y > 600 && y > ultimoY && !document.body.classList.contains('menu-aberto'));
  ultimoY = y;
};
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

/* ---------- Menu móvel ---------- */
const menuBotao = $<HTMLButtonElement>('[data-menu-botao]');
const menu = $('[data-menu]');
function fecharMenu() {
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  menuBotao?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-aberto');
  cab?.classList.toggle('solido', window.scrollY > 40);
  lenis?.start();
}
menuBotao?.addEventListener('click', () => {
  if (!menu) return;
  if (!menu.hidden) return fecharMenu();
  menu.hidden = false;
  menuBotao.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-aberto');
  cab?.classList.remove('solido');
  lenis?.stop();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharMenu();
});

// Âncoras internas com rolagem suave e compensação do cabeçalho
$$<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!.replace(/^\//, '');
    const alvo = id.length > 1 ? $(id) : null;
    if (!alvo) return;
    e.preventDefault();
    fecharMenu();
    if (lenis) lenis.scrollTo(alvo as HTMLElement, { offset: -70 });
    else alvo.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', id);
  });
});

/* ---------- Contadores ---------- */
$$('[data-contador]').forEach((el) => {
  const fim = Number(el.dataset.contador);
  if (!movimento) return;
  const obj = { v: 0 };
  el.textContent = '0';
  const noHero = !!el.closest('[data-hero]');
  gsap.to(obj, {
    v: fim,
    duration: 2,
    ease: 'power3.out',
    delay: noHero ? 1 : 0,
    scrollTrigger: noHero ? undefined : { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => {
      el.textContent = Math.round(obj.v).toString();
    },
  });
});

/* ---------- Formulário: máscara de telefone ---------- */
$$<HTMLInputElement>('[data-mascara-telefone]').forEach((inp) => {
  inp.addEventListener('input', () => {
    const d = inp.value.replace(/\D/g, '').slice(0, 11);
    let v = d;
    if (d.length > 2) v = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 7) v = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
    inp.value = v;
  });
});

/* ---------- Eventos para o GTM ---------- */
const dataLayer = () => ((window as any).dataLayer ||= []) as unknown[];
$$('[data-evento]').forEach((el) =>
  el.addEventListener('click', () => dataLayer().push({ event: 'clique_cta', cta: el.dataset.evento })),
);
$('[data-form]')?.addEventListener('submit', () => dataLayer().push({ event: 'lead_formulario' }));

/* ---------- WhatsApp flutuante: some no hero e no contato ---------- */
const wa = $('[data-wa]');
if (wa) {
  const hero = $('[data-hero]');
  const contato = $('#contato');
  const atualizarWa = () => {
    const noHero = hero ? window.scrollY < hero.offsetHeight * 0.6 : false;
    const r = contato?.getBoundingClientRect();
    const noContato = r ? r.top < window.innerHeight * 0.6 && r.bottom > 0 : false;
    wa.classList.toggle('escondido', noHero || noContato);
  };
  window.addEventListener('scroll', atualizarWa, { passive: true });
  atualizarWa();
}

/* ---------- Galeria com lightbox ---------- */
const dlg = $<HTMLDialogElement>('[data-lightbox-dialog]');
if (dlg) {
  const img = $<HTMLImageElement>('[data-lightbox-img]', dlg)!;
  const fotos = $$<HTMLButtonElement>('[data-lightbox]');
  let atual = 0;
  const mostrar = (i: number) => {
    atual = (i + fotos.length) % fotos.length;
    img.src = fotos[atual].dataset.lightbox!;
    img.alt = fotos[atual].querySelector('img')?.alt ?? '';
  };
  fotos.forEach((b, i) =>
    b.addEventListener('click', () => {
      mostrar(i);
      dlg.showModal();
      lenis?.stop();
    }),
  );
  $('[data-lightbox-fechar]', dlg)?.addEventListener('click', () => dlg.close());
  $('[data-lightbox-ant]', dlg)?.addEventListener('click', () => mostrar(atual - 1));
  $('[data-lightbox-prox]', dlg)?.addEventListener('click', () => mostrar(atual + 1));
  dlg.addEventListener('close', () => lenis?.start());
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
  });
}

/* ================= Animações (só com movimento permitido) ================= */
if (movimento) {
  // Título do hero: palavra por palavra subindo de dentro de uma máscara
  $$('[data-split]').forEach((el) => {
    const palavras = el.textContent!.trim().split(/\s+/);
    el.innerHTML = palavras
      .map(
        (p) =>
          '<span class="split-w" style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:0.1em;margin-bottom:-0.1em"><span style="display:inline-block">' +
          p +
          '</span></span>',
      )
      .join(' ');
    gsap.from($$('.split-w > span', el), { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.06, delay: 0.2 });
  });

  gsap.from('[data-hero-item]', { opacity: 0, y: 30, duration: 1.2, ease: 'power3.out', stagger: 0.12, delay: 0.6 });

  const heroMidia = $('[data-hero-midia]');
  if (heroMidia) {
    gsap.fromTo(heroMidia, { scale: 1.18 }, { scale: 1, duration: 2.4, ease: 'power2.out' });
    gsap.to(heroMidia, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // Revelações genéricas ao rolar
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1, overwrite: true }),
  });

  // Manifesto: palavras acendem conforme a rolagem
  $$('[data-palavras]').forEach((el) => {
    const palavras = el.textContent!.trim().split(/\s+/);
    el.innerHTML = palavras.map((p) => '<span class="palavra">' + p + '</span>').join(' ');
    gsap.to($$('.palavra', el), {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  });

  // Parallax de imagens
  $$('[data-parallax]').forEach((el) => {
    const forca = Number(el.dataset.parallax);
    const img = el.querySelector('img');
    const st = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo(el, { yPercent: -forca / 2 }, { yPercent: forca / 2, ease: 'none', scrollTrigger: st });
    if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { ...st } });
  });

  // Tour: fundo em parallax
  const tourMidia = $('[data-tour-midia]');
  if (tourMidia) {
    gsap.fromTo(
      tourMidia,
      { yPercent: -8 },
      { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#tour', start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  }

  // Lazer: rolagem horizontal fixada (desktop)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const trilho = $('[data-lazer-trilho]');
    const pin = $('[data-lazer-pin]');
    if (!trilho || !pin) return;
    const distancia = () => trilho.scrollWidth - window.innerWidth;
    gsap.to(trilho, {
      x: () => -distancia(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top+=40',
        end: () => '+=' + distancia(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
    gsap.to('[data-lazer-progresso]', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: pin, start: 'top top+=40', end: () => '+=' + distancia(), scrub: true },
    });
  });

  // Barras de andamento das obras
  $$('[data-progresso]').forEach((el) => {
    gsap.from(el, { scaleX: 0, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
