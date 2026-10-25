import type { Metadata } from 'next';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import CatalogBrowser from '../../components/catalog/CatalogBrowser';
import { catalog } from '../../content/catalog';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Projetos',
  description:
    'Catálogo de projetos: BI comercial e operacional, Excel e automação, SQL e engenharia de dados, software, integrações e processos. Cada projeto é independente e tem página própria.',
  path: '/projetos/',
});

export default function ProjetosPage() {
  return (
    <div className="wrap pb-24 pt-12">
      <Breadcrumbs items={[{ label: 'Projetos' }]} />
      <p className="eyebrow mb-4">Catálogo</p>
      <h1 className="display mb-6 text-[clamp(2.75rem,7vw,5.5rem)]">Projetos.</h1>
      <p className="mb-4 max-w-2xl text-lg text-muted">
        Soluções de business intelligence, automação, dados e software. Os projetos são independentes entre si: cada um tem contexto, tecnologias e evidências próprios.
      </p>
      <p className="mb-12 max-w-2xl text-muted">
        Cada item indica sua natureza: projeto corporativo, projeto autoral, demonstração com dados sintéticos, material analítico ou estudo técnico. As capturas de tela são as fornecidas pelo autor, com os dados confidenciais já tratados na origem.
      </p>
      <CatalogBrowser entries={catalog} />
    </div>
  );
}
