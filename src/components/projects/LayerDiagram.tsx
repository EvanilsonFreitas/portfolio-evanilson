import Icon from '../ui/Icon';
import type { DiagramLayer } from '../../content/types';

/** Diagrama em camadas: horizontal em telas largas, vertical em telas estreitas. Texto real, sem imagem. */
export default function LayerDiagram({
  layers,
  crosscutting,
  caption,
}: {
  layers: DiagramLayer[];
  crosscutting?: string;
  caption: string;
}) {
  return (
    <figure>
      <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch">
        {layers.map((layer, i) => (
          <li key={layer.title} className="flex flex-1 flex-col items-stretch gap-2 lg:flex-row lg:items-center">
            <div className="flex-1 self-stretch border border-line bg-surface p-4">
              <p className="eyebrow mb-3">{layer.title}</p>
              <ul className="space-y-3">
                {layer.nodes.map((n) => (
                  <li key={n.name}>
                    <p className="text-sm font-medium">{n.name}</p>
                    {n.note && <p className="text-[0.8125rem] text-muted">{n.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
            {i < layers.length - 1 && (
              <span className="flex justify-center text-muted" aria-hidden="true">
                <Icon name="arrow" className="rotate-90 lg:rotate-0" />
              </span>
            )}
          </li>
        ))}
      </ol>
      {crosscutting && (
        <p className="mt-2 border border-dashed border-rule px-4 py-2 text-center text-[0.8125rem] text-muted">{crosscutting}</p>
      )}
      <figcaption className="eyebrow mt-3">{caption}</figcaption>
    </figure>
  );
}
