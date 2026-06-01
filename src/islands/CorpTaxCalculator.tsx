import React, { useState, useMemo } from 'react';

const TAX_RATE = 0.17;

interface TaxResult {
  taxableIncome: number;
  exemptionTotal: number;
  taxPayable: number;
  effectiveRate: number;
  tiers: { label: string; chargeable: number; exemptPct: number; taxable: number; tax: number }[];
  monthlyProvision: number;
}

function calcTax(income: number, isSUTE: boolean): TaxResult {
  if (income <= 0) {
    return { taxableIncome: 0, exemptionTotal: 0, taxPayable: 0, effectiveRate: 0, tiers: [], monthlyProvision: 0 };
  }

  const tiers = isSUTE
    ? [
        { label: 'First S$100,000', cap: 100000, exemptPct: 0.75 },
        { label: 'Next S$100,000',  cap: 100000, exemptPct: 0.50 },
        { label: 'Above S$200,000', cap: Infinity, exemptPct: 0 },
      ]
    : [
        { label: 'First S$10,000',  cap: 10000,   exemptPct: 0.75 },
        { label: 'Next S$190,000',  cap: 190000,  exemptPct: 0.50 },
        { label: 'Above S$200,000', cap: Infinity, exemptPct: 0 },
      ];

  let remaining = income;
  let totalTaxable = 0;
  let totalExempt = 0;
  const tierResults: TaxResult['tiers'] = [];

  for (const t of tiers) {
    if (remaining <= 0) break;
    const chargeable = t.cap === Infinity ? remaining : Math.min(remaining, t.cap);
    const exempt = chargeable * t.exemptPct;
    const taxable = chargeable - exempt;
    const tax = taxable * TAX_RATE;
    totalTaxable += taxable;
    totalExempt += exempt;
    tierResults.push({ label: t.label, chargeable, exemptPct: t.exemptPct, taxable, tax });
    remaining -= chargeable;
  }

  const taxPayable = totalTaxable * TAX_RATE;
  const effectiveRate = income > 0 ? (taxPayable / income) * 100 : 0;

  return {
    taxableIncome: totalTaxable,
    exemptionTotal: totalExempt,
    taxPayable,
    effectiveRate,
    tiers: tierResults,
    monthlyProvision: taxPayable / 12,
  };
}

