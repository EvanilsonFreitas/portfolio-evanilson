import Hero from '../components/home/Hero';
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
  knowsAbout: ['Business Intelligence', 'Data Science', 'Engenharia de Software'],
  sameAs: [site.github, site.linkedin],
};

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(person) }} />
      <Hero />
      <ProjectsPreview />
      <Expertise />
      <EducationPreview />
      <Articles posts={posts} />
      <Contact />
    </>
  );
}
