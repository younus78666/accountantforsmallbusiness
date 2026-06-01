import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, ArrowLeft, Send, Loader2, Tag, CheckCircle } from 'lucide-react';

type Mode = 'quote' | 'exit';
type Step = 1 | 2 | 3;

const SESSION_KEY   = 'afsb_popup_shown';
const DISCOUNT_KEY  = 'afsb_discount_shown';
const WORKER_URL    = 'https://form.accountantforsmallbusiness.com/contact';

export default function FormPopup() {
  const [open, setOpen]             = useState(false);
  const [mode, setMode]             = useState<Mode>('quote');
  const [step, setStep]             = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');

  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [business, setBusiness]     = useState('');
  const [transactions, setTransactions] = useState('under 30');
  const [employees, setEmployees]   = useState('0');
  const [message, setMessage]       = useState('');

  const handleOpenQuote = useCallback(() => {
    setMode('quote');
    setOpen(true);
    sessionStorage.setItem(SESSION_KEY, '1');
  }, []);

  const handleExitIntent = useCallback(() => {
    if (sessionStorage.getItem(DISCOUNT_KEY)) return;
    sessionStorage.setItem(DISCOUNT_KEY, '1');
    setMode('exit');
    setOpen(true);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-popup="quote"]');
      if (target) {
        e.preventDefault();
        handleOpenQuote();
      }
    };
    document.addEventListener('click', handler);

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(DISCOUNT_KEY)) {
        handleExitIntent();
      }
    };
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [handleOpenQuote, handleExitIntent]);

  const close = () => {
    setOpen(false);
    setStep(1);
    setError('');
  };

  const validate1 = () => {
    if (!name.trim() || !email.trim() || !business.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const next = () => {
    if (step === 1 && !validate1()) return;
    setError('');
    setStep((p) => (p + 1) as Step);
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:                 name.trim(),
          email:                email.trim(),
          business:             business.trim(),
          monthly_transactions: transactions,
          employees_on_payroll: employees,
          message:              message.trim() || '',
          source: mode === 'exit'
            ? 'Exit Intent Popup (10% Discount)'
            : 'Quote Popup',
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = '/thank-you/';
        }, 1200);
      } else {
        setError(json.error || 'Submission failed. Please email accforsmes@gmail.com directly.');
      }
    } catch {
      setError('Network error. Please email accforsmes@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  // Success state (brief flash before redirect)
  if (submitted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#000F22]/80 backdrop-blur-sm" />
        <div className="relative w-full max-w-sm bg-[#0A1628] border border-[#DAA035]/50 rounded-2xl shadow-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#DAA035]/15 border border-[#DAA035]/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-[#DAA035]" />
          </div>
          <h3 className="text-xl font-serif text-white font-bold mb-2">Request Received!</h3>
          <p className="text-sm text-[#CBCFD8]">A confirmation email is on its way to {email}</p>
          <p className="text-xs text-gray-600 mt-3 font-mono">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#000F22]/80 backdrop-blur-sm" onClick={close} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0A1628] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-800">
          <div>
            {mode === 'exit' ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-[#DAA035]" />
                  <span className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest">Exclusive Offer</span>
                </div>
                <h2 className="text-xl font-serif text-[#FEFFFF] font-bold">Before you go...</h2>
                <p className="text-sm text-[#CBCFD8] mt-1">
                  Get <strong className="text-[#DAA035]">10% off your first month</strong> when you get a quote today.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-serif text-[#FEFFFF] font-bold">Get your fixed quote</h2>
                <p className="text-sm text-[#CBCFD8] mt-1">Free. No obligation. Response within 1 business day.</p>
              </>
            )}
          </div>
          <button onClick={close} className="text-gray-500 hover:text-white transition-colors p-1 shrink-0 ml-4 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Discount banner */}
        {mode === 'exit' && (
          <div className="bg-[#DAA035]/10 border-b border-[#DAA035]/20 px-6 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DAA035] flex items-center justify-center shrink-0">
              <span className="text-[#000F22] text-xs font-black">10%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#DAA035]">10% off your first month</p>
              <p className="text-[11px] text-gray-400">Mention this offer when we contact you. Valid for new clients only.</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-center gap-2 mb-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all ${step >= s ? 'bg-[#DAA035]' : 'bg-gray-800'}`} />
            ))}
          </div>
          <p className="text-[10px] text-gray-500 font-mono">Step {step} of 3</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-3 p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-red-200 text-xs">{error}</div>
        )}

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              {[
                { label: 'Full Name *',      type: 'text',  val: name,     set: setName,     ph: 'John Doe' },
                { label: 'Email Address *',  type: 'email', val: email,    set: setEmail,    ph: 'you@company.com' },
                { label: 'Business Name *',  type: 'text',  val: business, set: setBusiness, ph: 'Acme Pte Ltd' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.val}
                    onChange={(e) => f.set((e.target as HTMLInputElement).value)}
                    placeholder={f.ph}
                    className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#DAA035] focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-2">Monthly Transactions</label>
                <div className="grid grid-cols-3 gap-2">
                  {[['under 30', 'Under 30', 'Starter'], ['30 to 100', '30–100', 'Growth'], ['100+', '100+', 'Full']].map(([val, label, plan]) => (
                    <button key={val} type="button" onClick={() => setTransactions(val)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${transactions === val ? 'border-[#DAA035] bg-[#DAA035]/10' : 'border-gray-800 bg-[#000F22] hover:border-gray-700'}`}>
                      <span className={`block text-xs font-bold ${transactions === val ? 'text-[#DAA035]' : 'text-[#CBCFD8]'}`}>{label}</span>
                      <span className="block text-[9px] text-gray-600 font-mono">{plan}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5">Employees on Payroll</label>
                <select value={employees} onChange={(e) => setEmployees((e.target as HTMLSelectElement).value)}
                  className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#DAA035] focus:outline-none transition-colors">
                  <option value="0">None</option>
                  <option value="1 to 5">1 to 5 staff</option>
                  <option value="6 to 20">6 to 20 staff</option>
                  <option value="20+">More than 20</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#000F22] border border-gray-800 rounded-xl p-4 text-xs space-y-1.5">
                <p className="text-[#DAA035] font-mono font-bold uppercase text-[10px] mb-2">Summary</p>
                <div className="grid grid-cols-2 gap-1 text-gray-400">
                  <span>Name:</span><span className="text-white font-medium">{name}</span>
                  <span>Business:</span><span className="text-white font-medium">{business}</span>
                  <span>Transactions:</span><span className="text-[#DAA035] font-medium">{transactions}/mo</span>
                  <span>Staff:</span><span className="text-white font-medium">{employees === '0' ? 'None' : employees}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5">Any other details? (optional)</label>
                <textarea rows={3} value={message}
                  onChange={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
                  placeholder="Anything else we should know..."
                  className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#DAA035] focus:outline-none transition-colors resize-none"
                />
              </div>
              {mode === 'exit' && (
                <div className="bg-[#DAA035]/10 border border-[#DAA035]/25 rounded-xl p-3 text-xs text-[#CBCFD8]">
                  <strong className="text-[#DAA035]">10% discount</strong> applied to your first month. We'll confirm when we send your quote.
                </div>
              )}
              <p className="text-[11px] text-gray-600 leading-relaxed">
                By submitting you consent to us contacting you with your quote. No payment collected. <a href="/privacy/" className="text-[#DAA035] hover:underline">Privacy policy</a>.
              </p>
            </div>
          )}

          {/* Nav */}
          <div className={`flex gap-3 pt-2 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <button type="button" onClick={() => { setStep((p) => (p - 1) as Step); setError(''); }}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-700 text-[#CBCFD8] hover:border-gray-500 rounded-xl text-sm transition-all cursor-pointer">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#DCA33C] hover:bg-[#C8912F] text-[#000F22] font-semibold rounded-xl text-sm transition-all cursor-pointer">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[#DCA33C] hover:bg-[#C8912F] disabled:bg-gray-700 text-[#000F22] font-semibold rounded-xl text-sm transition-all cursor-pointer">
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  : <><Send className="w-4 h-4" /> {mode === 'exit' ? 'Get 10% Off Quote' : 'Get My Quote'}</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
