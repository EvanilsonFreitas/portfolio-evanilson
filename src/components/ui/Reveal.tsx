'use client';

import { useEffect, useRef } from 'react';

/**
 * Revela o bloco ao entrar na viewport. O conteúdo é renderizado visível no servidor;
 * só blocos abaixo da dobra são ocultados após a hidratação, e nunca com movimento reduzido.
 */
export default function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;
    el.classList.add('reveal-pending');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('reveal');
        requestAnimationFrame(() => el.classList.remove('reveal-pending'));
        io.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
