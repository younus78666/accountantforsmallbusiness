import React, { useState, useMemo } from 'react';

// CONFIRM — all prices are placeholders matching AFSB pricing page
const PLANS = {
  starter: { name: 'Starter', from: 90, bestFor: 'Sole props, low volume (under 30 tx/mo)' },
  growth:  { name: 'Growth',  from: 250, bestFor: 'Growing SMEs (30–100 tx/mo)' },
  full:    { name: 'Full',    from: 450, bestFor: 'Busy SMEs (100+ tx, with staff)' },
};
const PAYROLL_PER_EMP = 8; // CONFIRM
const IN_HOUSE_BASE = 3500; // conservative in-house accountant salary

function fmt(n: number) {
  return n.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function BookkeepingEstimator() {
  const [transactions, setTransactions] = useState(20);
  const [employees, setEmployees] = useState(0);
  const [gstReg, setGstReg] = useState(false);
  const [needsStatements, setNeedsStatements] = useState(true);
  const [needsReports, setNeedsReports] = useState(false);
  const [frequency, setFrequency] = useState<'monthly' | 'annual'>('monthly');

  const result = useMemo(() => {
    // Determine plan
    let plan: keyof typeof PLANS;
    if (transactions <= 30) {
      plan = employees > 0 || needsReports ? 'growth' : 'starter';
    } else if (transactions <= 100) {
      plan = employees > 0 ? 'full' : 'growth';
    } else {
      plan = 'full';
    }

    // Bump to growth if reports needed, bump to full if employees
    if (needsReports && plan === 'starter') plan = 'growth';
    if (employees > 0 && plan !== 'full') plan = 'full';

    let base = PLANS[plan].from;

    // GST adds complexity — small uplift
    const gstAdjustment = gstReg ? (plan === 'starter' ? 20 : 30) : 0;

    // Annual bookkeeping is cheaper
    const freqAdjustment = frequency === 'annual' ? -Math.round(base * 0.3) : 0;

    // Payroll addon
    const payrollAddon = employees > 0 ? employees * PAYROLL_PER_EMP : 0;

    const estimatedMonthly = base + gstAdjustment + freqAdjustment + payrollAddon;
    const annualCost = estimatedMonthly * 12;

    // In-house comparison (monthly full cost including CPF ~18.5%, benefits, software)
    const inHouseCPF = Math.round(IN_HOUSE_BASE * 0.17);
    const inHouseSoftware = 100;
    const inHouseBenefits = 300;
    const inHouseMonthly = IN_HOUSE_BASE + inHouseCPF + inHouseSoftware + inHouseBenefits;
    const inHouseAnnual = inHouseMonthly * 12;

    const saving = inHouseAnnual - annualCost;
    const savingPct = Math.round((saving / inHouseAnnual) * 100);

    return {
      plan,
      base,
      gstAdjustment,
      freqAdjustment,
      payrollAddon,
      estimatedMonthly,
      annualCost,
      inHouseMonthly,
      inHouseAnnual,
      saving,
      savingPct,
    };
  }, [transactions, employees, gstReg, needsReports, frequency]);

  return (
    <div className="space-y-6">

      {/* Inputs */}
      <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-mono text-[#DAA035] uppercase tracking-wider font-bold border-b border-gray-800 pb-3">
          Your Business Profile
        </h3>

        {/* Transactions slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#CBCFD8] uppercase tracking-wide">
              Monthly Transactions
            </label>
            <span className="text-sm font-black text-[#DAA035] font-mono bg-[#DAA035]/10 border border-[#DAA035]/20 px-2.5 py-1 rounded-lg">
              {transactions} tx/mo
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={150}
            value={transactions}
            onChange={(e) => setTransactions(Number(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer"
            style={{ accentColor: '#DAA035' }}
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
            <span>5 (min)</span>
            <span className="text-[#DAA035]">30 (Starter)</span>
            <span className="text-[#DAA035]">100 (Growth)</span>
            <span>150+</span>
          </div>
        </div>

        {/* Employees */}
        <div>
          <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">
            Employees on Payroll
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEmployees(Math.max(0, employees - 1))}
              className="w-9 h-9 rounded-lg bg-[#000F22] border border-gray-800 text-[#DAA035] font-bold text-lg hover:border-[#DAA035] transition-colors flex items-center justify-center"
            >
              -
            </button>
            <span className="w-16 text-center text-xl font-black text-white font-mono">{employees}</span>
            <button
              type="button"
              onClick={() => setEmployees(Math.min(50, employees + 1))}
              className="w-9 h-9 rounded-lg bg-[#000F22] border border-gray-800 text-[#DAA035] font-bold text-lg hover:border-[#DAA035] transition-colors flex items-center justify-center"
            >
              +
            </button>
            <span className="text-xs text-gray-500 ml-2">{employees === 0 ? 'None' : `+S$${employees * PAYROLL_PER_EMP}/mo payroll addon`}</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'GST registered', sub: 'Quarterly F5 filing increases complexity', val: gstReg, set: setGstReg },
            { label: 'Need management reports', sub: 'Monthly P&L, cash flow, KPI reports', val: needsReports, set: setNeedsReports },
          ].map((toggle) => (
            <label key={toggle.label} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${toggle.val ? 'border-[#DAA035]/40 bg-[#DAA035]/5' : 'border-gray-800 bg-[#000F22] hover:border-gray-700'}`}>
              <input
                type="checkbox"
                checked={toggle.val}
                onChange={(e) => toggle.set(e.target.checked)}
                className="w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                style={{ accentColor: '#DAA035' }}
              />
              <div>
                <span className="text-xs font-semibold text-white block">{toggle.label}</span>
                <span className="text-[11px] text-gray-500">{toggle.sub}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">
            Bookkeeping Frequency
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: 'monthly', label: 'Monthly', sub: 'Current records every month' },
              { val: 'annual',  label: 'Annual',  sub: 'Year-end only (approx 30% less)' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFrequency(opt.val as 'monthly' | 'annual')}
                className={`p-3 rounded-xl border text-left transition-all ${frequency === opt.val ? 'border-[#DAA035] bg-[#DAA035]/10' : 'border-gray-800 bg-[#000F22] hover:border-gray-700'}`}
              >
                <span className={`block text-xs font-bold ${frequency === opt.val ? 'text-[#DAA035]' : 'text-white'}`}>{opt.label}</span>
                <span className="block text-[10px] text-gray-500 mt-0.5">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-[#000F22] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-sm font-mono text-[#DAA035] uppercase tracking-wider font-bold border-b border-gray-800 pb-3">
          Your Estimated Cost
        </h3>

        {/* Recommended plan */}
        <div className="flex items-center justify-between p-4 bg-[#DAA035]/10 border border-[#DAA035]/25 rounded-xl">
          <div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Recommended plan</span>
            <span className="text-lg font-black text-[#DAA035]">{PLANS[result.plan].name}</span>
            <span className="block text-[11px] text-gray-400 mt-0.5">{PLANS[result.plan].bestFor}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">Est. monthly</span>
            <span className="text-3xl font-black text-white font-mono">S${fmt(result.estimatedMonthly)}</span>
          </div>
        </div>

        {/* Fee breakdown */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Fee breakdown</p>
          {[
            { label: `Base ${PLANS[result.plan].name} plan`, value: result.base, show: true },
            { label: 'GST registration uplift', value: result.gstAdjustment, show: result.gstAdjustment > 0 },
            { label: 'Annual frequency discount', value: result.freqAdjustment, show: result.freqAdjustment < 0, neg: true },
            { label: `Payroll addon (${employees} staff x S$${PAYROLL_PER_EMP})`, value: result.payrollAddon, show: result.payrollAddon > 0 },
          ].filter(r => r.show).map((row) => (
            <div key={row.label} className="flex items-center justify-between px-3 py-2 bg-[#0A1628] border border-gray-800 rounded-lg">
              <span className="text-xs text-gray-400">{row.label}</span>
              <span className={`text-xs font-mono font-bold ${row.neg ? 'text-emerald-400' : 'text-white'}`}>
                {row.neg ? '-' : '+'}S${fmt(Math.abs(row.value))}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2.5 bg-[#DAA035]/5 border border-[#DAA035]/20 rounded-xl">
            <span className="text-sm font-bold text-white">Total /month</span>
            <span className="text-sm font-black text-[#DAA035] font-mono">S${fmt(result.estimatedMonthly)}</span>
          </div>
        </div>

        {/* Annual + comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-[#0A1628] border border-gray-800 rounded-xl p-4 text-center">
            <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">Annual cost</span>
            <span className="text-xl font-black text-[#DAA035] font-mono">S${fmt(result.annualCost)}</span>
          </div>
          <div className="bg-red-950/15 border border-red-900/25 rounded-xl p-4 text-center">
            <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">In-house hire /yr</span>
            <span className="text-xl font-black text-red-300 font-mono">S${fmt(result.inHouseAnnual)}</span>
          </div>
          <div className="bg-emerald-950/25 border border-emerald-900/40 rounded-xl p-4 text-center">
            <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">You save /yr</span>
            <span className="text-xl font-black text-emerald-400 font-mono">S${fmt(result.saving)}</span>
            <span className="block text-[10px] text-emerald-600 mt-0.5">{result.savingPct}% less</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="/contact/"
            className="flex-1 text-center bg-[#DCA33C] hover:bg-[#C8912F] text-[#000F22] font-bold py-3.5 px-6 rounded-xl text-sm transition-all"
          >
            Get your exact fixed quote
          </a>
          <a
            href="/pricing/"
            className="flex-1 text-center border border-gray-700 text-[#CBCFD8] hover:border-[#DAA035] hover:text-[#DAA035] py-3.5 px-6 rounded-xl text-sm transition-all font-medium"
          >
            See full pricing
          </a>
        </div>

        <p className="text-[11px] text-gray-600 font-mono">
          *Estimates only. Exact fee confirmed on a free call based on your real transaction count. {/* CONFIRM prices match published plans */}
        </p>
      </div>
    </div>
  );
}
