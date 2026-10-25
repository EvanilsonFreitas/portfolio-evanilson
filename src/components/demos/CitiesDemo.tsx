'use client';

import { useMemo, useState } from 'react';
import { ACCEPT_THRESHOLD, EXAMPLES, matchCity, statusText } from '../../lib/demos/cities';
import { fmtPct } from '../../lib/format';

export default function CitiesDemo() {
  const [text, setText] = useState('S. Paulo');
  const result = useMemo(() => matchCity(text), [text]);

  return (
    <div className="border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface2 px-4 py-2.5 sm:px-6">
        <p className="eyebrow !text-ink">Demonstração determinística</p>
        <p className="text-[0.8125rem] text-muted">Regras e similaridade de texto. Sem aprendizado de máquina.</p>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        <div>
          <label htmlFor="ct-in" className="eyebrow mb-1.5 block">Nome digitado</label>
          <input
            id="ct-in"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full max-w-md border border-line bg-surface px-3"
          />
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Exemplos">
            {EXAMPLES.map((e) => (
              <button key={e} type="button" onClick={() => setText(e)} className="h-9 border border-line px-3 text-sm hover:border-ink">
                {e}
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="grid gap-px border border-line bg-line sm:grid-cols-3">
          <div className="bg-surface p-5">
            <p className="eyebrow">Texto normalizado</p>
            <p className="mono mt-2 break-words">{result.normalized || '—'}{result.uf ? ` · ${result.uf}` : ''}</p>
          </div>
          <div className="bg-surface p-5">
            <p className="eyebrow">Decisão</p>
            <p className="display mt-2 text-3xl">{statusText[result.status]}</p>
            <p className="mt-2 text-[0.8125rem] text-muted">{result.reason}</p>
          </div>
          <div className="bg-surface p-5">
            <p className="eyebrow">Cidade resolvida</p>
            <p className="display mt-2 text-3xl">{result.match ? `${result.match.name} — ${result.match.uf}` : '—'}</p>
            {result.score !== undefined && <p className="mt-2 text-[0.8125rem] text-muted">Similaridade {fmtPct(result.score)}</p>}
          </div>
        </div>

        {result.candidates.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">Melhores candidatos</h4>
            <ul className="divide-y divide-line border-y border-line text-sm">
              {result.candidates.map((c) => (
                <li key={`${c.city.name}-${c.city.uf}`} className="flex justify-between py-2">
                  <span>{c.city.name} — {c.city.uf}</span>
                  <span className="mono">{fmtPct(c.score)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-line pt-4 text-sm text-muted">
          <p className="mb-2 font-medium text-ink">Como decide</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Aceita automaticamente apenas com similaridade igual ou superior a {Math.round(ACCEPT_THRESHOLD * 100)}% e sem empate próximo.</li>
            <li>Casos intermediários vão para revisão manual, em vez de receberem um palpite.</li>
            <li>A lista tem 15 cidades de exemplo e não contém códigos do IBGE.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
