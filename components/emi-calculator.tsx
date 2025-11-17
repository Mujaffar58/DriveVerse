"use client"

import { useEffect, useState } from "react"

type Props = {
  // Pass the variant's on-road price here
  basePrice: number
  // Optional explicit maximum loan amount (you can also pass on-road price here)
  maxLoan?: number
}

// Slider step (₹)
const STEP = 1000

export default function EMICalculator({ basePrice, maxLoan }: Props) {
  // --- RAW LIMITS (max taken exactly from maxLoan/basePrice) ---
  const rawMaxLoan =
    maxLoan && maxLoan > 0
      ? maxLoan
      : basePrice && basePrice > 0
      ? basePrice
      : 500000

  // target min ≈ 20% of max, but we will adjust to align with STEP
  const approxMinLoan = Math.max(50000, Math.round(rawMaxLoan * 0.2))

  // make sure (max - min) is a multiple of STEP so slider can exactly hit max
  const diff = rawMaxLoan - approxMinLoan
  const stepsCount = Math.max(1, Math.floor(diff / STEP))
  const minLoanValue = rawMaxLoan - stepsCount * STEP // <= approxMinLoan + STEP

  const maxLoanValue = rawMaxLoan // EXACT max = on-road price

  // --- STATE ---
  const [loanAmount, setLoanAmount] = useState<number>(maxLoanValue)
  const [interestRate, setInterestRate] = useState<number>(9) // %
  const [tenureYears, setTenureYears] = useState<number>(5) // years

  // Keep loanAmount in range whenever limits or basePrice change
  useEffect(() => {
    let initial = basePrice || maxLoanValue

    if (initial < minLoanValue) initial = minLoanValue
    if (initial > maxLoanValue) initial = maxLoanValue

    // Snap to nearest STEP
    initial = Math.round(initial / STEP) * STEP

    setLoanAmount(initial)
  }, [basePrice, minLoanValue, maxLoanValue])

  // --- EMI CALCULATION ---
  const tenureMonths = tenureYears * 12
  const monthlyRate = interestRate / (12 * 100)

  let emi = 0
  if (monthlyRate === 0) {
    emi = loanAmount / tenureMonths
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths)
    emi = (loanAmount * monthlyRate * factor) / (factor - 1)
  }

  const totalPayable = emi * tenureMonths
  const totalInterest = totalPayable - loanAmount

  const formatINR = (value: number) =>
    `₹${Math.round(value).toLocaleString("en-IN")}`

  // --- UI (compact) ---
  return (
    <div className="glass p-3 rounded-lg border border-white/10">
      <h2 className="text-lg font-bold mb-3">EMI Calculator</h2>

      {/* Sliders */}
      <div className="space-y-3">
        {/* Loan Amount */}
        <div>
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-muted-foreground">Loan Amount</span>
            <span className="font-semibold">{formatINR(loanAmount)}</span>
          </div>

          <input
            type="range"
            min={minLoanValue}
            max={maxLoanValue}
            step={STEP}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-blue-500 h-1"
          />

          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>{formatINR(minLoanValue)}</span>
            <span>{formatINR(maxLoanValue)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-muted-foreground">Interest Rate</span>
            <span className="font-semibold">{interestRate.toFixed(1)}% p.a.</span>
          </div>

          <input
            type="range"
            min={6}
            max={16}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-blue-500 h-1"
          />

          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>6%</span>
            <span>16%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-muted-foreground">Tenure</span>
            <span className="font-semibold">{tenureYears} Years</span>
          </div>

          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-blue-500 h-1"
          />

          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>1 Year</span>
            <span>7 Years</span>
          </div>
        </div>
      </div>

      {/* Results – compact boxes */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="glass-sm rounded-lg p-2 border border-white/10">
          <p className="text-[10px] text-muted-foreground">Monthly EMI</p>
          <p className="text-base font-semibold">{formatINR(emi)}</p>
        </div>

        <div className="glass-sm rounded-lg p-2 border border-white/10">
          <p className="text-[10px] text-muted-foreground">Total Interest</p>
          <p className="text-base font-semibold text-amber-300">
            {formatINR(totalInterest)}
          </p>
        </div>

        <div className="glass-sm rounded-lg p-2 border border-white/10">
          <p className="text-[10px] text-muted-foreground">Total Payable</p>
          <p className="text-base font-semibold">{formatINR(totalPayable)}</p>
        </div>
      </div>

      <p className="text-[9px] text-muted-foreground mt-2">
        *Values are approximate. Actual EMI may vary as per bank / lender policy.
      </p>
    </div>
  )
}
