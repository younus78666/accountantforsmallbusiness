import React, { useState } from 'react';
import { Check } from 'lucide-react';

const CONFIG = {
  starterPriceMonthly: 90,
  growthPriceMonthly: 250,
  fullPriceMonthly: 450,
  payrollAddonRatePerEmployee: 8,
};

export default function PlanCalculator() {
  const [sliderVal, setSliderVal] = useState(20);
  const [includePayroll, setIncludePayroll] = useState(false);
  const [staffCount, setStaffCount] = useState(3);

  const getCalculatedPrice = () => {
    let base = CONFIG.starterPriceMonthly;
    let planName = 'Starter Plan';
    let desc = 'Ideal for sole proprietors with light transactions.';

    if (sliderVal <= 30) {
      base = CONFIG.starterPriceMonthly;
      planName = 'Starter Plan';
      desc = 'Ideal for sole proprietors with light transactions.';
    } else if (sliderVal <= 100) {
      base = CONFIG.growthPriceMonthly;
      planName = 'Growth Plan';
      desc = 'Best for scaling SMEs with periodic management numbers.';
    } else {
      base = CONFIG.fullPriceMonthly;
      planName = 'Full Managed Plan';
      desc = 'Comprehensive accounting with employees.';
    }

    const extra = includePayroll && planName !== 'Starter Plan'
      ? CONFIG.payrollAddonRatePerEmployee * staffCount
      : 0;

    return { planName, total: base + extra, base, extra, desc };
  };

  const calc = getCalculatedPrice();

  return (
    <section className="bg-[#F1F5F9] py-20 border-y border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch relative overflow-hidden text-gray-900">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#DAA035]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left info */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-center relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DAA035]" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
              <span className="text-xs font-mono text-[#DAA035] uppercase tracking-widest block font-bold">PLAN CUSTOMIZER & ESTIMATOR</span>
            </div>
            <h3 className="text-3xl font-sans text-[#000F22] font-extrabold tracking-tight leading-tight">
              Configure Your Remote Accounting Plan
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 font-sans">
              Project your monthly bookkeeping budget with complete accuracy. Drag the slider below to select your transaction tier.
            </p>
            <div className="p-5 bg-[#F8FAFC] rounded-2xl space-y-3.5 border border-gray-200 shadow-sm">
              {[
                'Includes SFRS Financial Statements',
                'Dedicated Named Accountant Liaison',
                'Zero setup or transition charges',
              ].map((item) => (
                <p key={item} className="text-xs text-gray-700 flex items-center gap-2.5 font-sans font-medium">
                  <Check className="w-4 h-4 text-[#DAA035] shrink-0" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Right interactive */}
          <div className="lg:col-span-7 bg-[#0A1628] p-6 sm:p-8 rounded-2xl border border-gray-900 space-y-6 shadow-2xl relative z-10 text-white">

            {/* Slider */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-mono">
                <span className="text-gray-400 uppercase tracking-widest font-bold">Monthly Transactions</span>
                <span className="text-sm text-[#DAA035] bg-[#DAA035]/15 border border-[#DAA035]/35 rounded-md px-2.5 py-1 font-bold self-start sm:self-auto">
                  {sliderVal} transactions
                </span>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min={5}
                  max={150}
                  value={sliderVal}
                  onChange={(e) => setSliderVal(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-950 rounded-lg cursor-pointer focus:outline-none"
                  style={{ accentColor: '#DAA035' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-mono pt-1">
                <span>Min (5)</span>
                <span>Sole Prop (30)</span>
                <span>SME (100)</span>
                <span>Max (150+)</span>
              </div>
            </div>

            {/* Payroll toggle */}
            {sliderVal > 30 && (
              <div className="p-4 bg-[#020B16] rounded-xl space-y-4 border border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={includePayroll}
                    onChange={(e) => setIncludePayroll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 cursor-pointer"
                    style={{ accentColor: '#DAA035' }}
                  />
                  <span className="text-xs text-white font-semibold group-hover:text-[#DAA035] transition-colors">
                    Include Payroll & CPF submission add-on?
                  </span>
                </label>
                {includePayroll && (
                  <div className="flex items-center gap-4 bg-gray-950/40 p-3 rounded-lg border border-gray-800 animate-fadeIn">
                    <span className="text-xs text-[#CBCFD8]">Staff count:</span>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={staffCount}
                      onChange={(e) => setStaffCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white text-center font-bold font-mono focus:border-[#DAA035] focus:outline-none"
                    />
                    <span className="text-[11px] text-gray-400">(S${CONFIG.payrollAddonRatePerEmployee} per employee)</span>
                  </div>
                )}
              </div>
            )}

            {/* Price output */}
            <div className="bg-[#020B16] p-5 rounded-xl border border-[#DAA035]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#DAA035]/50 transition-colors">
              <div className="space-y-1">
                <p className="text-[10px] text-[#DAA035] uppercase font-mono tracking-widest font-bold">{calc.planName}</p>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">{calc.desc}</p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[#DAA035] font-mono text-[10px] uppercase tracking-wider block font-bold">ESTIMATED PRICE</span>
                <span className="text-white font-sans text-3xl font-black tracking-tight">
                  S${calc.total}
                  <span className="text-xs font-normal text-gray-400 font-mono"> /mo</span>
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href="/contact/"
                className="text-xs text-[#DAA035] hover:text-white font-mono tracking-wider flex items-center justify-center gap-1.5 mx-auto font-bold transition-colors"
              >
                BOOK CONCURRENT DIRECT REVIEW &nbsp;&rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
