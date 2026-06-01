import React, { useState, useMemo } from 'react';

// ── GST Registration Threshold Calculator — Singapore 2026 ──────────────────
// Threshold: S$1,000,000 taxable turnover in a 12-month period
// Rate: 9% (from 1 January 2024)
// Two tests: Retrospective (past 12 months) AND Prospective (next 12 months)
// Registration deadline: Within 30 days of becoming liable
// Source: IRAS GST Act, Singapore

const THRESHOLD = 1_000_000;
const GST_RATE = 0.09;

function fmt(n: number) {
  return n.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtGST(n: number) {
  return n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type SupplyType = 'standard' | 'mixed' | 'zero-rated' | 'exempt';

export default function GSTCalculator() {
  const [retroRevenue, setRetroRevenue] = useState<string>('');
  const [prospRevenue, setProspRevenue] = useState<string>('');
  const [supplyType, setSupplyType] = useState<SupplyType>('standard');
  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(() => {
    const retro = parseFloat(retroRevenue.replace(/,/g, '')) || 0;
    const prosp = parseFloat(prospRevenue.replace(/,/g, '')) || 0;

    // Zero-rated supplies count toward the threshold
    // Exempt supplies do NOT count toward the threshold
    const retroTaxable = supplyType === 'exempt' ? retro * 0.3 : retro;
    const prospTaxable = supplyType === 'exempt' ? prosp * 0.3 : prosp;

    const retroTriggered = retroTaxable > THRESHOLD;
    const prospTriggered = prospTaxable > THRESHOLD;
    const mustRegister = retroTriggered || prospTriggered;

    // How close to threshold
    const maxTaxable = Math.max(retroTaxable, prospTaxable);
    const pct = Math.min((maxTaxable / THRESHOLD) * 100, 100);
    const remaining = Math.max(THRESHOLD - maxTaxable, 0);

    // Monthly GST collection if registered
    const monthlyRevenue = Math.max(retro, prosp) / 12;
    const monthlyGST = monthlyRevenue * GST_RATE;

    // Status messaging
    let status: 'danger' | 'warning' | 'caution' | 'safe' = 'safe';
    if (mustRegister) status = 'danger';
    else if (pct >= 80) status = 'warning';
    else if (pct >= 50) status = 'caution';

    return {
      retro, prosp, retroTaxable, prospTaxable,
      retroTriggered, prospTriggered, mustRegister,
      pct, remaining, monthlyGST, status,
      maxTaxable,
    };
  }, [retroRevenue, prospRevenue, supplyType]);

  const statusConfig = {
    danger: {
      color: 'text-red-400', bg: 'bg-red-950/30 border-red-500/40',
      bar: 'bg-red-500', label: 'Registration required',
      icon: '⚠',
    },
    warning: {
      color: 'text-amber-400', bg: 'bg-amber-950/25 border-amber-500/35',
      bar: 'bg-amber-500', label: 'Approaching threshold — review now',
      icon: '!',
    },
    caution: {
      color: 'text-yellow-400', bg: 'bg-yellow-950/20 border-yellow-600/30',
      bar: 'bg-yellow-500', label: 'Growing — keep monitoring',
      icon: '~',
    },
    safe: {
      color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-500/30',
      bar: 'bg-emerald-500', label: 'Below threshold',
      icon: '✓',
    },
  };

  const cfg = statusConfig[result.status];
  const hasInput = retroRevenue || prospRevenue;

  return (
    <div className="space-y-5">

      {/* ── Inputs ── */}
      <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-sm font-mono text-[#DAA035] uppercase tracking-wider font-bold border-b border-gray-800 pb-3">
          Your Revenue Details
        </h3>

        {/* Retrospective */}
        <div>
          <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5 uppercase tracking-wide">
            Taxable turnover — last 12 months (S$)
          </label>
          <p className="text-[11px] text-gray-500 mb-2 font-mono">Sum of all taxable sales invoiced in the past 12 calendar months</p>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 text-sm font-bold font-mono">S$</span>
            <input
              type="text"
              value={retroRevenue}
              onChange={(e) => setRetroRevenue(e.target.value.replace(/[^0-9.,]/g, ''))}
              placeholder="e.g. 750,000"
              className="w-full bg-[#000F22] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white font-mono text-sm focus:border-[#DAA035] focus:outline-none transition-colors placeholder-gray-700"
            />
          </div>
        </div>

        {/* Prospective */}
        <div>
          <label className="block text-xs font-semibold text-[#CBCFD8] mb-1.5 uppercase tracking-wide">
            Expected taxable turnover — next 12 months (S$)
          </label>
          <p className="text-[11px] text-gray-500 mb-2 font-mono">Your best estimate for the next 12 months based on confirmed contracts or pipeline</p>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 text-sm font-bold font-mono">S$</span>
            <input
              type="text"
              value={prospRevenue}
              onChange={(e) => setProspRevenue(e.target.value.replace(/[^0-9.,]/g, ''))}
              placeholder="e.g. 1,200,000"
              className="w-full bg-[#000F22] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white font-mono text-sm focus:border-[#DAA035] focus:outline-none transition-colors placeholder-gray-700"
            />
          </div>
        </div>

        {/* Supply type */}
        <div>
          <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">
            Type of supplies your business makes
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: 'standard', label: 'Standard-rated', sub: 'Most retail, services, F&B', note: 'All revenue counts' },
              { val: 'mixed', label: 'Mixed supplies', sub: 'Some zero-rated exports', note: 'All revenue counts' },
              { val: 'zero-rated', label: 'Mainly zero-rated', sub: 'Exports, international services', note: 'All counts, but exemption may apply' },
              { val: 'exempt', label: 'Mainly exempt', sub: 'Financial, medical, residential', note: 'Exempt sales excluded from threshold' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setSupplyType(opt.val as SupplyType)}
                className={`p-3 rounded-xl border text-left transition-all ${supplyType === opt.val ? 'border-[#DAA035] bg-[#DAA035]/10' : 'border-gray-800 bg-[#000F22] hover:border-gray-700'}`}
              >
                <span className={`block text-xs font-bold ${supplyType === opt.val ? 'text-[#DAA035]' : 'text-white'}`}>{opt.label}</span>
                <span className="block text-[10px] text-gray-500 mt-0.5">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      {hasInput && (
        <div className="space-y-4">

          {/* Status verdict */}
          <div className={`border rounded-2xl p-6 ${cfg.bg}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Registration status</p>
                <p className={`text-xl font-extrabold font-mono ${cfg.color}`}>{cfg.label}</p>
              </div>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-black ${cfg.color} border-current opacity-60`}>
                {cfg.icon}
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[11px] font-mono text-gray-500">
                <span>S$0</span>
                <span className="text-[#DAA035] font-bold">Threshold: S$1,000,000</span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                  style={{ width: `${result.pct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className={cfg.color}>S${fmt(result.maxTaxable)} ({result.pct.toFixed(1)}%)</span>
                {result.remaining > 0 && (
                  <span className="text-gray-500">S${fmt(result.remaining)} remaining</span>
                )}
              </div>
            </div>
          </div>

          {/* Test results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`bg-[#0A1628] border rounded-xl p-4 ${result.retroTriggered ? 'border-red-500/40' : 'border-gray-800'}`}>
              <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">Retrospective test (past 12 months)</p>
              <p className={`text-base font-black font-mono ${result.retroTriggered ? 'text-red-400' : 'text-emerald-400'}`}>
                {result.retroTriggered ? 'TRIGGERED' : 'Not triggered'}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Taxable turnover: S${fmt(result.retroTaxable)}
                {result.retroTriggered && ' — you must register within 30 days'}
              </p>
            </div>
            <div className={`bg-[#0A1628] border rounded-xl p-4 ${result.prospTriggered ? 'border-red-500/40' : 'border-gray-800'}`}>
              <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">Prospective test (next 12 months)</p>
              <p className={`text-base font-black font-mono ${result.prospTriggered ? 'text-red-400' : 'text-emerald-400'}`}>
                {result.prospTriggered ? 'TRIGGERED' : 'Not triggered'}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Expected taxable turnover: S${fmt(result.prospTaxable)}
                {result.prospTriggered && ' — register before the liability date'}
              </p>
            </div>
          </div>

          {/* GST impact if registered */}
          {parseFloat(retroRevenue || prospRevenue || '0') > 0 && (
            <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-mono text-[#DAA035] uppercase tracking-wider font-bold">If GST-registered (9% rate)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Monthly GST collected', value: `S$${fmtGST(result.monthlyGST)}` },
                  { label: 'Annual GST collected', value: `S$${fmt(result.monthlyGST * 12)}` },
                  { label: 'Filing frequency', value: 'Quarterly' },
                  { label: 'GST rate (2026)', value: '9%' },
                ].map((s) => (
                  <div key={s.label} className="bg-[#000F22] border border-gray-800 rounded-xl p-3 text-center">
                    <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider mb-1">{s.label}</p>
                    <p className="text-sm font-black text-[#DAA035] font-mono">{s.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 font-mono">*GST collected from customers is held in trust for IRAS — it is not your income</p>
            </div>
          )}

          {/* Action recommendation */}
          <div className={`rounded-2xl p-5 space-y-3 ${result.mustRegister ? 'bg-red-950/20 border border-red-500/30' : result.status === 'warning' ? 'bg-amber-950/20 border border-amber-500/25' : 'bg-[#DAA035]/8 border border-[#DAA035]/20'}`}>
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#DAA035]">What to do next</h3>
            {result.mustRegister ? (
              <div className="space-y-2 text-sm text-[#CBCFD8]">
                <p className="font-semibold text-white">Your business is required to register for GST.</p>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li className="flex gap-2"><span className="text-red-400 shrink-0">1.</span>Register within 30 days of the date you became liable</li>
                  <li className="flex gap-2"><span className="text-red-400 shrink-0">2.</span>Apply via IRAS myTax Portal (myTax.iras.gov.sg)</li>
                  <li className="flex gap-2"><span className="text-red-400 shrink-0">3.</span>Start charging 9% GST from the effective registration date</li>
                  <li className="flex gap-2"><span className="text-red-400 shrink-0">4.</span>File quarterly GST F5 returns</li>
                </ul>
              </div>
            ) : result.status === 'warning' ? (
              <div className="space-y-1.5 text-xs text-gray-300">
                <p className="font-semibold text-white text-sm">You're approaching the threshold — act now.</p>
                <p>Monitor monthly. Once you exceed S$1M in any rolling 12-month period, you have 30 days to register. Consider whether voluntary registration makes sense before you hit the threshold.</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs text-gray-300">
                <p className="font-semibold text-white text-sm">You're currently below the threshold.</p>
                <p>Keep monitoring your turnover monthly. If your revenue is growing, revisit this calculator regularly. Voluntary registration may make sense if you have significant business-to-business customers.</p>
              </div>
            )}

            <a
              href="/contact/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DCA33C] hover:bg-[#C8912F] text-[#000F22] text-xs font-bold rounded-xl transition-all mt-2"
            >
              Discuss your GST position with Mehdi &rarr;
            </a>
          </div>

          {/* Show/hide detail toggle */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-center text-xs font-mono text-gray-500 hover:text-[#DAA035] transition-colors py-2"
          >
            {showDetails ? 'Hide' : 'Show'} calculation details
          </button>

          {showDetails && (
            <div className="bg-[#000F22] border border-gray-800 rounded-xl p-5 text-xs font-mono space-y-2 text-gray-500">
              <p className="text-[#DAA035] font-bold uppercase tracking-wider text-[10px] mb-3">Calculation breakdown</p>
              <p>Retrospective taxable turnover: S${fmt(result.retroTaxable)}</p>
              <p>Prospective taxable turnover: S${fmt(result.prospTaxable)}</p>
              <p>Registration threshold: S${fmt(THRESHOLD)}</p>
              <p>Retrospective test: {result.retroTaxable} {result.retroTriggered ? '>' : '<='} {THRESHOLD} → {result.retroTriggered ? 'TRIGGERED' : 'not triggered'}</p>
              <p>Prospective test: {result.prospTaxable} {result.prospTriggered ? '>' : '<='} {THRESHOLD} → {result.prospTriggered ? 'TRIGGERED' : 'not triggered'}</p>
              {supplyType === 'exempt' && <p className="text-amber-400">Note: Exempt supplies excluded from threshold calculation (approx 70% reduction applied)</p>}
              <p className="border-t border-gray-800 pt-2 mt-2 text-[10px]">
                Source: IRAS GST Act, GST registration requirements (IRAS, 2026). For zero-rated supply exemption, application to IRAS required — consult a qualified accountant.
              </p>
            </div>
          )}
        </div>
      )}

      {!hasInput && (
        <div className="text-center py-8 text-gray-600 text-sm font-mono">
          Enter your revenue above to check your GST registration status.
        </div>
      )}
    </div>
  );
}
