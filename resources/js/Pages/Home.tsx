import React from 'react';
import SeoHead, { type SeoData } from '../Components/SeoHead';
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
    seo: SeoData;
}

export default function Home({ services = [], projects = [], settings = {}, seo }: HomeProps) {
    return (
        <div className="min-h-screen bg-white text-[#334155] selection:bg-[#155DFC] selection:text-white flex flex-col font-sans">
            <SeoHead seo={seo} />

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
