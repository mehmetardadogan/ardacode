import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone,
    Mail,
    Send,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Sparkles,
    ShieldCheck,
    Loader2,
} from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './Icons';
import { Service } from '../types';
import LegalModal from './LegalModal';
import { trackEvent, csrfHeaders } from '../lib/telemetry';

interface ContactProps {
    phone?: string;
    email?: string;
    instagram?: string;
    whatsapp?: string;
    formspreeEndpoint?: string;
    services?: Service[];
}

export default function Contact({
    phone = '0531 466 89 27',
    email = 'mehmetardad068@gmail.com',
    instagram = 'https://www.instagram.com/mehmetardastudio/',
    whatsapp = 'https://wa.me/905314668927',
    formspreeEndpoint = 'https://formspree.io/f/xaeeqjdq',
    services = [],
}: ContactProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'Web Tasarım',
        message: '',
        kvkk_consent: false,
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [legalModalOpen, setLegalModalOpen] = useState(false);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Lütfen adınızı ve soyadınızı belirtin.';
        } else if (formData.name.trim().length < 3) {
            errors.name = 'Ad Soyad en az 3 karakter olmalıdır.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = 'Lütfen e-posta adresinizi girin.';
        } else if (!emailRegex.test(formData.email.trim())) {
            errors.email = 'Lütfen geçerli bir e-posta formatı giriniz.';
        }

        if (!formData.message.trim()) {
            errors.message = 'Lütfen projeniz hakkında kısa bir açıklama yazın.';
        } else if (formData.message.trim().length < 10) {
            errors.message = 'Proje detayları en az 10 karakter olmalıdır.';
        }

        if (!formData.kvkk_consent) {
            errors.kvkk_consent = 'KVKK aydınlatma metnini onaylamanız gerekmektedir.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        setStatusMessage(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        const attempt_identifier = crypto.randomUUID();
        trackEvent('form_started', { attempt_identifier });

        try {
            const endpoint = formspreeEndpoint || 'https://formspree.io/f/xaeeqjdq';

            // 1. Formspree API Request
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || 'Belirtilmedi',
                    service: formData.service,
                    message: formData.message,
                    kvkk_consent: 'Onaylandı',
                }),
            });

            const data = await response.json().catch(() => ({}));
            trackEvent('form_response', { http_status: response.status, attempt_identifier });

            if (response.ok) {
                trackEvent('form_accepted', { http_status: response.status, attempt_identifier });
                // Also asynchronously backup into local database for admin archive
                try {
                    const archiveResponse = await fetch('/iletisim', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            ...csrfHeaders(),
                        },
                        body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            service: formData.service,
                            details: formData.message,
                        }),
                    });
                    if (!archiveResponse.ok) trackEvent('api_failed', { http_status: archiveResponse.status, attempt_identifier });
                } catch {
                    trackEvent('api_failed', { attempt_identifier });
                    // Local backup failure won't block Formspree success
                }

                setStatusMessage({
                    type: 'success',
                    text: 'Formspree mesajınızı kabul etti. Mehmet Arda Studio ile iletişime geçtiğiniz için teşekkür ederiz. En kısa sürede size dönüş yapacağız.',
                });

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: 'Web Tasarım',
                    message: '',
                    kvkk_consent: false,
                });
                setFormErrors({});
            } else {
                trackEvent('form_failed', { http_status: response.status, attempt_identifier });
                let errorMessage = 'Mesajınız iletilirken bir sorun oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin veya doğrudan WhatsApp üzerinden bize ulaşın.';
                if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                    errorMessage = data.errors.map((err: any) => err.message).join(', ');
                }
                setStatusMessage({
                    type: 'error',
                    text: errorMessage,
                });
            }
        } catch (err: any) {
            trackEvent('form_failed', { attempt_identifier });
            setStatusMessage({
                type: 'error',
                text: 'Ağ bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edin veya WhatsApp üzerinden iletişime geçin.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="iletisim" className="py-28 bg-[#F3F6FB] border-t border-[#DCE3EE] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#155DFC]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="max-w-3xl mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DCE3EE] text-[#155DFC] text-xs font-bold shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Fikirlerinizi Paylaşın</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080F20] tracking-tight">
                        Harika Bir Projeniz mi Var? Birlikte Hayata Geçirelim.
                    </h2>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-medium">
                        Yeni bir web sitesi veya özel yazılım çözümü için bizimle iletişime geçin, projenizi birlikte planlayalım.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Column: Blue Gradient CTA Banner & Direct Channels */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Gradient Box */}
                        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#080F20] via-[#0F172A] to-[#155DFC] text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-6">
                            <div className="space-y-2">
                                <span className="text-xs font-extrabold text-[#60A5FA] uppercase tracking-wider block">
                                    Hızlı Dönüş Garantisi
                                </span>
                                <h3 className="text-2xl font-black tracking-tight leading-snug text-white">
                                    Projenizi Dijital Dünyanın Önüne Taşıyın.
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                                    İhtiyaçlarınıza en uygun teknoloji yığınını ve tasarım dilini belirlemek için bize dilediğiniz kanaldan ulaşabilirsiniz.
                                </p>
                            </div>

                            {/* Direct WhatsApp CTA Button */}
                            <a
                                href={whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                            >
                                <WhatsAppIcon className="w-5 h-5 text-white" />
                                <span>WhatsApp'tan Doğrudan Yazın</span>
                                <ArrowUpRight className="w-4 h-4 ml-auto" />
                            </a>

                            {/* Contact Badges */}
                            <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                                <a
                                    href={`tel:${phone.replace(/\s+/g, '')}`}
                                    className="flex items-center gap-3.5 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
                                >
                                    <Phone className="w-4 h-4 text-[#60A5FA]" />
                                    <span className="font-bold">{phone}</span>
                                </a>

                                <a
                                    href={`mailto:${email}`}
                                    className="flex items-center gap-3.5 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
                                >
                                    <Mail className="w-4 h-4 text-[#60A5FA]" />
                                    <span className="font-bold truncate">{email}</span>
                                </a>

                                <a
                                    href={instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3.5 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
                                >
                                    <InstagramIcon className="w-4 h-4 text-rose-400" />
                                    <span className="font-bold">@mehmetardastudio</span>
                                </a>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#DCE3EE] flex items-center gap-3.5 shadow-2xs">
                            <ShieldCheck className="w-6 h-6 text-[#155DFC] shrink-0" />
                            <div className="text-xs text-[#334155] leading-relaxed">
                                <span className="font-bold text-[#080F20] block">KVKK & Gizlilik Güvencesi</span>
                                Paylaşılan tüm proje bilgileri gizlilik sözleşmesi kapsamında güvenle korunur.
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Modern High-Contrast Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl border-2 border-[#DCE3EE] p-6 sm:p-8 md:p-10 shadow-lg relative">
                            
                            {/* Alert Notifications */}
                            <AnimatePresence>
                                {statusMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`mb-6 p-4 rounded-2xl border-2 flex items-start gap-3 ${
                                            statusMessage.type === 'success'
                                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                                : 'bg-rose-50 border-rose-300 text-rose-950'
                                        }`}
                                    >
                                        {statusMessage.type === 'success' ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                        )}
                                        <div className="text-xs font-semibold leading-relaxed">
                                            {statusMessage.text}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#080F20]">
                                            Ad Soyad <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                                            }}
                                            placeholder="Örn: Burak Yılmaz"
                                            className={`w-full px-4 py-3 rounded-xl border-2 text-xs font-medium text-[#080F20] focus:ring-2 focus:ring-[#155DFC] focus:border-[#155DFC] focus:outline-hidden transition-all ${
                                                formErrors.name ? 'border-rose-300 bg-rose-50/30' : 'border-[#DCE3EE] bg-[#F3F6FB]'
                                            }`}
                                        />
                                        {formErrors.name && (
                                            <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                <span>{formErrors.name}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#080F20]">
                                            E-posta Adresi <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value });
                                                if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                                            }}
                                            placeholder="ornek@sirketiniz.com"
                                            className={`w-full px-4 py-3 rounded-xl border-2 text-xs font-medium text-[#080F20] focus:ring-2 focus:ring-[#155DFC] focus:border-[#155DFC] focus:outline-hidden transition-all ${
                                                formErrors.email ? 'border-rose-300 bg-rose-50/30' : 'border-[#DCE3EE] bg-[#F3F6FB]'
                                            }`}
                                        />
                                        {formErrors.email && (
                                            <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                <span>{formErrors.email}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#080F20]">
                                            Telefon Numarası
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="05XX XXX XX XX"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#DCE3EE] bg-[#F3F6FB] text-xs font-medium text-[#080F20] focus:ring-2 focus:ring-[#155DFC] focus:border-[#155DFC] focus:outline-hidden transition-all"
                                        />
                                    </div>

                                    {/* Service */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#080F20]">
                                            İlgilendiğiniz Hizmet
                                        </label>
                                        <select
                                            name="service"
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#DCE3EE] bg-[#F3F6FB] text-xs font-bold text-[#080F20] focus:ring-2 focus:ring-[#155DFC] focus:border-[#155DFC] focus:outline-hidden transition-all cursor-pointer"
                                        >
                                            <option value="Web Tasarım">Web Tasarım</option>
                                            <option value="Web Yazılım">Web Yazılım</option>
                                            <option value="E-Ticaret Çözümleri">E-Ticaret Çözümleri</option>
                                            <option value="UI/UX Tasarım">UI/UX Tasarım</option>
                                            <option value="Grafik ve Marka Tasarımı">Grafik ve Marka Tasarımı</option>
                                            <option value="SEO ve Performans Optimizasyonu">SEO ve Performans Optimizasyonu</option>
                                            <option value="Danışmanlık">Danışmanlık & Diğer</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#080F20]">
                                        Proje Detayları & Açıklama <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        name="message"
                                        value={formData.message}
                                        onChange={(e) => {
                                            setFormData({ ...formData, message: e.target.value });
                                            if (formErrors.message) setFormErrors({ ...formErrors, message: '' });
                                        }}
                                        placeholder="Projenizin hedefleri, mevcut siteniz (varsa), tasarım beklentileriniz veya merak ettikleriniz..."
                                        className={`w-full px-4 py-3 rounded-xl border-2 text-xs font-medium text-[#080F20] focus:ring-2 focus:ring-[#155DFC] focus:border-[#155DFC] focus:outline-hidden transition-all resize-none ${
                                            formErrors.message ? 'border-rose-300 bg-rose-50/30' : 'border-[#DCE3EE] bg-[#F3F6FB]'
                                        }`}
                                    />
                                    {formErrors.message && (
                                        <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{formErrors.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* KVKK Consent Checkbox */}
                                <div className="space-y-1.5 pt-1">
                                    <label className="flex items-start gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            name="kvkk_consent"
                                            checked={formData.kvkk_consent}
                                            onChange={(e) => {
                                                setFormData({ ...formData, kvkk_consent: e.target.checked });
                                                if (formErrors.kvkk_consent) setFormErrors({ ...formErrors, kvkk_consent: '' });
                                            }}
                                            className="mt-0.5 rounded border-[#DCE3EE] text-[#155DFC] focus:ring-[#155DFC] w-4 h-4 cursor-pointer"
                                        />
                                        <span className="text-xs text-[#475569] leading-snug">
                                            <button
                                                type="button"
                                                onClick={() => setLegalModalOpen(true)}
                                                className="text-[#155DFC] font-bold underline hover:text-[#0047D4] cursor-pointer"
                                            >
                                                KVKK Aydınlatma Metni
                                            </button>
                                            'ni okudum, kişisel verilerimin teklif ve iletişim amacıyla işlenmesini onaylıyorum. <span className="text-rose-500">*</span>
                                        </span>
                                    </label>
                                    {formErrors.kvkk_consent && (
                                        <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 pl-7">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{formErrors.kvkk_consent}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-6 rounded-full bg-[#155DFC] hover:bg-[#0047D4] disabled:bg-blue-300 text-white font-extrabold text-xs flex items-center justify-center gap-2.5 shadow-xl shadow-[#155DFC]/25 hover:shadow-2xl hover:shadow-[#155DFC]/35 transition-all duration-200 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                            <span>Formspree ile İletiliyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Mesajı Gönder (Formspree)</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {/* KVKK Modal */}
            <LegalModal
                isOpen={legalModalOpen}
                onClose={() => setLegalModalOpen(false)}
                type="kvkk"
            />
        </section>
    );
}
