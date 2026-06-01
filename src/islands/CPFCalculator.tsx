import React, { useState, useMemo } from 'react';

// ── CPF Rates 2026 (Citizens & PRs from 3rd year) ───────────────────────────
// Source: CPF Board + 2026 Singapore Budget
// OW Ceiling: S$8,000/month (raised from S$6,800 in 2026 Budget)
// AW Ceiling: S$102,000 - total OW for the year

const CPF_OW_CEILING = 8000; // Monthly OW cap

const RATES: Record<string, { employer: number; employee: number; label: string }> = {
  'below-55':  { employer: 0.17,   employee: 0.20,   label: 'Below 55' },
  '55-60':     { employer: 0.16,   employee: 0.16,   label: '55 to 60' },
  '60-65':     { employer: 0.12,   employee: 0.105,  label: '60 to 65' },
  '65-70':     { employer: 0.095,  employee: 0.075,  label: '65 to 70' },
  'above-70':  { employer: 0.075,  employee: 0.05,   label: 'Above 70' },
};

// PR graduated rates (year 1 & 2 at reduced rates, year 3+ same as citizens)
const PR_RATES: Record<string, { employer: number; employee: number; label: string }> = {
  'pr-year1': { employer: 0.04, employee: 0.05, label: 'PR Year 1' },
  'pr-year2': { employer: 0.09, employee: 0.15, label: 'PR Year 2' },
};

