import Flow from '../diagrams/Flow';
import CommercialDemo from '../demos/CommercialDemo';
import CitiesDemo from '../demos/CitiesDemo';
import OperationsDemo from '../demos/OperationsDemo';
import PricingDemo from '../demos/PricingDemo';
import type { DiagramId } from '../../content/diagrams';
import { statusLabels, type Block } from '../../content/types';

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'p':
            return <p key={i} className="max-w-2xl">{b.text}</p>;
          case 'list':
            return (
              <div key={i}>
                {b.title && <h3 className="eyebrow mb-3">{b.title}</h3>}
                <ul className="space-y-2">
                  {b.items.map((it) => (
                    <li key={it} className="flex max-w-2xl gap-3"><span className="mt-3 h-px w-3 shrink-0 bg-ink" aria-hidden="true" />{it}</li>
                  ))}
                </ul>
              </div>
            );
          case 'table':
            return (
              <div key={i} className="overflow-x-auto" tabIndex={0} role="region" aria-label={`${b.title ?? 'Tabela'}, rolável`}>
                <table className="w-full min-w-[30rem] border-collapse text-sm">
                  <caption className="sr-only">{b.title ?? 'Tabela'}</caption>
                  <thead>
                    <tr className="border-b border-rule text-left">
                      {b.head.map((h) => (
                        <th key={h} scope="col" className="eyebrow py-2 pr-4 font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r[0]} className="border-b border-line align-top">
                        {r.map((c, j) =>
                          j === 0 ? (
                            <th key={j} scope="row" className="py-3 pr-4 text-left font-medium">{c}</th>
                          ) : (
                            <td key={j} className="py-3 pr-4 text-muted">{c}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'code':
            return (
              <figure key={i}>
                <figcaption className="eyebrow mb-2">{b.label}</figcaption>
                <pre className="mono overflow-x-auto border border-line bg-surface2 p-4 text-sm leading-relaxed" tabIndex={0}>
                  <code>{b.source}</code>
                </pre>
                {b.note && <p className="mt-2 text-[0.8125rem] text-muted">{b.note}</p>}
              </figure>
            );
          case 'diagram':
            return <Flow key={i} id={b.id as DiagramId} caption={b.caption} />;
          case 'status':
            return (
              <div key={i}>
                {b.title && <h3 className="eyebrow mb-3">{b.title}</h3>}
                <ul className="border-t border-line">
                  {b.items.map((it) => (
                    <li key={it.label} className="grid gap-1 border-b border-line py-3 sm:grid-cols-12 sm:gap-6">
                      <p className="sm:col-span-6">{it.label}</p>
                      <p className="eyebrow !text-ink sm:col-span-3">{statusLabels[it.status]}</p>
                      {it.note && <p className="text-[0.8125rem] text-muted sm:col-span-3">{it.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          case 'demo':
            return (
              <div key={i}>
                {b.id === 'pricing' && <PricingDemo />}
                {b.id === 'operations' && <OperationsDemo />}
                {b.id === 'commercial' && <CommercialDemo />}
                {b.id === 'cities' && <CitiesDemo />}
              </div>
            );
        }
      })}
    </div>
  );
}
