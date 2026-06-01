import React, { useState, useMemo } from 'react';

// ─── CPF 2026 rates ──────────────────────────────────────────────────────────
const CPF_RATES: Record<string, { employer: number; employee: number }> = {
  'below-55':   { employer: 0.17,   employee: 0.20   },
  '55-60':      { employer: 0.155,  employee: 0.16   },
  '60-65':      { employer: 0.12,   employee: 0.105  },
  '65-70':      { employer: 0.095,  employee: 0.075  },
  'above-70':   { employer: 0.075,  employee: 0.05   },
  'pr-year1':   { employer: 0.04,   employee: 0.05   },
  'pr-year2':   { employer: 0.09,   employee: 0.15   },
  'work-pass':  { employer: 0,      employee: 0      },
};

const OW_CEILING = 8000;
const SDL_RATE = 0.0025;
const SDL_MIN = 2;

type AgeKey = keyof typeof CPF_RATES;

interface EmployeeRow {
  id: number;
  salary: number;
  type: AgeKey;
  name: string;
}

function calcCosts(salary: number, type: AgeKey, sdl: boolean) {
  const rates = CPF_RATES[type];
  const cappedSalary = Math.min(salary, OW_CEILING);
  const employerCPF = Math.round(cappedSalary * rates.employer);
  const employeeCPF = Math.round(cappedSalary * rates.employee);
  const sdlAmt = sdl ? Math.max(SDL_MIN, Math.round(salary * SDL_RATE * 100) / 100) : 0;
  const totalCost = salary + employerCPF + sdlAmt;
  const netPay = salary - employeeCPF;
  const markupPct = salary > 0 ? ((totalCost - salary) / salary) * 100 : 0;
  return { employerCPF, employeeCPF, sdlAmt, totalCost, netPay, markupPct };
}

const EMPLOYEE_TYPES = [
  { value: 'below-55',  label: 'Citizen / PR — below 55' },
  { value: '55-60',     label: 'Citizen / PR — 55 to 60' },
  { value: '60-65',     label: 'Citizen / PR — 60 to 65' },
  { value: '65-70',     label: 'Citizen / PR — 65 to 70' },
  { value: 'above-70',  label: 'Citizen / PR — above 70' },
  { value: 'pr-year1',  label: 'PR — Year 1 (graduated)' },
  { value: 'pr-year2',  label: 'PR — Year 2 (graduated)' },
  { value: 'work-pass', label: 'EP / S-Pass / Work Permit' },
];

const SALARY_BENCHMARKS = [3000, 4000, 5000, 6000, 8000, 10000, 12000];

let nextId = 2;