function fmt(n: number) {
  return n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CPFCalculator() {
  const [salary, setSalary] = useState<string>('3000');
  const [age, setAge] = useState('below-55');
  const [citizenship, setCitizenship] = useState<'citizen' | 'pr-full' | 'pr-year1' | 'pr-year2'>('citizen');
  const [includeSdl, setIncludeSdl] = useState(true);

  const result = useMemo(() => {
    const gross = parseFloat(salary) || 0;
    if (gross <= 0) return null;

    // Determine applicable rates
    let rateKey = age;
    let employerRate: number;
    let employeeRate: number;

    if (citizenship === 'pr-year1') {
      employerRate = PR_RATES['pr-year1'].employer;
      employeeRate = PR_RATES['pr-year1'].employee;
    } else if (citizenship === 'pr-year2') {
      employerRate = PR_RATES['pr-year2'].employer;
      employeeRate = PR_RATES['pr-year2'].employee;
    } else {
      employerRate = RATES[rateKey].employer;
      employeeRate = RATES[rateKey].employee;
    }

    // Cap OW at ceiling
    const owContributable = Math.min(gross, CPF_OW_CEILING);

    // CPF contributions
    const employerCPF = Math.round(owContributable * employerRate * 100) / 100;
    const employeeCPF = Math.round(owContributable * employeeRate * 100) / 100;
    const totalCPF = employerCPF + employeeCPF;

    // SDL: 0.25% of gross wages, minimum S$2
    const sdl = includeSdl ? Math.max(Math.round(gross * 0.0025 * 100) / 100, 2) : 0;

    // Net & cost
    const netSalary = gross - employeeCPF;
    const totalEmployerCost = gross + employerCPF + sdl;

    // Annuals
    const annualGross = gross * 12;
    const annualEmployerCPF = employerCPF * 12;
    const annualEmployeeCPF = employeeCPF * 12;
    const annualSdl = sdl * 12;
    const annualNet = netSalary * 12;
    const annualTotalCost = totalEmployerCost * 12;

    return {
      gross, owContributable, employerRate, employeeRate,
      employerCPF, employeeCPF, totalCPF, sdl,
      netSalary, totalEmployerCost,
      annualGross, annualEmployerCPF, annualEmployeeCPF,
      annualSdl, annualNet, annualTotalCost,
    };
  }, [salary, age, citizenship, includeSdl]);

  const showAge = citizenship === 'citizen' || citizenship === 'pr-full';

  return (
    <div className="space-y-6">

      {/* Inputs */}
      <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-sm font-mono text-[#DAA035] uppercase tracking-wider font-bold border-b border-gray-800 pb-3">
          Employee Details
        </h3>

        {/* Gross salary */}
        <div>
          <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">
            Monthly Gross Salary (S$)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 text-sm font-bold">S$</span>
            <input
              type="number"
              min="0"
              max="50000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full bg-[#000F22] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm font-mono focus:border-[#DAA035] focus:outline-none transition-colors"
              placeholder="3000"
            />
          </div>
          {parseFloat(salary) > CPF_OW_CEILING && (
            <p className="text-[11px] text-amber-400 mt-1.5 font-mono">
              OW ceiling S$8,000 applies — CPF capped at S$8,000
            </p>
          )}
        </div>

        {/* Citizenship */}
        <div>
          <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">
            Employee Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { val: 'citizen', label: 'SC / Citizen' },
              { val: 'pr-full', label: 'PR (3rd yr+)' },
              { val: 'pr-year1', label: 'PR Year 1' },
              { val: 'pr-year2', label: 'PR Year 2' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setCitizenship(opt.val as typeof citizenship)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  citizenship === opt.val
                    ? 'border-[#DAA035] bg-[#DAA035]/10 text-[#DAA035]'
                    : 'border-gray-800 bg-[#000F22] text-[#CBCFD8] hover:border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age bracket (only for full rates) */}
        {showAge && (
          <div>
            <label className="block text-xs font-semibold text-[#CBCFD8] mb-2 uppercase tracking-wide">
              Age Bracket
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.entries(RATES).map(([key, r]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAge(key)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    age === key
                      ? 'border-[#DAA035] bg-[#DAA035]/10 text-[#DAA035]'
                      : 'border-gray-800 bg-[#000F22] text-[#CBCFD8] hover:border-gray-600'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SDL toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeSdl}
            onChange={(e) => setIncludeSdl(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: '#DAA035' }}
          />
          <span className="text-xs text-[#CBCFD8] font-medium">
            Include Skills Development Levy (SDL) — 0.25% of wages, min S$2
          </span>
        </label>
      </div>

      {/* Results */}
      {result ? (
        <div className="space-y-4">

          {/* Rate applied */}
          <div className="bg-[#DAA035]/10 border border-[#DAA035]/25 rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono text-[#DAA035] font-bold uppercase tracking-wider">Rates applied (2026)</span>
            <div className="flex gap-4 text-xs font-mono text-[#CBCFD8]">
              <span>Employer: <strong className="text-[#DAA035]">{(result.employerRate * 100).toFixed(1)}%</strong></span>
              <span>Employee: <strong className="text-[#DAA035]">{(result.employeeRate * 100).toFixed(1)}%</strong></span>
            </div>
          </div>

          {/* Monthly breakdown */}
          <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-sm font-mono text-[#DAA035] uppercase tracking-wider font-bold border-b border-gray-800 pb-3 mb-5">
              Monthly Breakdown
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Gross salary', value: `S$${fmt(result.gross)}`, highlight: false, note: result.gross > CPF_OW_CEILING ? `CPF computed on S$${fmt(CPF_OW_CEILING)} OW ceiling` : '' },
                { label: 'Employee CPF (-)', value: `S$${fmt(result.employeeCPF)}`, highlight: false, color: 'text-red-400' },
                { label: 'Net salary (take-home)', value: `S$${fmt(result.netSalary)}`, highlight: true, color: 'text-emerald-400 font-black' },
              ].map((row) => (
                <div key={row.label} className={`flex items-center justify-between py-2.5 px-4 rounded-xl ${row.highlight ? 'bg-emerald-950/25 border border-emerald-900/40' : 'bg-[#020B16] border border-gray-800'}`}>
                  <div>
                    <span className={`text-sm font-semibold ${row.highlight ? 'text-emerald-300' : 'text-white'}`}>{row.label}</span>
                    {row.note && <span className="block text-[10px] text-amber-400 mt-0.5">{row.note}</span>}
                  </div>
                  <span className={`text-sm font-mono font-bold ${row.color || (row.highlight ? 'text-emerald-300' : 'text-[#DAA035]')}`}>{row.value}</span>
                </div>
              ))}

              <div className="border-t border-gray-800 pt-3 mt-3 space-y-2">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">Employer costs</p>
                {[
                  { label: 'Employer CPF (+)', value: `S$${fmt(result.employerCPF)}`, color: 'text-red-400' },
                  ...(includeSdl ? [{ label: 'SDL (+)', value: `S$${fmt(result.sdl)}`, color: 'text-orange-400' }] : []),
                  { label: 'Total cost to employer', value: `S$${fmt(result.totalEmployerCost)}`, bold: true, color: 'text-white' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 px-4 rounded-lg bg-[#020B16] border border-gray-800">
                    <span className={`text-xs ${(row as any).bold ? 'font-bold text-white' : 'text-[#CBCFD8]'}`}>{row.label}</span>
                    <span className={`text-xs font-mono font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Annual totals */}
          <div className="bg-[#000F22] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono text-[#DAA035] uppercase tracking-wider font-bold border-b border-gray-800 pb-3 mb-5">
              Annual Totals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Annual gross', value: `S$${fmt(result.annualGross)}` },
                { label: 'Annual net (employee)', value: `S$${fmt(result.annualNet)}`, accent: true },
                { label: 'Total employer cost/yr', value: `S$${fmt(result.annualTotalCost)}`, accent: true },
                { label: 'Employer CPF/yr', value: `S$${fmt(result.annualEmployerCPF)}` },
                { label: 'Employee CPF/yr', value: `S$${fmt(result.annualEmployeeCPF)}` },
                ...(includeSdl ? [{ label: 'SDL/yr', value: `S$${fmt(result.annualSdl)}` }] : []),
              ].map((s) => (
                <div key={s.label} className={`p-4 rounded-xl border ${(s as any).accent ? 'border-[#DAA035]/30 bg-[#DAA035]/5' : 'border-gray-800 bg-[#0A1628]'}`}>
                  <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">{s.label}</span>
                  <span className={`text-base font-black font-mono ${(s as any).accent ? 'text-[#DAA035]' : 'text-white'}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-gray-600 font-mono leading-relaxed bg-[#020B16] border border-gray-800 rounded-xl px-4 py-3">
            <strong className="text-gray-500">Disclaimer:</strong> This calculator uses 2026 CPF contribution rates (OW ceiling S$8,000). Results are indicative only. Additional Wage (AW), variable pay, and CPF for foreign workers are not included. Always verify with the CPF Board for payroll compliance. We handle payroll for you — <a href="/payroll-services-singapore/" className="text-[#DAA035] hover:underline">see our payroll service</a>.
          </p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm font-mono">
          Enter a salary above to calculate CPF contributions.
        </div>
      )}
    </div>
  );
}
