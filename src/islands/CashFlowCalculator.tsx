import React, { useState, useMemo } from 'react';

const fmt = (n: number, showSign = false) => {
  const abs = `S$${Math.abs(Math.round(n)).toLocaleString('en-SG')}`;
  if (showSign && n > 0) return `+${abs}`;
  if (n < 0) return `-${abs.replace('S$', 'S$')}`;
  return abs;
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function CashFlowCalculator() {
  const [openingCash,   setOpeningCash]   = useState(50000);
  const [monthlyRev,    setMonthlyRev]    = useState(25000);
  const [fixedExpenses, setFixedExpenses] = useState(18000);
  const [varExpPct,     setVarExpPct]     = useState(15); // % of revenue
  const [revenueGrowth, setRevenueGrowth] = useState(0);  // % per month
  const [showScenario,  setShowScenario]  = useState(false);
  const [scenarioCut,   setScenarioCut]   = useState(10);  // expense cut %

  const calc = (rev: number, fixed: number, varPct: number) => {
    const varExp = rev * (varPct / 100);
    const totalExp = fixed + varExp;
    const netCashFlow = rev - totalExp;
    return { varExp, totalExp, netCashFlow };
  };

  const base = useMemo(() => calc(monthlyRev, fixedExpenses, varExpPct), [monthlyRev, fixedExpenses, varExpPct]);

  const breakEvenRevenue = useMemo(() => {
    if (varExpPct >= 100) return Infinity;
    return fixedExpenses / (1 - varExpPct / 100);
  }, [fixedExpenses, varExpPct]);

  // 12-month projection
  const projection = useMemo(() => {
    const rows: {
      month: string; revenue: number; expenses: number;
      netFlow: number; closingCash: number; cumulative: number
    }[] = [];
    let cash = openingCash;
    let rev = monthlyRev;
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const { totalExp, netCashFlow } = calc(rev, fixedExpenses, varExpPct);
      cash += netCashFlow;
      rows.push({
        month: MONTHS[(now.getMonth() + i) % 12],
        revenue: Math.round(rev),
        expenses: Math.round(totalExp),
        netFlow: Math.round(netCashFlow),
        closingCash: Math.round(cash),
        cumulative: Math.round(cash - openingCash),
      });
      rev = rev * (1 + revenueGrowth / 100);
    }
    return rows;
  }, [openingCash, monthlyRev, fixedExpenses, varExpPct, revenueGrowth]);

  const runway = useMemo(() => {
    if (base.netCashFlow >= 0) return Infinity;
    return Math.floor(openingCash / Math.abs(base.netCashFlow));
  }, [openingCash, base.netCashFlow]);

  const runwayLabel = runway === Infinity ? 'Cash flow positive' :
    runway === 0 ? '< 1 month' : `${runway} months`;

  const runwayColor = runway === Infinity ? 'text-emerald-400' :
    runway <= 3 ? 'text-red-400' :
    runway <= 6 ? 'text-amber-400' : 'text-emerald-400';

  const runwayBg = runway === Infinity ? 'border-emerald-500/30 bg-emerald-500/5' :
    runway <= 3 ? 'border-red-500/30 bg-red-950/20' :
    runway <= 6 ? 'border-amber-500/30 bg-amber-950/20' : 'border-emerald-500/30 bg-emerald-500/5';

  // Scenario
  const scenarioFixed = fixedExpenses * (1 - scenarioCut / 100);
  const scenarioBase  = calc(monthlyRev, scenarioFixed, varExpPct);
  const scenarioRunway = scenarioBase.netCashFlow >= 0 ? Infinity :
    Math.floor(openingCash / Math.abs(scenarioBase.netCashFlow));

  const cashRunoutMonth = runway !== Infinity
    ? projection.find(r => r.closingCash <= 0)
    : null;

  return (
    <div className="space-y-6">

      {/* ── Inputs ────────────────────────────────────────────────────── */}
      <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest sm:col-span-2">Monthly Financials (S$)</p>

        {[
          { label: 'Opening cash balance',     val: openingCash,   set: setOpeningCash,   color: 'text-blue-400',    step: 1000 },
          { label: 'Monthly revenue',           val: monthlyRev,    set: setMonthlyRev,    color: 'text-emerald-400', step: 500 },
          { label: 'Monthly fixed expenses',    val: fixedExpenses, set: setFixedExpenses, color: 'text-red-400',     step: 500 },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-[10px] text-gray-500 font-mono mb-1.5">{f.label}</label>
            <input
              type="number" min={0} step={f.step}
              value={f.val}
              onChange={e => f.set(Math.max(0, parseFloat(e.target.value) || 0))}
              className={`w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 ${f.color} font-bold text-lg focus:border-[#DAA035] focus:outline-none transition-colors`}
            />
          </div>
        ))}

        <div>
          <label className="block text-[10px] text-gray-500 font-mono mb-1.5">
            Variable expenses (% of revenue)
          </label>
          <input
            type="number" min={0} max={99} step={1}
            value={varExpPct}
            onChange={e => setVarExpPct(Math.min(99, Math.max(0, parseFloat(e.target.value) || 0)))}
            className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-amber-400 font-bold text-lg focus:border-[#DAA035] focus:outline-none transition-colors"
          />
          <p className="text-[10px] text-gray-600 font-mono mt-1">
            COGS, commissions, delivery = {fmt(base.varExp)}/mo
          </p>
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 font-mono mb-1.5">
            Monthly revenue growth (%)
          </label>
          <input
            type="number" min={-20} max={50} step={0.5}
            value={revenueGrowth}
            onChange={e => setRevenueGrowth(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-[#CBCFD8] font-bold text-lg focus:border-[#DAA035] focus:outline-none transition-colors"
          />
          <p className="text-[10px] text-gray-600 font-mono mt-1">
            Used in 12-month projection
          </p>
        </div>
      </div>

      {/* ── Key metrics ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Opening Cash',       val: fmt(openingCash), color: 'text-blue-400' },
          { label: 'Monthly Net Flow',   val: fmt(base.netCashFlow, true), color: base.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'Break-even Revenue', val: isFinite(breakEvenRevenue) ? fmt(breakEvenRevenue) : 'N/A', color: 'text-[#DAA035]' },
          { label: 'Cash Runway',        val: runwayLabel, color: runwayColor },
        ].map((k, i) => (
          <div key={i} className={`border rounded-xl p-4 ${i === 3 ? runwayBg : 'bg-[#0A1628] border-gray-800'}`}>
            <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1.5">{k.label}</p>
            <p className={`text-lg font-bold ${k.color}`}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Runway visual */}
      {runway !== Infinity && runway > 0 && (
        <div className={`border rounded-2xl p-5 ${runwayBg}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${runway <= 3 ? 'bg-red-500/15' : runway <= 6 ? 'bg-amber-500/15' : 'bg-emerald-500/15'}`}>
              <svg className={`w-6 h-6 ${runwayColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p className={`text-sm font-bold ${runwayColor} mb-1`}>
                {runway <= 3
                  ? `Critical: only ${runway} month${runway === 1 ? '' : 's'} of runway`
                  : runway <= 6
                  ? `Caution: ${runway} months of runway`
                  : `${runway} months of runway`}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {runway <= 3
                  ? 'At current burn rate, cash will run out very soon. Act immediately — cut expenses or raise revenue.'
                  : runway <= 6
                  ? 'You have some runway but should take action now to reach cash flow positive.'
                  : 'You have a healthy runway. Stay focused on growing revenue above break-even.'}
              </p>
              {cashRunoutMonth && (
                <p className={`text-xs font-mono mt-2 ${runwayColor}`}>
                  Projected cash out: {cashRunoutMonth.month}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${runway <= 3 ? 'bg-red-500' : runway <= 6 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (runway / 24) * 100)}%` }} />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-gray-700 mt-1">
            <span>0 mo</span><span>6 mo</span><span>12 mo</span><span>24 mo</span>
          </div>
        </div>
      )}

      {runway === Infinity && base.netCashFlow > 0 && (
        <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-400 mb-0.5">Cash flow positive — {fmt(base.netCashFlow)}/mo net</p>
            <p className="text-xs text-gray-400">You are generating cash each month. Focus on sustaining and growing this surplus.</p>
          </div>
        </div>
      )}

      {/* ── Expense cut scenario ─────────────────────────────────────── */}
      <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5">
        <label className="flex items-center gap-3 cursor-pointer select-none mb-4">
          <div
            onClick={() => setShowScenario(v => !v)}
            className="relative cursor-pointer rounded-full transition-colors shrink-0"
            style={{ width: 40, height: 22, background: showScenario ? '#DAA035' : '#374151' }}
          >
            <span className="absolute top-0.5 bg-white rounded-full shadow transition-transform"
              style={{ left: '0.125rem', width: 18, height: 18, transform: showScenario ? 'translateX(18px)' : 'translateX(0)' }} />
          </div>
          <span className="text-xs font-semibold text-[#CBCFD8]">What if I cut fixed expenses?</span>
        </label>
        {showScenario && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-500 font-mono mb-1.5">Cut fixed expenses by (%)</label>
              <input
                type="range" min={5} max={50} step={5}
                value={scenarioCut}
                onChange={e => setScenarioCut(parseInt(e.target.value))}
                className="w-full cursor-pointer"
                style={{
                  accentColor: '#DAA035', height: '5px',
                  WebkitAppearance: 'none', appearance: 'none',
                  background: `linear-gradient(to right,#DAA035 0%,#DAA035 ${((scenarioCut-5)/45)*100}%,#1a2234 ${((scenarioCut-5)/45)*100}%,#1a2234 100%)`,
                  borderRadius: '9999px',
                }}
              />
              <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#DAA035;border:2px solid #000F22;box-shadow:0 0 0 2px #DAA035;cursor:grab;}`}</style>
              <p className="text-center text-sm font-bold text-[#DAA035] mt-1">{scenarioCut}% cut = save {fmt(fixedExpenses * scenarioCut / 100)}/mo</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'New fixed costs',  val: fmt(scenarioFixed),           color: 'text-white' },
                { label: 'New net flow',     val: fmt(scenarioBase.netCashFlow, true), color: scenarioBase.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400' },
                { label: 'New runway',       val: scenarioRunway === Infinity ? 'Cash positive' : `${scenarioRunway} mo`, color: scenarioRunway >= 12 || scenarioRunway === Infinity ? 'text-emerald-400' : 'text-amber-400' },
              ].map((k, i) => (
                <div key={i} className="bg-[#000F22] rounded-xl p-3">
                  <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1">{k.label}</p>
                  <p className={`text-sm font-bold ${k.color}`}>{k.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 12-month projection table ─────────────────────────────────── */}
      <div className="bg-[#0A1628] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest">12-Month Cash Flow Projection</p>
          {revenueGrowth !== 0 && (
            <p className="text-[10px] text-gray-600 font-mono mt-0.5">Revenue growing at {revenueGrowth}%/month</p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                {['Month','Revenue','Expenses','Net Flow','Closing Cash'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-mono font-bold text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {projection.map((row, i) => (
                <tr key={i} className={`hover:bg-[#060f1e] transition-colors ${row.closingCash <= 0 ? 'bg-red-950/20' : ''}`}>
                  <td className="px-4 py-2.5 text-white font-bold">{row.month}</td>
                  <td className="px-4 py-2.5 text-emerald-400">{fmt(row.revenue)}</td>
                  <td className="px-4 py-2.5 text-red-400">{fmt(row.expenses)}</td>
                  <td className={`px-4 py-2.5 font-semibold ${row.netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fmt(row.netFlow, true)}
                  </td>
                  <td className={`px-4 py-2.5 font-bold ${row.closingCash <= 0 ? 'text-red-400' : row.closingCash < openingCash * 0.3 ? 'text-amber-400' : 'text-[#DAA035]'}`}>
                    {fmt(row.closingCash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0A1628] border border-[#DAA035]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1">
          <p className="text-sm font-bold text-white mb-1">Accurate monthly accounts mean you see cash problems before they hit</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Monthly bookkeeping and management reports show your real cash position, not a guess. We deliver clean books and a cash flow summary every month.
          </p>
        </div>
        <a href="/accounting-services-singapore/"
          className="shrink-0 inline-flex items-center gap-2 bg-[#DCA33C] hover:bg-[#C8912F] text-[#000F22] font-bold text-xs px-5 py-3 rounded-xl transition-all whitespace-nowrap">
          See accounting service
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