export default function EmployeeCostCalculator() {
  const [employees, setEmployees] = useState<EmployeeRow[]>([
    { id: 1, salary: 4000, type: 'below-55', name: 'Employee 1' },
  ]);
  const [sdl, setSdl] = useState(true);
  const [annualView, setAnnualView] = useState(false);
  const [showBenchmarks, setShowBenchmarks] = useState(false);

  const multi = annualView ? 12 : 1;
  const unit = annualView ? '/yr' : '/mo';

  const rows = useMemo(() =>
    employees.map(e => ({ ...e, ...calcCosts(e.salary, e.type, sdl) })),
    [employees, sdl]
  );

  const teamTotal = useMemo(() => ({
    gross:       rows.reduce((s, r) => s + r.salary, 0),
    employerCPF: rows.reduce((s, r) => s + r.employerCPF, 0),
    sdlAmt:      rows.reduce((s, r) => s + r.sdlAmt, 0),
    totalCost:   rows.reduce((s, r) => s + r.totalCost, 0),
    netPay:      rows.reduce((s, r) => s + r.netPay, 0),
  }), [rows]);

  const updateRow = (id: number, field: keyof EmployeeRow, val: string | number) =>
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));

  const addEmployee = () => {
    setEmployees(prev => [...prev, { id: nextId++, salary: 4000, type: 'below-55', name: `Employee ${prev.length + 1}` }]);
  };
  const removeEmployee = (id: number) =>
    setEmployees(prev => prev.filter(e => e.id !== id));

  const fmt = (n: number) => `S$${Math.round(n * multi).toLocaleString()}`;

  return (
    <div className="space-y-6">

      {/* ── Controls bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A1628] border border-gray-800 rounded-2xl p-4">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div
            onClick={() => setSdl(v => !v)}
            className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${sdl ? 'bg-[#DAA035]' : 'bg-gray-700'}`}
            style={{ width: 40, height: 22 }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform"
              style={{
                width: 18, height: 18,
                transform: sdl ? 'translateX(18px)' : 'translateX(0)',
              }}
            />
          </div>
          <span className="text-xs text-[#CBCFD8] font-medium">Include SDL <span className="text-gray-600">(0.25% min S$2)</span></span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div
            onClick={() => setAnnualView(v => !v)}
            className="relative cursor-pointer rounded-full transition-colors"
            style={{ width: 40, height: 22, background: annualView ? '#DAA035' : '#374151' }}
          >
            <span
              className="absolute top-0.5 bg-white rounded-full shadow transition-transform"
              style={{
                left: '0.125rem', width: 18, height: 18,
                transform: annualView ? 'translateX(18px)' : 'translateX(0)',
              }}
            />
          </div>
          <span className="text-xs text-[#CBCFD8] font-medium">Annual view</span>
        </label>

        <button
          onClick={() => setShowBenchmarks(v => !v)}
          className="text-xs font-mono text-[#DAA035] border border-[#DAA035]/30 bg-[#DAA035]/5 hover:bg-[#DAA035]/10 px-3 py-1.5 rounded-lg transition-all"
        >
          {showBenchmarks ? 'Hide' : 'Show'} benchmark table
        </button>
      </div>

      {/* ── Employee rows ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {rows.map((row, idx) => (
          <div key={row.id} className="bg-[#0A1628] border border-gray-800 rounded-2xl overflow-hidden">

            {/* Row header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60 bg-[#060f1e]">
              <input
                value={row.name}
                onChange={e => updateRow(row.id, 'name', e.target.value)}
                className="text-xs font-mono font-bold text-[#DAA035] uppercase tracking-widest bg-transparent border-none outline-none w-32"
              />
              {employees.length > 1 && (
                <button onClick={() => removeEmployee(row.id)} className="text-gray-600 hover:text-red-400 text-xs transition-colors">
                  Remove
                </button>
              )}
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Salary */}
              <div className="lg:col-span-1">
                <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Gross Monthly Salary (S$)
                </label>
                <input
                  type="number"
                  min={500} max={30000} step={100}
                  value={row.salary}
                  onChange={e => updateRow(row.id, 'salary', Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-[#DAA035] font-bold text-lg focus:border-[#DAA035] focus:outline-none transition-colors"
                />
                <input
                  type="range" min={500} max={15000} step={100}
                  value={Math.min(row.salary, 15000)}
                  onChange={e => updateRow(row.id, 'salary', parseInt(e.target.value))}
                  className="w-full mt-2 cursor-pointer"
                  style={{
                    accentColor: '#DAA035', height: '4px',
                    WebkitAppearance: 'none', appearance: 'none',
                    background: `linear-gradient(to right,#DAA035 0%,#DAA035 ${((Math.min(row.salary,15000)-500)/(15000-500))*100}%,#1a2234 ${((Math.min(row.salary,15000)-500)/(15000-500))*100}%,#1a2234 100%)`,
                    borderRadius: '9999px',
                  }}
                />
                <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#DAA035;border:2px solid #000F22;box-shadow:0 0 0 2px #DAA035;cursor:grab;}input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#DAA035;border:2px solid #000F22;cursor:grab;}`}</style>
                {row.salary > OW_CEILING && (
                  <p className="text-[10px] text-amber-400 font-mono mt-1">
                    CPF capped at S${OW_CEILING.toLocaleString()} OW ceiling
                  </p>
                )}
              </div>

              {/* Employee type */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Employee Type
                </label>
                <select
                  value={row.type}
                  onChange={e => updateRow(row.id, 'type', e.target.value as AgeKey)}
                  className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-[#CBCFD8] text-sm focus:border-[#DAA035] focus:outline-none transition-colors"
                >
                  {EMPLOYEE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {row.type === 'work-pass' && (
                  <p className="text-[10px] text-gray-500 font-mono mt-1.5">
                    EP / S-Pass holders are exempt from CPF
                  </p>
                )}
              </div>

              {/* Cost breakdown */}
              <div className="bg-[#000F22] rounded-xl p-4 space-y-2.5">
                <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest mb-3">
                  Cost Breakdown {unit}
                </p>
                {[
                  { label: 'Gross salary',    val: row.salary,      color: 'text-white',      bold: false },
                  { label: 'Employer CPF',     val: row.employerCPF, color: 'text-amber-400',  bold: false },
                  { label: 'SDL',              val: row.sdlAmt,      color: 'text-blue-400',   bold: false, hide: !sdl },
                  { label: 'Employee CPF',     val: -row.employeeCPF,color: 'text-gray-500',   bold: false, note: '(employee bears)' },
                  { label: 'Total cost to you', val: row.totalCost,  color: 'text-[#DAA035]',  bold: true },
                ].filter(r => !r.hide).map((r, i) => (
                  <div key={i} className={`flex justify-between items-center text-xs ${i === 3 && employees.length > 0 ? 'pt-2 border-t border-gray-800' : ''}`}>
                    <span className="text-gray-500">
                      {r.label}
                      {r.note && <span className="text-gray-700 text-[10px] ml-1">{r.note}</span>}
                    </span>
                    <span className={`font-bold ${r.color}`}>
                      {r.val < 0 ? `-S$${Math.abs(Math.round(r.val * multi)).toLocaleString()}` : fmt(r.val)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-800 flex justify-between items-center">
                  <span className="text-[10px] text-gray-600 font-mono">Markup over gross</span>
                  <span className="text-xs font-bold text-emerald-400">{row.markupPct.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Net pay bar */}
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 mb-1.5">
                <span>Employee take-home</span>
                <span className="text-white font-bold">{fmt(row.netPay)}{unit}</span>
                <span className="ml-auto">Your total outlay</span>
                <span className="text-[#DAA035] font-bold">{fmt(row.totalCost)}{unit}</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 rounded-l-full"
                  style={{ width: `${(row.netPay / row.totalCost) * 100}%` }}
                />
                {row.employerCPF > 0 && (
                  <div className="h-full bg-amber-500" style={{ width: `${(row.employerCPF / row.totalCost) * 100}%` }} />
                )}
                {sdl && row.sdlAmt > 0 && (
                  <div className="h-full bg-blue-500" style={{ width: `${(row.sdlAmt / row.totalCost) * 100}%` }} />
                )}
              </div>
              <div className="flex gap-4 mt-1.5 text-[9px] font-mono text-gray-600">
                <span><span className="text-emerald-500">■</span> Take-home</span>
                {row.employerCPF > 0 && <span><span className="text-amber-500">■</span> Employer CPF</span>}
                {sdl && row.sdlAmt > 0 && <span><span className="text-blue-500">■</span> SDL</span>}
              </div>
            </div>
          </div>
        ))}

        {/* Add employee button */}
        {employees.length < 10 && (
          <button
            onClick={addEmployee}
            className="w-full border border-dashed border-gray-800 hover:border-[#DAA035]/50 text-gray-600 hover:text-[#DAA035] text-xs font-mono py-3 rounded-2xl transition-all"
          >
            + Add another employee
          </button>
        )}
      </div>

      {/* ── Team total ────────────────────────────────────────────────────── */}
      {employees.length > 1 && (
        <div className="bg-[#000F22] border border-[#DAA035]/30 rounded-2xl p-5">
          <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest mb-4">
            Team Total — {employees.length} employees {unit}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total gross payroll', val: teamTotal.gross,       color: 'text-white' },
              { label: 'Total employer CPF',  val: teamTotal.employerCPF, color: 'text-amber-400' },
              { label: 'Total SDL',           val: teamTotal.sdlAmt,      color: 'text-blue-400', hide: !sdl },
              { label: 'Total cost to you',   val: teamTotal.totalCost,   color: 'text-[#DAA035]' },
            ].filter(r => !r.hide).map((r, i) => (
              <div key={i} className="bg-[#0A1628] rounded-xl p-3">
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1">{r.label}</p>
                <p className={`text-lg font-bold ${r.color}`}>{fmt(r.val)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 font-mono mt-3">
            Team markup over gross: <strong className="text-emerald-400">
              {teamTotal.gross > 0 ? (((teamTotal.totalCost - teamTotal.gross) / teamTotal.gross) * 100).toFixed(1) : 0}%
            </strong>
          </p>
        </div>
      )}

      {/* ── Benchmark table ───────────────────────────────────────────────── */}
      {showBenchmarks && (
        <div className="bg-[#0A1628] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <p className="text-xs font-mono font-bold text-[#DAA035] uppercase tracking-widest">
              Employer Cost at Common Salary Levels
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Singapore Citizen / PR, below 55, SDL included</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Gross Salary', 'Employer CPF', 'SDL', 'Total Cost', 'Markup', 'Employee Take-home'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-mono font-bold text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {SALARY_BENCHMARKS.map(sal => {
                  const c = calcCosts(sal, 'below-55', true);
                  return (
                    <tr key={sal} className="hover:bg-[#060f1e] transition-colors">
                      <td className="px-4 py-3 text-white font-bold">S${sal.toLocaleString()}</td>
                      <td className="px-4 py-3 text-amber-400 font-semibold">S${c.employerCPF.toLocaleString()}</td>
                      <td className="px-4 py-3 text-blue-400">S${c.sdlAmt.toFixed(2)}</td>
                      <td className="px-4 py-3 text-[#DAA035] font-bold">S${Math.round(c.totalCost).toLocaleString()}</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">{c.markupPct.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-gray-400">S${c.netPay.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-5 py-3 text-[10px] text-gray-600 font-mono border-t border-gray-800">
            CPF capped at S$8,000 OW ceiling. PR Year 1/2 rates differ. Work pass holders: no CPF.
          </p>
        </div>
      )}

      {/* ── Service CTA ───────────────────────────────────────────────────── */}
      <div className="bg-[#0A1628] border border-[#DAA035]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1">
          <p className="text-sm font-bold text-white mb-1">We handle your payroll and CPF every month</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            CPF calculations, MOM-compliant payslips, SDL filing — all done remotely from S$8 per employee. Fixed fee, no surprises.
          </p>
        </div>
        <a
          href="/payroll-services-singapore/"
          className="shrink-0 inline-flex items-center gap-2 bg-[#DCA33C] hover:bg-[#C8912F] text-[#000F22] font-bold text-xs px-5 py-3 rounded-xl transition-all whitespace-nowrap"
        >
          See payroll service
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

    </div>
  );
}
