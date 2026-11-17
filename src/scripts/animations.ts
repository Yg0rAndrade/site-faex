import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animações globais com GSAP.
 * - [data-reveal]            → aparece subindo ao entrar na tela
 * - [data-reveal="stagger"]  → anima os filhos em sequência
 * - [data-hero-carousel]     → carrossel do banner principal
 */
export function initAnimations() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      const stagger = el.dataset.reveal === 'stagger';
      const targets = stagger ? el.children : el;
      gsap.set(el, { opacity: 1 });
      // Valores finais explícitos + `transition: none` durante a animação: elementos com a
      // classe `transition` do Tailwind (cards) conflitam com o GSAP e ficavam presos em opacity 0.
      // Ao terminar, limpamos os estilos inline para o hover do Tailwind (translate) voltar a funcionar.
      gsap.fromTo(
        targets,
        { y: 40, opacity: 0, transition: 'none' },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          clearProps: stagger ? 'transition,transform,translate,rotate,scale,opacity' : 'transition,transform,translate,rotate,scale',
        },
      );
    });
  });

  document.querySelectorAll<HTMLElement>('[data-hero-carousel]').forEach(initHeroCarousel);
}

function initHeroCarousel(root: HTMLElement) {
  const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', root);
  const dots = gsap.utils.toArray<HTMLButtonElement>('[data-dot]', root);
  if (slides.length === 0) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer: number | undefined;

  gsap.set(slides, { autoAlpha: 0 });
  gsap.set(slides[0], { autoAlpha: 1 });
  animateText(slides[0]);

  function animateText(slide: HTMLElement) {
    if (reduce) return;
    gsap.fromTo(
      slide.querySelectorAll('[data-slide-text] > *'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.2 },
    );
    gsap.fromTo(slide.querySelector('img'), { scale: 1.08 }, { scale: 1, duration: 6, ease: 'none' });
  }

  function go(index: number) {
    if (index === current) return;
    const prev = slides[current];
    const next = slides[index];
    gsap.to(prev, { autoAlpha: 0, duration: reduce ? 0 : 0.8, ease: 'power2.inOut' });
    gsap.to(next, { autoAlpha: 1, duration: reduce ? 0 : 0.8, ease: 'power2.inOut' });
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
    current = index;
    animateText(next);
  }

  function restart() {
    window.clearInterval(timer);
    if (slides.length > 1) timer = window.setInterval(() => go((current + 1) % slides.length), 6000);
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); restart(); }));
  root.querySelector('[data-prev]')?.addEventListener('click', () => { go((current - 1 + slides.length) % slides.length); restart(); });
  root.querySelector('[data-next]')?.addEventListener('click', () => { go((current + 1) % slides.length); restart(); });
  restart();
}
