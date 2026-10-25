import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Business from '../components/home/Business';
import ProjectsPreview from '../components/home/ProjectsPreview';
import Expertise from '../components/home/Expertise';
import EducationPreview from '../components/home/EducationPreview';
import Articles from '../components/home/Articles';
import Contact from '../components/home/Contact';
import { getAllPosts } from '../lib/blog';
import { jsonLd } from '../lib/seo';
import { site, siteUrl } from '../content/site';

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.fullName,
  alternateName: site.name,
  url: `${siteUrl}/`,
  address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Universidade Nove de Julho' },
    { '@type': 'CollegeOrUniversity', name: 'USP/ESALQ' },
  ],
  knowsAbout: ['Business Intelligence', 'Inteligência de Negócios', 'Engenharia de Software', 'Data Science', 'SQL Server', 'Integração de sistemas'],
  sameAs: [site.github, site.linkedin],
};

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(person) }} />
      <Hero />
      <About />
      <EducationPreview />
      <Business />
      <Expertise />
      <ProjectsPreview />
      <Articles posts={posts} />
      <Contact />
    </>
  );
}
