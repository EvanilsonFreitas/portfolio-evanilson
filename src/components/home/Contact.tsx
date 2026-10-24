import Icon from '../ui/Icon';
import { resumeFiles, site } from '../../content/site';
import { withBasePath } from '../../lib/paths';

const row = 'flex items-center justify-between border-b border-rule py-4 hover:underline underline-offset-4';

export default function Contact() {
  return (
    <section id="contato" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4">05 — Contato</p>
          <h2 className="display text-[clamp(2.5rem,6vw,4.75rem)]">
            Vamos conversar sobre dados, tecnologia <em>e negócios?</em>
          </h2>
        </div>
        <ul className="space-y-1 self-end lg:col-span-5">
          <li>
            <a href={`mailto:${site.email}`} className={row}>
              <span className="inline-flex items-center gap-3"><Icon name="mail" /> {site.email}</span>
              <Icon name="arrow" />
            </a>
          </li>
          <li>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={row}>
              <span className="inline-flex items-center gap-3"><Icon name="linkedin" /> LinkedIn</span>
              <Icon name="arrow" />
            </a>
          </li>
          <li>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className={row}>
              <span className="inline-flex items-center gap-3"><Icon name="github" /> github.com/EvanilsonFreitas</span>
              <Icon name="arrow" />
            </a>
          </li>
          <li className="flex flex-wrap items-center gap-3 pt-6">
            {[resumeFiles.pdf, resumeFiles.docx].map((f) => (
              <a key={f.path} href={withBasePath(f.path)} download className="btn btn-ghost">
                <Icon name="download" /> Currículo {f.label}
              </a>
            ))}
            <a href={withBasePath(resumeFiles.ats.path)} download className="text-base text-muted underline underline-offset-4 hover:text-ink">
              Versão ATS (Word)
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
