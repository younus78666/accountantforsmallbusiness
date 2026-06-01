import React, { useState, useMemo } from 'react';

const fmt = (n: number) =>
  `S$${Math.round(n).toLocaleString('en-SG')}`;
const fmtDec = (n: number) =>
  `S$${n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface CostRow { id: number; label: string; amount: number }

let nextId = 2;

export default function BreakevenCalculator() {
  // Fixed costs
  const [fixedCosts, setFixedCosts] = useState<CostRow[]>([
    { id: 1, label: 'Rent / office',     amount: 3000 },
    { id: 2, label: 'Staff salaries',    amount: 8000 },
    { id: 3, label: 'Software & tools',  amount: 500  },
    { id: 4, label: 'Marketing budget',  amount: 1000 },
  ]);

  // Revenue & variable
  const [sellPrice,   setSellPrice]   = useState(150);
  const [varCostUnit, setVarCostUnit] = useState(60);
  const [targetProfit, setTargetProfit] = useState(5000);
  const [showTarget, setShowTarget]   = useState(false);
  const [currentUnits, setCurrentUnits] = useState(0);

  // Helpers
  const addRow = () =>
    setFixedCosts(p => [...p, { id: nextId++, label: '', amount: 0 }]);
  const removeRow = (id: number) =>
    setFixedCosts(p => p.filter(r => r.id !== id));
  const updateRow = (id: number, field: 'label' | 'amount', val: string | number) =>
    setFixedCosts(p => p.map(r => r.id === id ? { ...r, [field]: val } : r));

  const totalFixed = useMemo(
    () => fixedCosts.reduce((s, r) => s + r.amount, 0),
    [fixedCosts]
  );

  const contribution = sellPrice - varCostUnit;
  const cmRatio      = sellPrice > 0 ? (contribution / sellPrice) * 100 : 0;

  const beUnits   = contribution > 0 ? Math.ceil(totalFixed / contribution) : 0;
  const beRevenue = beUnits * sellPrice;

  const tgtUnits   = contribution > 0 && showTarget
    ? Math.ceil((totalFixed + targetProfit) / contribution)
    : 0;
  const tgtRevenue = tgtUnits * sellPrice;

  const currentRevenue = currentUnits * sellPrice;
  const currentProfit  = currentRevenue - totalFixed - currentUnits * varCostUnit;
  const gapUnits       = Math.max(0, beUnits - currentUnits);
  const pctToBreakeven = beUnits > 0 ? Math.min(100, (currentUnits / beUnits) * 100) : 0;

  const safeDiv = contribution <= 0;

  return (
    <div className="space-y-6">

      {/* ── Inputs grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Fixed costs */}
        <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5">
          <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest mb-4">
            Monthly Fixed Costs (S$)
          </p>
          <div className="space-y-2.5 mb-3">
            {fixedCosts.map(r => (
              <div key={r.id} className="flex items-center gap-2">
                <input
                  value={r.label}
                  onChange={e => updateRow(r.id, 'label', e.target.value)}
                  placeholder="Cost item"
                  className="flex-1 bg-[#000F22] border border-gray-800 rounded-lg px-3 py-2 text-xs text-[#CBCFD8] placeholder-gray-700 focus:border-[#DAA035] focus:outline-none"
                />
                <input
                  type="number" min={0} step={100}
                  value={r.amount}
                  onChange={e => updateRow(r.id, 'amount', Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-24 bg-[#000F22] border border-gray-800 rounded-lg px-3 py-2 text-xs text-[#DAA035] font-bold focus:border-[#DAA035] focus:outline-none text-right"
                />
                {fixedCosts.length > 1 && (
                  <button onClick={() => removeRow(r.id)} className="text-gray-700 hover:text-red-400 text-xs transition-colors w-5 shrink-0">✕</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addRow}
            className="text-xs text-gray-600 hover:text-[#DAA035] font-mono transition-colors">
            + Add cost item
          </button>
          <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
            <span className="text-xs text-gray-500">Total fixed costs</span>
            <span className="text-base font-bold text-white">{fmt(totalFixed)}/mo</span>
          </div>
        </div>

        {/* Revenue & variable */}
        <div className="space-y-4">
          <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5 space-y-4">
            <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest">
              Revenue & Variable Costs
            </p>
            {[
              { label: 'Selling price per unit / sale', val: sellPrice, set: setSellPrice, color: 'text-emerald-400' },
              { label: 'Variable cost per unit / sale', val: varCostUnit, set: setVarCostUnit, color: 'text-red-400' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-[10px] text-gray-500 font-mono mb-1.5">{f.label}</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-mono shrink-0">S$</span>
                  <input
                    type="number" min={0} step={1}
                    value={f.val}
                    onChange={e => f.set(Math.max(0, parseFloat(e.target.value) || 0))}
                    className={`flex-1 bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 ${f.color} font-bold text-lg focus:border-[#DAA035] focus:outline-none transition-colors`}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-800 grid grid-cols-2 gap-3">
              <div className="bg-[#000F22] rounded-xl p-3">
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1">Contribution Margin</p>
                <p className={`text-base font-bold ${contribution > 0 ? 'text-[#DAA035]' : 'text-red-400'}`}>{fmtDec(contribution)}</p>
              </div>
              <div className="bg-[#000F22] rounded-xl p-3">
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1">CM Ratio</p>
                <p className={`text-base font-bold ${contribution > 0 ? 'text-[#DAA035]' : 'text-red-400'}`}>{cmRatio.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Current sales (optional) */}
          <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5">
            <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">
              Current monthly sales (units) — optional
            </label>
            <input
              type="number" min={0} step={1}
              value={currentUnits || ''}
              onChange={e => setCurrentUnits(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-[#CBCFD8] font-bold focus:border-[#DAA035] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Warning if CM <= 0 ─────────────────────────────────────── */}
      {safeDiv && (
        <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-4 text-xs text-red-300">
          Variable cost per unit exceeds selling price. Contribution margin is negative — you lose money on every sale. Raise your price or reduce variable costs before calculating break-even.
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────────── */}
      {!safeDiv && (
        <>
          {/* Main break-even numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Break-even Units/mo', val: beUnits.toLocaleString(), color: 'text-[#DAA035]' },
              { label: 'Break-even Revenue/mo', val: fmt(beRevenue), color: 'text-[#DAA035]' },
              { label: 'Contribution Margin', val: fmtDec(contribution), color: 'text-emerald-400' },
              { label: 'CM Ratio', val: `${cmRatio.toFixed(1)}%`, color: 'text-blue-400' },
            ].map((k, i) => (
              <div key={i} className="bg-[#0A1628] border border-gray-800 rounded-xl p-4">
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1.5">{k.label}</p>
                <p className={`text-lg font-bold ${k.color}`}>{k.val}</p>
              </div>
            ))}
          </div>

          {/* Progress toward break-even */}
          {currentUnits > 0 && (
            <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest">
                  Current Position
                </p>
                <span className={`text-xs font-bold font-mono ${currentProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {currentProfit >= 0 ? `Profit: ${fmt(currentProfit)}/mo` : `Loss: ${fmt(Math.abs(currentProfit))}/mo`}
                </span>
              </div>
              <div className="h-3 bg-gray-900 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${currentUnits >= beUnits ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${pctToBreakeven}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-600">
                <span>0 units</span>
                <span>{pctToBreakeven.toFixed(0)}% to break-even</span>
                <span>{beUnits} units</span>
              </div>
              {gapUnits > 0 && (
                <p className="text-xs text-amber-400 font-mono mt-2">
                  Need {gapUnits} more units ({fmt(gapUnits * sellPrice)}) to break even
                </p>
              )}
              {currentUnits >= beUnits && (
                <p className="text-xs text-emerald-400 font-mono mt-2">
                  You are {currentUnits - beUnits} units above break-even
                </p>
              )}
            </div>
          )}

          {/* Formula explanation */}
          <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5">
            <p className="text-[10px] font-mono font-bold text-[#DAA035] uppercase tracking-widest mb-4">How It Is Calculated</p>
            <div className="space-y-2 text-xs font-mono text-gray-400">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-900">
                <span>Contribution margin per unit</span>
                <span className="text-[#DAA035]">{fmtDec(sellPrice)} − {fmtDec(varCostUnit)} = <strong className="text-white">{fmtDec(contribution)}</strong></span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-900">
                <span>Break-even units</span>
                <span className="text-[#DAA035]">{fmt(totalFixed)} ÷ {fmtDec(contribution)} = <strong className="text-white">{beUnits} units</strong></span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-900">
                <span>Break-even revenue</span>
                <span className="text-[#DAA035]">{beUnits} × {fmtDec(sellPrice)} = <strong className="text-white">{fmt(beRevenue)}</strong></span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>CM ratio</span>
                <span className="text-[#DAA035]">{fmtDec(contribution)} ÷ {fmtDec(sellPrice)} = <strong className="text-white">{cmRatio.toFixed(1)}%</strong></span>
              </div>
            </div>
          </div>

          {/* Target profit toggle */}
          <div className="bg-[#0A1628] border border-gray-800 rounded-2xl p-5">
            <label className="flex items-center gap-3 cursor-pointer select-none mb-4">
              <div
                onClick={() => setShowTarget(v => !v)}
                className="relative cursor-pointer rounded-full transition-colors shrink-0"
                style={{ width: 40, height: 22, background: showTarget ? '#DAA035' : '#374151' }}
              >
                <span className="absolute top-0.5 bg-white rounded-full shadow transition-transform"
                  style={{ left: '0.125rem', width: 18, height: 18, transform: showTarget ? 'translateX(18px)' : 'translateX(0)' }} />
              </div>
              <span className="text-xs font-semibold text-[#CBCFD8]">Calculate units needed for a profit target</span>
            </label>
            {showTarget && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-500 font-mono mb-1.5">Monthly profit target (S$)</label>
                  <input
                    type="number" min={0} step={500}
                    value={targetProfit}
                    onChange={e => setTargetProfit(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#000F22] border border-gray-800 rounded-xl px-4 py-2.5 text-[#DAA035] font-bold text-lg focus:border-[#DAA035] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#000F22] rounded-xl p-3">
                    <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1">Units needed</p>
                    <p className="text-lg font-bold text-white">{tgtUnits.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#000F22] rounded-xl p-3">
                    <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1">Revenue needed</p>
                    <p className="text-lg font-bold text-emerald-400">{fmt(tgtRevenue)}/mo</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* CTA */}
      <div className="bg-[#0A1628] border border-[#DAA035]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1">
          <p className="text-sm font-bold text-white mb-1">Know your numbers every month, not just at break-even</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Accurate monthly P&L shows whether you are above or below break-even at any point. We handle bookkeeping so you always know your real contribution margin and profit position.
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
