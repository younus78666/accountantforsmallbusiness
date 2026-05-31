import React, { useState, useEffect } from 'react';

const TESTIMONIALS = [
  { quote: "Switching to Account for Small Business LTD was seamless. Mehdi solved our multi-currency Shopify payout reconciliation in the first week. We save over 20 hours a month on bank matching.", name: "Winston Tan", company: "Decant Media Pte Ltd", badge: "E-Commerce & Retail" },
  { quote: "The fixed flat-rate pricing is completely honest. For years we got bills for every extra email or question at other firms. Mehdi gives direct, qualified answers under one transparent price.", name: "Aisha Mohamed", company: "Blue Sky Learning Center", badge: "Education Academy" },
  { quote: "Having a dedicated named Financial Controller reviewing our books remotely has given us extraordinary confidence during our statutory ACRA and IRAS filings. Highly structural!", name: "Nigel Goh", company: "Vortex Logistics Service", badge: "Logistics SME" },
  { quote: "Managing our payroll and CPF submissions every month has been flawless. The flat pricing and zero transition fees made switching our books incredibly simple.", name: "Saira Banu", company: "Prism Creative Hub", badge: "Creative Services" },
  { quote: "Reconciling our raw POS sales with Shopify bank payouts is usually a nightmare. They handled the ledger mapping on Xero seamlessly with zero downtime.", name: "Lee Wei Jie", company: "Fresco Grocery Retail", badge: "Retail Niche" },
  { quote: "Our previous agency always billed us for every single email. Mehdi's transparent model helps us project overheads accurately and keeps statutory books spotless.", name: "Vikram Nair", company: "Soma BioTech Pte Ltd", badge: "Life-Sciences Tech" },
  { quote: "They took over our chaotic Excel ledger files and produced SFRS-compliant unaudited accounts ready for our AGM submission within 5 working days.", name: "Sarah Lim", company: "Design Canvas SG", badge: "Consultancy Studio" },
  { quote: "As a sole proprietor, keeping up with transactions after long field hours was exhausting. The Starter Plan handles everything and keeps IRAS happy.", name: "Muhammad Syamil", company: "Impulse Security Group", badge: "Security & Ops" },
  { quote: "Expert multi-channel matching with WooCommerce and international Stripe transactions. Exceptionally clean monthly cash flow statements.", name: "Kimberly Seah", company: "Chrono Jewelry", badge: "Luxury Retail" },
  { quote: "Their remote bookkeeping team took over our complex accounts receivables ledger, helping us reconcile aged invoices and improve working capital.", name: "Kenneth Koh", company: "Nortec Engineering", badge: "Infrastructure SME" },
  { quote: "Flat rate pricing with absolutely zero mystery charges. Fantastic advisory support on our quarterly CPF board contributions and software linkages.", name: "Nurul Huda", company: "Dapur Melayu Catering", badge: "F&B Operator" },
  { quote: "Having pristine, live cash-flow representations inside QuickBooks Online has given our directors immense confidence during executive board meetings.", name: "Jonathan d'Almeida", company: "Maritime Solutions Co", badge: "Maritime Shipping" },
  { quote: "Incredible speed in monthly closes. Generally, our draft ledgers are completed and ready for review within 4 business days after the month ends.", name: "Rachel Wang", company: "Aether Venture Partners", badge: "Venture Capital" },
  { quote: "Truly outstanding client support. Mehdi answered all our intricate depreciation questions directly and set up our asset registries flawlessly.", name: "Ramesh Kumar", company: "Lotus Wellness Spa", badge: "Wellness SME" },
  { quote: "Transitioning our ledger from our previous local accounting firm was entirely stress-free. They managed the direct transfer of records smoothly.", name: "Valerie Heng", company: "Bloom Floral Atelier", badge: "E-Commerce Retail" },
  { quote: "Our former bookkeeping was a total mystery. Now, with monthly management reports uploaded to our cloud folder, we understand our actual cash overheads.", name: "Firdaus Ibrahim", company: "Crestway Logistics", badge: "Logistics SME" },
  { quote: "Excellent consults on cloud tooling integration. The growth plan is optimized perfectly for our active transaction thresholds.", name: "Chloe Low", company: "Apex Tech Labs", badge: "SaaS & Software" },
  { quote: "Immaculate financial reports and absolute compliance. High-caliber remote controller expertise at a highly competitive flat rate.", name: "Devadas Pillay", company: "Pillay Law Chambers", badge: "Professional Legal" },
  { quote: "Their automated payables reconciliation keeps our landlord billing and operating overheads synchronized with zero manual entry errors.", name: "Gerald Lim", company: "Vesta Real Estate Owners", badge: "SME Real Estate" },
  { quote: "Remarkable service catering specifically to Singapore e-commerce sellers. Handled all Shopee multi-currency ledger adjustments with ease.", name: "Michelle Chen", company: "Lumine Apparel Shop", badge: "E-Commerce Apparel" },
];

