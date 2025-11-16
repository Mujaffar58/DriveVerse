"use client"

import { useState } from "react"

export default function EMICalculator({ basePrice }: { basePrice: number }) {
  const [principal, setPrincipal] = useState(basePrice)
  const [rate, setRate] = useState(9)
  const [tenure, setTenure] = useState(60)

  const monthlyEMI =
    (principal * (rate / 12 / 100) * Math.pow(1 + rate / 12 / 100, tenure)) /
    (Math.pow(1 + rate / 12 / 100, tenure) - 1)
  const totalAmount = monthlyEMI * tenure
  const totalInterest = totalAmount - principal

  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-2xl font-bold mb-6">EMI Calculator</h3>

      <div className="space-y-6">
        {/* Principal Amount */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Loan Amount: ₹{principal.toLocaleString("en-IN")}
          </label>
          <input
            type="range"
            min={principal * 0.5}
            max={principal}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>₹{(principal * 0.5).toLocaleString("en-IN")}</span>
            <span>₹{principal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Interest Rate: {rate.toFixed(2)}% p.a.</label>
          <input
            type="range"
            min="5"
            max="15"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>5%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Tenure: {tenure} Months ({Math.floor(tenure / 12)} Years)
          </label>
          <input
            type="range"
            min="12"
            max="84"
            step="12"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 Year</span>
            <span>7 Years</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
            <p className="text-2xl font-bold gradient-text">₹{Math.round(monthlyEMI).toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
            <p className="text-2xl font-bold text-secondary">₹{Math.round(totalInterest).toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Total Amount Payable</p>
          <p className="text-3xl font-bold">₹{Math.round(totalAmount).toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  )
}
