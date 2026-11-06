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

/* ---------- Cabeçalho: sólido após o topo, some ao descer e volta ao subir ---------- */
const cab = $('[data-cabecalho]');
if (cab) {
  ScrollTrigger.create({
    start: 40,
    end: 'max',
    onToggle: (st) => cab.classList.toggle('solido', st.isActive),
    onUpdate: (st) => {
      const descendo = st.direction === 1 && st.scroll() > 600;
      cab.classList.toggle('oculto', descendo && !document.body.classList.contains('menu-aberto'));
    },
  });
}

/* ---------- Menu móvel ---------- */
const menuBotao = $<HTMLButtonElement>('[data-menu-botao]');
const menu = $('[data-menu]');
function fecharMenu() {
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  menuBotao?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-aberto');
  ScrollTrigger.refresh();
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

/* ---------- Formulário: validação na linha, foco no primeiro erro, estado de envio ---------- */
const form = $<HTMLFormElement>('[data-form]');
if (form) {
  const campos = $$<HTMLInputElement>('input[required]', form);
  const validar = (inp: HTMLInputElement) => {
    const erro = inp.getAttribute('aria-describedby') ? $('#' + inp.getAttribute('aria-describedby')) : null;
    const ok = inp.checkValidity();
    inp.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (erro) erro.textContent = ok ? '' : erro.dataset.erro || '';
    return ok;
  };
  campos.forEach((inp) => {
    inp.addEventListener('blur', () => inp.value && validar(inp));
    inp.addEventListener('input', () => inp.getAttribute('aria-invalid') === 'true' && validar(inp));
    inp.addEventListener('change', () => inp.type === 'checkbox' && validar(inp));
  });
  form.addEventListener('submit', (e) => {
    const invalidos = campos.filter((inp) => !validar(inp));
    if (invalidos.length) {
      e.preventDefault();
      invalidos[0].focus();
      return;
    }
    const botao = $<HTMLButtonElement>('[data-enviar]', form);
    const texto = $('[data-enviar-texto]', form);
    if (botao) botao.disabled = true;
    if (texto) texto.textContent = 'Enviando…';
    dataLayer().push({ event: 'lead_formulario' });
  });
  // Ao voltar pelo histórico, reabilita o botão
  window.addEventListener('pageshow', () => {
    const botao = $<HTMLButtonElement>('[data-enviar]', form);
    const texto = $('[data-enviar-texto]', form);
    if (botao) botao.disabled = false;
    if (texto) texto.textContent = 'Enviar';
  });
}

/* ---------- WhatsApp flutuante: escondido no hero e no contato ---------- */
const wa = $('[data-wa]');
if (wa) {
  const zonas = [$('[data-hero]'), $('#contato')].filter(Boolean) as HTMLElement[];
  const ativas = new Set<HTMLElement>();
  const atualizar = () => wa.classList.toggle('escondido', ativas.size > 0);
  zonas.forEach((z) =>
    ScrollTrigger.create({
      trigger: z,
      start: z.id === 'contato' ? 'top 70%' : 'top bottom',
      end: z.id === 'contato' ? 'bottom top' : 'bottom 40%',
      onToggle: (st) => {
        if (st.isActive) ativas.add(z);
        else ativas.delete(z);
        atualizar();
      },
    }),
  );
  atualizar();
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

  // Revelações ao entrar na tela. IntersectionObserver funciona com qualquer rolagem,
  // inclusive saltos (foco em campo, link direto para âncora).
  const fila: Element[] = [];
  let agendado = false;
  const revelar = () => {
    gsap.to(fila.splice(0), { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08, overwrite: true });
    agendado = false;
  };
  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        fila.push(en.target);
      });
      if (fila.length && !agendado) {
        agendado = true;
        requestAnimationFrame(revelar);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  $$('[data-reveal]').forEach((el) => io.observe(el));

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
        start: 'top top',
        end: () => '+=' + distancia(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
  });

  // Barras de andamento das obras
  $$('[data-progresso]').forEach((el) => {
    gsap.from(el, { scaleX: 0, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