export default function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const card = (offset: number) => TESTIMONIALS[(idx + offset) % TESTIMONIALS.length];

  return (
    <section className="bg-[#030D1B] py-20 border-b border-gray-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono text-[#DAA035] uppercase tracking-widest font-bold block">Social Proof</span>
          <h2 className="text-3xl sm:text-4xl font-sans text-white font-extrabold tracking-tight">
            Trusted by 20+ Singapore SME Leaders
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Hear from real-world Singapore founders, creatives, and retail operators who transitioned their books to Account for Small Business LTD.
          </p>
        </div>

        <div className="relative">
          {/* Arrows */}
          <button
            onClick={() => setIdx((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="absolute top-[40%] -left-12 -translate-y-1/2 z-20 hidden lg:flex w-10 h-10 rounded-full bg-gray-900/80 border border-gray-800 text-[#DAA035] hover:bg-[#DAA035] hover:text-[#000F22] items-center justify-center transition-all shadow-md"
            aria-label="Previous testimonial"
          >
            &larr;
          </button>
          <button
            onClick={() => setIdx((p) => (p + 1) % TESTIMONIALS.length)}
            className="absolute top-[40%] -right-12 -translate-y-1/2 z-20 hidden lg:flex w-10 h-10 rounded-full bg-gray-900/80 border border-gray-800 text-[#DAA035] hover:bg-[#DAA035] hover:text-[#000F22] items-center justify-center transition-all shadow-md"
            aria-label="Next testimonial"
          >
            &rarr;
          </button>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {[0, 1, 2].map((offset) => {
              const item = card(offset);
              const hidden = offset === 1 ? 'hidden md:flex' : offset === 2 ? 'hidden lg:flex' : 'flex';
              return (
                <div
                  key={`${idx}-${offset}`}
                  className={`${hidden} bg-[#0A1628] border border-gray-800 p-6 rounded-2xl flex-col justify-between shadow-lg h-[260px] transition-all duration-300 hover:border-[#DAA035]/30`}
                >
                  <p className="text-xs sm:text-sm text-[#CBCFD8] italic leading-relaxed mb-6 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    "{item.quote}"
                  </p>
                  <div className="border-t border-gray-800 pt-4 flex items-center justify-between mt-auto">
                    <div>
                      <span className="block text-xs font-bold text-white">{item.name}</span>
                      <span className="block text-[10px] text-gray-400 font-mono">{item.company}</span>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2.5 py-1 rounded inline-block font-mono">
                      {item.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile buttons */}
          <div className="flex justify-center gap-4 mt-6 lg:hidden">
            <button
              onClick={() => setIdx((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="bg-gray-900 border border-gray-800 text-[#DAA035] py-2 px-4 rounded-xl text-xs font-bold font-mono"
            >
              &larr; Prev
            </button>
            <button
              onClick={() => setIdx((p) => (p + 1) % TESTIMONIALS.length)}
              className="bg-gray-900 border border-gray-800 text-[#DAA035] py-2 px-4 rounded-xl text-xs font-bold font-mono"
            >
              Next &rarr;
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center flex-wrap gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${idx === i ? 'bg-[#DAA035] scale-125' : 'bg-gray-700 hover:bg-gray-600'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
