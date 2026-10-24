'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Endereço antigo: leva ao projeto atual e mantém um link visível caso o script não rode. */
export default function LegacyRedirect({ to, title }: { to: string; title: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/projetos/${to}/`);
  }, [router, to]);
  return (
    <div className="wrap py-24">
      <p className="eyebrow mb-4">Endereço atualizado</p>
      <h1 className="display text-5xl">Este conteúdo mudou de lugar.</h1>
      <p className="mt-6 max-w-xl text-muted">
        O projeto antigo foi substituído por um estudo com a natureza correta e dados verificáveis.
      </p>
      <Link href={`/projetos/${to}/`} className="btn mt-8">
        Ir para {title}
      </Link>
    </div>
  );
}
