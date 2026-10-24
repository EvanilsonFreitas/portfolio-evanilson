import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap py-28">
      <p className="eyebrow mb-4">Erro 404</p>
      <h1 className="display text-[clamp(3rem,8vw,6rem)]">Página não encontrada.</h1>
      <p className="mt-6 max-w-lg text-lg text-muted">O endereço pode ter mudado. Os projetos e os artigos estão acessíveis pelo menu.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn">Voltar ao início</Link>
        <Link href="/projetos/" className="btn btn-ghost">Ver projetos</Link>
      </div>
    </div>
  );
}