const fmt = (n: number) => `S$${Math.round(n).toLocaleString()}`;
const fmtDec = (n: number) => `S$${n.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function CorpTaxCalculator() {
  const [mode, setMode] = useState<'quick' | 'buildup'>('quick');
  const [chargeableIncome, setChargeableIncome] = useState(300000);
  const [companyStatus, setCompanyStatus] = useState<'sute' | 'pte'>('sute');

  // Build-up mode fields
  const [revenue, setRevenue] = useState(500000);
  const [cogs, setCogs] = useState(100000);
  const [staffCosts, setStaffCosts] = useState(60000);
  const [rentUtil, setRentUtil] = useState(18000);
  const [otherExp, setOtherExp] = useState(22000);

  const buildupIncome = useMemo(() =>
    Math.max(0, revenue - cogs - staffCosts - rentUtil - otherExp),
    [revenue, cogs, staffCosts, rentUtil, otherExp]
  );

  const activeIncome = mode === 'quick' ? chargeableIncome : buildupIncome;
  const isSUTE = companyStatus === 'sute';

  const result     = useMemo(() => calcTax(activeIncome, isSUTE), [activeIncome, isSUTE]);
  const altResult  = useMemo(() => calcTax(activeIncome, !isSUTE), [activeIncome, isSUTE]);
  const fullResult = useMemo(() => ({
    taxPayable: activeIncome * TAX_RATE,
    effectiveRate: TAX_RATE * 100,
  }), [activeIncome]);

  const savings = fullResult.taxPayable - result.taxPayable;

  const incomeSlider = Math.min(activeIncome, mode === 'quick' ? chargeableIncome : buildupIncome);

  return (
    <div className="space-y-6">

      {/* ── Mode toggle ───────────────────────────────────────────────── */}
      <div className="flex bg-[#000F22] rounded-xl p-1 border border-gray-800">
        {([['quick', 'Quick — enter chargeable income'], ['buildup', 'Build-up from revenue']] as const).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${mode === m ? 'bg-[#DAA035] text-[#000F22]' : 'text-gray-500 hover:text-[#CBCFD8]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Inputs ────────────────────────────────────────────────────── */}
      <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 space-y-5">

        {mode === 'quick' ? (
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">
              Chargeable Income (S$)
            </label>
            <input
              type="number"
              min={0} max={10000000} step={1000}
              value={chargeableIncome}
              onChange={e => setChargeableIncome(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-3 text-[#DAA035] font-bold text-xl focus:border-[#DAA035] focus:outline-none transition-colors"
            />
            <input
              type="range" min={0} max={2000000} step={10000}
              value={Math.min(chargeableIncome, 2000000)}
              onChange={e => setChargeableIncome(parseInt(e.target.value))}
              className="w-full mt-3 cursor-pointer"
              style={{
                accentColor: '#DAA035', height: '5px',
                WebkitAppearance: 'none', appearance: 'none',
                background: `linear-gradient(to right,#DAA035 0%,#DAA035 ${(Math.min(chargeableIncome,2000000)/2000000)*100}%,#1a2234 ${(Math.min(chargeableIncome,2000000)/2000000)*100}%,#1a2234 100%)`,
                borderRadius: '9999px',
              }}
            />
            <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#DAA035;border:3px solid #000F22;box-shadow:0 0 0 2px #DAA035;cursor:grab;}input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#DAA035;border:3px solid #000F22;cursor:grab;}`}</style>
            <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-1">
              <span>S$0</span><span>S$500k</span><span>S$1M</span><span>S$2M+</span>
            </div>
            <p className="text-[10px] text-gray-600 font-mono mt-2">
              Chargeable income = Net profit after all allowable deductions, before tax
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest mb-1">Annual Figures (S$)</p>
            {[
              { label: 'Revenue / Turnover', val: revenue, set: setRevenue, color: 'text-emerald-400', sign: '+' },
              { label: 'Cost of Goods Sold', val: cogs, set: setCogs, color: 'text-red-400', sign: '-' },
              { label: 'Staff Costs (incl. CPF)', val: staffCosts, set: setStaffCosts, color: 'text-red-400', sign: '-' },
              { label: 'Rent & Utilities', val: rentUtil, set: setRentUtil, color: 'text-red-400', sign: '-' },
              { label: 'Other Allowable Expenses', val: otherExp, set: setOtherExp, color: 'text-red-400', sign: '-' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <span className={`text-sm font-bold w-4 shrink-0 ${f.color}`}>{f.sign}</span>
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 font-mono mb-1">{f.label}</label>
                  <input
                    type="number" min={0} step={1000}
                    value={f.val}
                    onChange={e => f.set(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#000F22] border border-gray-800 rounded-lg px-3 py-2 text-[#CBCFD8] text-sm focus:border-[#DAA035] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            ))}
            <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Estimated Chargeable Income</span>
              <span className={`text-lg font-bold ${buildupIncome > 0 ? 'text-[#DAA035]' : 'text-red-400'}`}>
                {buildupIncome >= 0 ? fmt(buildupIncome) : `(${fmt(Math.abs(buildupIncome))})`}
              </span>
            </div>
            {buildupIncome < 0 && (
              <p className="text-xs text-amber-400 font-mono">
                Company is in a loss position. No tax payable. Losses can be carried forward.
              </p>
            )}
          </div>
        )}

        {/* Company status */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">
            Tax Exemption Scheme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                val: 'sute', label: 'Start-Up Tax Exemption',
                sub: '1st–3rd Year of Assessment',
                detail: '75% off first S$100k · 50% off next S$100k',
              },
              {
                val: 'pte', label: 'Partial Tax Exemption',
                sub: 'YA 4 onwards (established companies)',
                detail: '75% off first S$10k · 50% off next S$190k',
              },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setCompanyStatus(opt.val as 'sute' | 'pte')}
                className={`p-4 rounded-xl border text-left transition-all ${companyStatus === opt.val ? 'border-[#DAA035] bg-[#DAA035]/8' : 'border-gray-800 bg-[#000F22] hover:border-gray-700'}`}
              >
                <span className={`block text-xs font-bold mb-0.5 ${companyStatus === opt.val ? 'text-[#DAA035]' : 'text-[#CBCFD8]'}`}>{opt.label}</span>
                <span className="block text-[10px] text-gray-500 mb-1.5">{opt.sub}</span>
                <span className="block text-[10px] font-mono text-gray-600">{opt.detail}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ───────────────────────────────────────────────────── */}
      {activeIncome > 0 && (
        <>
          {/* Key numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Chargeable Income', val: fmt(activeIncome), color: 'text-white' },
              { label: 'Total Exemption',   val: fmt(result.exemptionTotal), color: 'text-emerald-400' },
              { label: 'Tax Payable',        val: fmt(result.taxPayable), color: 'text-[#DAA035]' },
              { label: 'Effective Rate',     val: `${result.effectiveRate.toFixed(2)}%`, color: 'text-blue-400' },
            ].map((k, i) => (
              <div key={i} className="bg-[#0A1628] border border-gray-800 rounded-xl p-4">
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1.5">{k.label}</p>
                <p className={`text-lg font-bold ${k.color}`}>{k.val}</p>
              </div>
            ))}
          </div>

          {/* Tier breakdown */}
          <div className="bg-[#0A1628] border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest">
                Tax Calculation — {isSUTE ? 'Start-Up Tax Exemption (SUTE)' : 'Partial Tax Exemption (PTE)'}
              </p>
              <span className="text-[10px] font-mono text-gray-600">17% on taxable income</span>
            </div>
            <div className="divide-y divide-gray-900">
              {result.tiers.filter(t => t.chargeable > 0).map((t, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">{t.label}</span>
                    <span className="text-xs font-mono text-gray-500">
                      {t.exemptPct > 0 ? `${Math.round(t.exemptPct * 100)}% exempt` : 'Fully taxable'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs mb-2">
                    <span className="text-gray-500 w-28 shrink-0">Chargeable:</span>
                    <span className="text-white font-medium">{fmt(t.chargeable)}</span>
                  </div>
                  {t.exemptPct > 0 && (
                    <div className="flex items-center gap-3 text-xs mb-2">
                      <span className="text-gray-500 w-28 shrink-0">Exempt ({Math.round(t.exemptPct * 100)}%):</span>
                      <span className="text-emerald-400 font-medium">-{fmt(t.chargeable * t.exemptPct)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs mb-3">
                    <span className="text-gray-500 w-28 shrink-0">Taxable:</span>
                    <span className="text-amber-400 font-medium">{fmt(t.taxable)}</span>
                  </div>
                  {/* Proportion bar */}
                  <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-600 rounded-l-full" style={{ width: `${t.exemptPct * 100}%` }} />
                    <div className="h-full bg-amber-500" style={{ width: `${(1 - t.exemptPct) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-gray-700 mt-1">
                    <span>{Math.round(t.exemptPct * 100)}% exempt</span>
                    <span>Tax: {fmt(t.tax)}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Total row */}
            <div className="px-5 py-4 bg-[#060f1e] border-t border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Total Tax Payable (YA2026)</p>
                <p className="text-[10px] text-gray-600 font-mono mt-0.5">Monthly provision: {fmt(result.monthlyProvision)}/mo</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#DAA035]">{fmt(result.taxPayable)}</p>
                <p className="text-[10px] text-gray-500 font-mono">Effective rate: {result.effectiveRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Savings vs full rate */}
          {savings > 0 && (
            <div className="bg-[#000F22] border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-0.5">
                  Tax saving vs flat 17%: <span className="text-emerald-400">{fmt(savings)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Without exemptions you would owe {fmt(fullResult.taxPayable)}. The {isSUTE ? 'SUTE' : 'PTE'} scheme reduces your bill by {fmt(savings)} ({((savings / fullResult.taxPayable) * 100).toFixed(0)}%).
                </p>
              </div>
            </div>
          )}

          {/* SUTE vs PTE comparison */}
          <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5">
            <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest mb-4">
              SUTE vs PTE Comparison — at {fmt(activeIncome)} chargeable income
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: 'Start-Up Exemption (SUTE)',
                  desc: 'First 3 YAs',
                  res: isSUTE ? result : altResult,
                  active: isSUTE,
                },
                {
                  label: 'Partial Exemption (PTE)',
                  desc: 'YA 4 onwards',
                  res: isSUTE ? altResult : result,
                  active: !isSUTE,
                },
                {
                  label: 'No Exemption',
                  desc: 'Flat 17% rate',
                  res: { taxPayable: fullResult.taxPayable, effectiveRate: fullResult.effectiveRate },
                  active: false,
                },
              ].map((c, i) => (
                <div key={i} className={`rounded-xl p-4 border ${c.active ? 'border-[#DAA035] bg-[#DAA035]/5' : 'border-gray-800 bg-[#000F22]'}`}>
                  <p className={`text-xs font-bold mb-0.5 ${c.active ? 'text-[#DAA035]' : 'text-[#CBCFD8]'}`}>{c.label}</p>
                  <p className="text-[10px] text-gray-600 mb-3">{c.desc}</p>
                  <p className="text-xl font-bold text-white">{fmt(c.res.taxPayable)}</p>
                  <p className="text-[10px] font-mono text-gray-500 mt-1">
                    Effective: {c.res.effectiveRate.toFixed(2)}%
                  </p>
                  {c.active && (
                    <span className="inline-block mt-2 text-[9px] font-mono bg-[#DAA035]/15 text-[#DAA035] px-2 py-0.5 rounded-full">
                      Your current scheme
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Service CTA ───────────────────────────────────────────────── */}
      <div className="bg-[#0A1628] border border-[#DAA035]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1">
          <p className="text-sm font-bold text-white mb-1">We keep your books ready for your tax agent</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Accurate financials mean your tax agent can calculate and file correctly. We handle bookkeeping, financial statements and management reports — remotely, every month.
          </p>
        </div>
        <a
          href="/accounting-services-singapore/"
          className="shrink-0 inline-flex items-center gap-2 bg-[#DCA33C] hover:bg-[#C8912F] text-[#000F22] font-bold text-xs px-5 py-3 rounded-xl transition-all whitespace-nowrap"
        >
          See accounting service
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>

    </div>
  );
}
