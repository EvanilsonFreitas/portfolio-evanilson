import Link from 'next/link';
import Icon from '../ui/Icon';
import SectionHead from '../ui/SectionHead';
import { education } from '../../content/education';

export default function EducationPreview() {
  const [mba, ...others] = education;
  return (
    <section id="formacao" className="section">
      <div className="wrap">
        <SectionHead number="03" label="Formação" title="Base acadêmica em dados e software." />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">{mba.status}</p>
            <p className="display text-[clamp(2.5rem,5.5vw,4.25rem)]">
              {mba.title} <em>{mba.institution}</em>
            </p>
            <p className="mt-6 max-w-xl text-muted">{mba.summary}</p>
          </div>
          <div className="lg:col-span-5">
            <ul className="divide-y divide-rule border-y border-rule">
              {others.map((e) => (
                <li key={e.id} className="py-5">
                  <p className="font-medium">{e.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {[e.institution, e.status].filter(Boolean).join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/educacao/" className="link-arrow mt-8">
              Explorar formação <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
