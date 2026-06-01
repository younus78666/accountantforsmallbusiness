import React, { useState } from 'react';
import { CheckCircle, Send, ShieldAlert, Loader2 } from 'lucide-react';

const CONFIG = {
  contactResponseTime: 'Within one business day',
  contactHours: 'Mon to Fri, aligned to Singapore business hours (GMT+8)',
};

type Need = string;

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [transactions, setTransactions] = useState('under 30');
  const [employees, setEmployees] = useState('0');
  const [needs, setNeeds] = useState<Need[]>([]);
  const [message, setMessage] = useState('');
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNeedChange = (need: Need) => {
    setNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !businessName) {
      setErrorMessage('Please fill in all required fields (Name, Email, Business Name).');
      return;
    }
    if (!agreedPrivacy) {
      setErrorMessage('Please agree to the Privacy Policy to proceed.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName(''); setEmail(''); setBusinessName('');
      setNeeds([]); setMessage(''); setAgreedPrivacy(false);
    }, 1200);
  };

  if (submitSuccess) {
    return (
      <div className="bg-[#0A1628] border border-[#DAA035]/50 p-8 md:p-12 rounded-xl text-center shadow-lg max-w-2xl mx-auto my-8">
        <CheckCircle className="w-16 h-16 text-[#DAA035] mx-auto mb-6 animate-pulse" />
        <h3 className="text-3xl font-serif text-[#FEFFFF] mb-4">Request Received Successfully</h3>
        <p className="text-[#CBCFD8] mb-6 leading-relaxed">
          Thank you for reaching out. Mehdi Javed will review your details and respond{' '}
          <strong>{CONFIG.contactResponseTime.toLowerCase()}</strong>.
        </p>
        <div className="p-4 bg-[#000F22] rounded-lg inline-block border border-gray-800 mb-8">
          <p className="text-xs text-[#DAA035] font-mono uppercase tracking-widest">Expected Contact</p>
          <p className="text-sm font-semibold text-[#FEFFFF]">{CONFIG.contactHours}</p>
        </div>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="block w-full bg-[#DCA33C] text-[#000F22] hover:bg-[#C8912F] font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer text-center"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
    >
      {/* Left — personal details */}
      <div className="space-y-6 bg-[#0A1628] p-6 md:p-8 rounded-xl border border-gray-900 shadow-md">
        <h3 className="text-2xl font-serif text-[#FEFFFF] border-b border-[#DAA035]/30 pb-3">
          Your Details
        </h3>

        {errorMessage && (
          <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#FEFFFF] mb-2">
            Full Name <span className="text-[#DAA035]">*</span>
          </label>
          <input
            type="text" required value={name} onChange={e => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-[#000F22] border border-gray-800 rounded-lg px-4 py-3 text-[#FEFFFF] focus:border-[#DAA035] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FEFFFF] mb-2">
            Email Address <span className="text-[#DAA035]">*</span>
          </label>
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full bg-[#000F22] border border-gray-800 rounded-lg px-4 py-3 text-[#FEFFFF] focus:border-[#DAA035] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FEFFFF] mb-2">
            Business Name <span className="text-[#DAA035]">*</span>
          </label>
          <input
            type="text" required value={businessName} onChange={e => setBusinessName(e.target.value)}
            placeholder="Acme Pte Ltd"
            className="w-full bg-[#000F22] border border-gray-800 rounded-lg px-4 py-3 text-[#FEFFFF] focus:border-[#DAA035] focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#FEFFFF] mb-2">
              Monthly Transactions <span className="text-xs text-[#CBCFD8]">(approx)</span>
            </label>
            <select
              value={transactions} onChange={e => setTransactions(e.target.value)}
              className="w-full bg-[#000F22] border border-gray-800 rounded-lg px-3 py-3 text-[#FEFFFF] focus:border-[#DAA035] focus:outline-none transition-colors"
            >
              <option value="under 30">Under 30</option>
              <option value="30 to 100">30 to 100</option>
              <option value="100+">100+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#FEFFFF] mb-2">
              Employees on Payroll
            </label>
            <select
              value={employees} onChange={e => setEmployees(e.target.value)}
              className="w-full bg-[#000F22] border border-gray-800 rounded-lg px-3 py-3 text-[#FEFFFF] focus:border-[#DAA035] focus:outline-none transition-colors"
            >
              <option value="0">None</option>
              <option value="1 to 5">1 to 5 staff</option>
              <option value="6 to 20">6 to 20 staff</option>
              <option value="20+">More than 20</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right — needs + message */}
      <div className="space-y-6 bg-[#0A1628] p-6 md:p-8 rounded-xl border border-gray-900 shadow-md flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-serif text-[#FEFFFF] border-b border-[#DAA035]/30 pb-3 mb-4">
            What do you need?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {['Bookkeeping', 'Payroll', 'Financial statements', 'Management reports', 'Not sure yet'].map(need => (
              <label key={need} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-[#000F22]/40 transition-all select-none">
                <input
                  type="checkbox"
                  checked={needs.includes(need)}
                  onChange={() => handleNeedChange(need)}
                  className="w-4 h-4 rounded border-gray-800 cursor-pointer"
                  style={{ accentColor: '#DAA035' }}
                />
                <span className="text-sm text-[#CBCFD8]">{need}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FEFFFF] mb-2">
              Message <span className="text-xs text-[#CBCFD8]">(optional)</span>
            </label>
            <textarea
              rows={4} value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Share any specific details or questions here..."
              className="w-full bg-[#000F22] border border-gray-800 rounded-lg px-4 py-3 text-[#FEFFFF] focus:border-[#DAA035] focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800/80">
          <label className="flex items-start gap-3 cursor-pointer mb-4 select-none">
            <input
              type="checkbox" required checked={agreedPrivacy}
              onChange={e => setAgreedPrivacy(e.target.checked)}
              className="w-4 h-4 mt-1 rounded border-gray-800 cursor-pointer"
              style={{ accentColor: '#DAA035' }}
            />
            <span className="text-xs text-[#CBCFD8] leading-relaxed">
              I consent to sharing my name, email, and business details for the purpose of receiving a fixed quote and scheduling the initial consultation. No payment is collected.
            </span>
          </label>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-[#DCA33C] hover:bg-[#C8912F] disabled:bg-gray-700 text-[#000F22] font-semibold py-3 px-6 rounded-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /><span>Processing details...</span></>
            ) : (
              <><Send className="w-4 h-4" /><span>Get my fixed quote</span></>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
