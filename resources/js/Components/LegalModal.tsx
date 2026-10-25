import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'kvkk' | 'privacy' | null;
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !type) return null;

    const isKvkk = type === 'kvkk';
    const title = isKvkk ? 'KVKK Aydınlatma Metni' : 'Gizlilik Politikası';

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080F20]/80 backdrop-blur-md overflow-hidden"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90dvh] flex flex-col border-2 border-[#DCE3EE] shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-[#DCE3EE] flex items-center justify-between bg-[#F3F6FB]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#DCE3EE] text-[#155DFC] flex items-center justify-center shadow-xs">
                            {isKvkk ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 id="legal-modal-title" className="text-base font-extrabold text-[#080F20]">{title}</h3>
                            <span className="text-[11px] text-[#475569] font-medium">Mehmet Arda Studio Bilgilendirme Metni</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white hover:bg-slate-200/60 border border-[#DCE3EE] text-[#080F20] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Kapat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">
                    {isKvkk ? (
                        <>
                            <p>
                                <strong className="text-[#080F20]">1. Veri Sorumlusu</strong><br />
                                6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, Mehmet Arda Studio olarak veri sorumlusu sıfatıyla kişisel verilerinizi kanuna ve dürüstlük kurallarına uygun olarak işlemekteyiz.
                            </p>
                            <p>
                                <strong className="text-[#080F20]">2. Kişisel Verilerin İşlenme Amacı</strong><br />
                                Web sitemizdeki iletişim formları ve talep kanalları aracılığıyla paylaştığınız ad, soyad, e-posta, telefon ve proje detayları; teklif hazırlama, müşteri ilişkilerini yönetme ve teknik danışmanlık hizmeti sunma amaçlarıyla sınırlı olarak işlenir.
                            </p>
                            <p>
                                <strong className="text-[#080F20]">3. Verilerin Aktarımı</strong><br />
                                İletişim talepleri Formspree aracılığıyla iletilir ve yönetim panelinde arşivlenir. Site Vercel ve Neon altyapısını kullanır; hizmet sağlayıcılar verileri yurt dışında işleyebilir. İsteğe bağlı ziyaret analitiği yalnızca ayrı tercihinizle etkinleşir. Veriler reklam amacıyla satılmaz.
                            </p>
                            <p>
                                <strong className="text-[#080F20]">4. Haklarınız</strong><br />
                                KVKK’nın 11. maddesi kapsamında; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. İletişim: <span className="font-bold text-[#080F20]">mehmetardad068@gmail.com</span>
                            </p>
                        </>
                    ) : (
                        <>
                            <p>
                                <strong className="text-[#080F20]">1. Gizlilik Taahhüdü</strong><br />
                                İzin verdiğinizde sayfa ve bölüm ziyaretleri, iletişim tıklamaları, form gönderiminin teknik sonucu ve uygulama hataları rastgele bir oturum kimliğiyle kaydedilir. Bu izleme kayıtlarına IP adresi, konum, form içeriği, e-posta veya parola eklenmez. Aktif oturum sayısı son beş dakikadaki etkinliğe dayalı bir tahmindir.
                            </p>
                            <p>
                                <strong className="text-[#080F20]">2. Çerezler (Cookies)</strong><br />
                                Oturum ve CSRF çerezleri güvenli çalışma için gereklidir. Ziyaret ölçümü tercihiniz tarayıcının yerel depolamasında 180 gün, rastgele ziyaret kimliği sekme oturumunda tutulur. “Gizlilik tercihleri” düğmesinden izin vermeyebilir veya izninizi geri alarak bu sekmenin kayıtlarının silinmesini isteyebilirsiniz. İsteğe bağlı izleme kayıtları en fazla 30 gün saklanır ve 50.000 olaylık saklama sınırı uygulanır.
                            </p>
                            <p>
                                <strong className="text-[#080F20]">3. Bilgi Güvenliği</strong><br />
                                İletişim formu üzerinden gönderilen tüm veriler SSL şifreleme protokolü ve modern güvenlik standartları ile korunmaktadır.
                            </p>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-5 border-t border-[#DCE3EE] bg-[#F3F6FB] flex justify-end">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#080F20] hover:bg-[#155DFC] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                        Anladım ve Kapat
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
