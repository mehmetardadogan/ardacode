import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import About from '../Components/About';
import Services from '../Components/Services';
import WhyUs from '../Components/WhyUs';
import Projects from '../Components/Projects';
import Process from '../Components/Process';
import Faq from '../Components/Faq';
import Contact from '../Components/Contact';
import Footer from '../Components/Footer';
import { Service, Project, SiteSettings } from '../types';

interface HomeProps {
    services: Service[];
    projects: Project[];
    settings: SiteSettings;
}

export default function Home({ services = [], projects = [], settings = {} }: HomeProps) {
    const metaTitle = settings.meta_title || 'MEHMET ARDA STUDIO — Premium Web Tasarım ve Yazılım Ajansı';
    const metaDescription = settings.meta_description || 'Mehmet Arda Studio ile markanız için modern web tasarım, güçlü yazılım altyapıları ve özgün dijital deneyimler geliştiriyoruz.';
    const metaKeywords = settings.meta_keywords || 'Mehmet Arda Studio, Mehmet Arda Web Tasarım, Profesyonel Web Tasarım, Kurumsal Web Sitesi Tasarımı, Web Yazılım Hizmetleri';

    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        'name': 'Mehmet Arda Studio',
        'image': 'https://mehmetarda.studio/images/logo.svg',
        'url': 'https://mehmetarda.studio',
        'telephone': settings.phone || '0531 466 89 27',
        'email': settings.email || 'mehmetardad068@gmail.com',
        'priceRange': '$$',
        'founder': {
            '@type': 'Person',
            'name': 'Mehmet Arda',
            'jobTitle': 'Web Developer & Designer',
        },
        'description': metaDescription,
        'sameAs': [
            settings.instagram || 'https://www.instagram.com/mehmetardastudio/',
        ],
        'serviceArea': {
            '@type': 'Country',
            'name': 'Turkey',
        },
        'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Dijital Ajans Hizmetleri',
            'itemListElement': services.map((s, index) => ({
                '@type': 'Offer',
                'itemOffered': {
                    '@type': 'Service',
                    'name': s.title,
                    'description': s.short_description,
                },
                'position': index + 1,
            })),
        },
    };

    return (
        <div className="min-h-screen bg-white text-[#334155] selection:bg-[#155DFC] selection:text-white flex flex-col font-sans">
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta name="author" content="Mehmet Arda" />
                <link rel="canonical" href="https://mehmetarda.studio" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://mehmetarda.studio" />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:image" content="https://mehmetarda.studio/images/logo.svg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content="https://mehmetarda.studio/images/logo.svg" />

                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>

            {/* Navbar */}
            <Navbar siteLogo={settings.site_logo} />

            {/* Main Content Sections */}
            <main className="flex-1">
                {/* Hero Section */}
                <Hero
                    whatsappUrl={settings.whatsapp || 'https://wa.me/905314668927'}
                />

                {/* About Section */}
                <About
                    title={settings.about_title}
                    text={settings.about_text}
                    profileImage={settings.profile_image}
                    instagram={settings.instagram}
                    whatsapp={settings.whatsapp}
                    email={settings.email}
                    phone={settings.phone}
                />

                {/* Services Section (Background: #F3F6FB) */}
                <Services services={services} />

                {/* Why Us Section (Background: White) */}
                <WhyUs />

                {/* Projects Showcase (Background: White) */}
                <Projects projects={projects} />

                {/* Work Process Timeline (Background: Koyu Lacivert #080F20) */}
                <Process />

                {/* Frequently Asked Questions */}
                <Faq />

                {/* Contact Section (Background: #F3F6FB + Blue Gradient Box) */}
                <Contact
                    phone={settings.phone}
                    email={settings.email}
                    instagram={settings.instagram}
                    whatsapp={settings.whatsapp}
                    formspreeEndpoint={settings.formspree_endpoint || 'https://formspree.io/f/xaeeqjdq'}
                    services={services}
                />
            </main>

            {/* Footer */}
            <Footer
                phone={settings.phone}
                email={settings.email}
                instagram={settings.instagram}
                whatsapp={settings.whatsapp}
            />
        </div>
    );
}
