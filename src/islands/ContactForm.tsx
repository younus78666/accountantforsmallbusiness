import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Send, ShieldAlert, Loader2, User, Building2, Mail, MessageSquare } from 'lucide-react';

type Need = string;
type Step = 1 | 2 | 3;

const NEEDS_OPTIONS = ['Bookkeeping', 'Payroll', 'Financial statements', 'Management reports', 'Not sure yet'];

export default function ContactForm() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — about you
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Step 2 — your business
  const [transactions, setTransactions] = useState('under 30');
  const [employees, setEmployees] = useState('0');
  const [needs, setNeeds] = useState<Need[]>([]);

  // Step 3 — message + privacy
  const [message, setMessage] = useState('');
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNeedChange = (need: Need) =>
    setNeeds(prev => prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]);

  const validateStep1 = () => {
    if (!name.trim() || !email.trim() || !businessName.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep3 = () => {
    if (!agreedPrivacy) {
      setErrorMessage('Please agree to the privacy terms to proceed.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setErrorMessage('');
    setStep(prev => (prev + 1) as Step);
  };

  const prevStep = () => {
    setErrorMessage('');
    setStep(prev => (prev - 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        email,
        business: businessName,
        monthly_transactions: transactions,
        employees_on_payroll: employees,
        services_needed: needs.length ? needs.join(', ') : 'Not specified',
        message: message || 'No message provided',
        // Formsubmit config — BCC is hidden from end user
        _bcc: 'info@muhammadyounus.com',
        _subject: `New Quote Request — ${businessName}`,
        _template: 'table',
        _captcha: 'false',
        _honey: '',
      };

      const res = await fetch('https://formsubmit.co/ajax/accforsmes@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success === 'true') {
        setSubmitSuccess(true);
      } else if (json.message?.toLowerCase().includes('activat')) {
        // Formsubmit needs email activation — first-time setup
        setErrorMessage('Action required: check accforsmes@gmail.com for a verification email from Formsubmit and click "Activate Form", then resubmit.');
      } else {
        setErrorMessage(`Submission failed (${res.status}). Please email us directly at accforsmes@gmail.com.`);
      }
    } catch {
      setErrorMessage('Network error. Please email us directly at accforsmes@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div className="bg-[#0A1628] border border-[#DAA035]/50 p-8 md:p-12 rounded-2xl text-center shadow-lg">
        <div className="w-20 h-20 rounded-full bg-[#DAA035]/15 border border-[#DAA035]/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#DAA035] animate-pulse" />
        </div>
        <h3 className="text-2xl font-serif text-[#FEFFFF] font-bold mb-3">Request Received!</h3>
        <p className="text-[#CBCFD8] mb-6 leading-relaxed text-sm max-w-md mx-auto">
          Thank you, <strong className="text-white">{name}</strong>. Mehdi will review your details for <strong className="text-white">{businessName}</strong> and respond within one business day.
        </p>
        <div className="p-4 bg-[#000F22] rounded-xl inline-block border border-gray-800 mb-8 text-left">
          <p className="text-[10px] text-[#DAA035] font-mono uppercase tracking-widest mb-1">What happens next</p>
          <ul className="text-xs text-[#CBCFD8] space-y-1">
            <li>&#10003;&nbsp; We review your transaction volume</li>
            <li>&#10003;&nbsp; We send a fixed monthly quote</li>
            <li>&#10003;&nbsp; You decide — zero obligation</li>
          </ul>
        </div>
        <button
          onClick={() => { setSubmitSuccess(false); setStep(1); setName(''); setEmail(''); setBusinessName(''); setNeeds([]); setMessage(''); setAgreedPrivacy(false); }}
          className="block w-full bg-[#DCA33C] text-[#000F22] hover:bg-[#C8912F] font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Submit another request
        </button>
      </div>
    );
  }

  // ── Progress bar ────────────────────────────────────────────────────────────
  const steps = [
    { n: 1, label: 'About You' },
    { n: 2, label: 'Your Business' },
    { n: 3, label: 'Send Request' },
  ];

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all
                  ${step > s.n ? 'bg-emerald-500 text-white border-2 border-emerald-500' :
                    step === s.n ? 'bg-[#DCA33C] text-[#000F22] border-2 border-[#DCA33C]' :
                    'bg-[#0A1628] text-gray-500 border-2 border-gray-800'}`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.n ? 'text-[#DAA035]' : step > s.n ? 'text-emerald-400' : 'text-gray-600'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${step > s.n ? 'bg-emerald-500' : 'bg-gray-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider text-center">
          Step {step} of 3 &mdash; {steps[step - 1].label}
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* ── STEP 1: About You ──────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="text-xl font-serif text-[#FEFFFF] border-b border-[#DAA035]/20 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-[#DAA035]" />
                Tell us about yourself
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5 uppercase tracking-wide">Full Name <span className="text-[#DAA035]">*</span></label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-3 text-[#FEFFFF] placeholder-gray-600 focus:border-[#DAA035] focus:outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5 uppercase tracking-wide">Email Address <span className="text-[#DAA035]">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    className="w-full bg-[#000F22] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-[#FEFFFF] placeholder-gray-600 focus:border-[#DAA035] focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5 uppercase tracking-wide">Business Name <span className="text-[#DAA035]">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                  <input type="text" required value={businessName} onChange={e => setBusinessName(e.target.value)}
                    placeholder="Acme Pte Ltd"
                    className="w-full bg-[#000F22] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-[#FEFFFF] placeholder-gray-600 focus:border-[#DAA035] focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Your Business ──────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-serif text-[#FEFFFF] border-b border-[#DAA035]/20 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#DAA035]" />
                About your business
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">Monthly Transactions (approx)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[['under 30', 'Under 30', 'Starter'], ['30 to 100', '30 – 100', 'Growth'], ['100+', '100+', 'Full']].map(([val, label, plan]) => (
                    <button key={val} type="button" onClick={() => setTransactions(val)}
                      className={`p-3 rounded-xl border text-center transition-all ${transactions === val ? 'border-[#DAA035] bg-[#DAA035]/10' : 'border-gray-800 bg-[#000F22] hover:border-gray-700'}`}>
                      <span className={`block text-sm font-bold ${transactions === val ? 'text-[#DAA035]' : 'text-[#CBCFD8]'}`}>{label}</span>
                      <span className="block text-[10px] font-mono text-gray-500 mt-0.5">{plan} plan</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">Employees on Payroll</label>
                <select value={employees} onChange={e => setEmployees(e.target.value)}
                  className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-3 text-[#FEFFFF] focus:border-[#DAA035] focus:outline-none transition-colors text-sm">
                  <option value="0">None</option>
                  <option value="1 to 5">1 to 5 staff</option>
                  <option value="6 to 20">6 to 20 staff</option>
                  <option value="20+">More than 20</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">Services needed <span className="text-gray-600 normal-case font-normal">(select all that apply)</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {NEEDS_OPTIONS.map(need => (
                    <label key={need} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-800 hover:border-[#DAA035]/40 transition-all select-none bg-[#000F22]">
                      <input type="checkbox" checked={needs.includes(need)} onChange={() => handleNeedChange(need)}
                        className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: '#DAA035' }} />
                      <span className="text-sm text-[#CBCFD8]">{need}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Message + Submit ──────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="text-xl font-serif text-[#FEFFFF] border-b border-[#DAA035]/20 pb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#DAA035]" />
                Any final details?
              </h3>

              {/* Summary card */}
              <div className="bg-[#000F22] border border-gray-800 rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-mono text-[#DAA035] uppercase tracking-wider mb-2">Your request summary</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <span className="text-gray-500">Name:</span><span className="text-[#FEFFFF] font-medium">{name}</span>
                  <span className="text-gray-500">Business:</span><span className="text-[#FEFFFF] font-medium">{businessName}</span>
                  <span className="text-gray-500">Transactions:</span><span className="text-[#DAA035] font-medium">{transactions}/mo</span>
                  <span className="text-gray-500">Staff:</span><span className="text-[#FEFFFF] font-medium">{employees === '0' ? 'None' : employees}</span>
                  {needs.length > 0 && <><span className="text-gray-500">Needs:</span><span className="text-[#FEFFFF] font-medium">{needs.join(', ')}</span></>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5 uppercase tracking-wide">Additional message <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
                <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Any other details that would help us quote accurately..."
                  className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-3 text-[#FEFFFF] placeholder-gray-600 focus:border-[#DAA035] focus:outline-none transition-colors resize-none text-sm"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-800 hover:border-[#DAA035]/30 transition-all select-none">
                <input type="checkbox" required checked={agreedPrivacy} onChange={e => setAgreedPrivacy(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded cursor-pointer shrink-0" style={{ accentColor: '#DAA035' }} />
                <span className="text-xs text-[#CBCFD8] leading-relaxed">
                  I consent to sharing my name, email, and business details for the purpose of receiving a fixed quote and scheduling the initial consultation. No payment is collected and no spam.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ── Navigation buttons ────────────────────────────────────────── */}
        <div className={`flex gap-3 mt-6 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
          {step > 1 && (
            <button type="button" onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 border border-gray-700 text-[#CBCFD8] hover:border-gray-500 hover:text-white rounded-xl transition-all text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}

          {step < 3 ? (
            <button type="button" onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-[#DCA33C] hover:bg-[#C8912F] text-[#000F22] font-semibold rounded-xl transition-all text-sm hover:scale-[1.01]">
              Next step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-[#DCA33C] hover:bg-[#C8912F] disabled:bg-gray-700 text-[#000F22] font-semibold rounded-xl transition-all active:scale-[0.98] cursor-pointer text-sm">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending...</span></> : <><Send className="w-4 h-4" /><span>Get my fixed quote</span></>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
