"use client"

import React, { useState, useEffect } from 'react'

export default function CoinKeepDashboard() {
  const [salary, setSalary] = useState(0)
  const [extraIncome, setExtraIncome] = useState(0)
  const [expenses, setExpenses] = useState<{amt: number, cat: string, dsc: string, date: string}[]>([])
  const [amtInput, setAmtInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [catInput, setCatInput] = useState('Food')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedExp = localStorage.getItem('coinkeep_exp')
      const savedSal = localStorage.getItem('coinkeep_salary')
      const savedExtra = localStorage.getItem('coinkeep_extra')
      if (savedExp) setExpenses(JSON.parse(savedExp))
      if (savedSal) setSalary(parseFloat(savedSal))
      if (savedExtra) setExtraIncome(parseFloat(savedExtra))
    }
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const addExpense = () => {
    if (!amtInput || !descInput) return
    const newExp = [...expenses, { amt: parseFloat(amtInput), cat: catInput, dsc: descInput, date: new Date().toLocaleDateString() }]
    setExpenses(newExp)
    localStorage.setItem('coinkeep_exp', JSON.stringify(newExp))
    setAmtInput(''); setDescInput('')
  }


  const categories = ['Food', 'Transport', 'Utilities', 'Shopping']
  const colors = ['#E74C3C', '#3498DB', '#F1C40F', '#1ABC9C']
  const totals = categories.map(cat => expenses.filter(e => e.cat === cat).reduce((sum, e) => sum + e.amt, 0))
  const totalSpent = totals.reduce((a, b) => a + b, 0)
  
  let cumulativePercent = 0
  const chartSlices = totals.map((amt, i) => {
    if (totalSpent === 0) return null
    const percent = (amt / totalSpent) * 100
    const start = cumulativePercent
    cumulativePercent += percent
    return { start, end: cumulativePercent, color: colors[i], label: categories[i] }
  })

  if (loading) {
    return (
      <div style={{ backgroundColor: '#1A252F', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ color: '#D4AF37', fontSize: '3.5rem', letterSpacing: '8px', fontWeight: 'bold' }}>COINKEEP</h1>
        <p style={{ color: '#BDC3C7', marginTop: '20px', fontStyle: 'italic', letterSpacing: '2px' }}>POWERED BY SOMA</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#1A252F', color: '#ECF0F1', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#D4AF37', letterSpacing: '4px' }}>COINKEEP</h1>
        <p style={{ color: '#85929E', fontSize: '0.8rem', fontWeight: 'bold' }}>POWERED BY SOMA</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
       
        <div style={{ background: '#2C3E50', padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
          <h3 style={{fontSize: '0.9rem', color: '#3498DB', marginBottom: '15px'}}>EXPENSE DISTRIBUTION</h3>
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
            <svg viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)', borderRadius: '50%' }}>
              {totalSpent === 0 ? (
                <circle cx="16" cy="16" r="16" fill="#34495E" />
              ) : (
                chartSlices.map((slice, i) => slice && (
                  <circle key={i} cx="16" cy="16" r="16" fill="transparent" stroke={slice.color} strokeWidth="32" strokeDasharray={`${slice.end - slice.start} 100`} strokeDashoffset={-slice.start} />
                ))
              )}
              <circle cx="16" cy="16" r="10" fill="#2C3E50" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#85929E' }}>TOTAL</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{totalSpent.toFixed(0)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            {categories.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: colors[i], borderRadius: '2px' }}></div>
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financials */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <input type="number" placeholder="Salary" value={salary || ''} onChange={(e) => {setSalary(parseFloat(e.target.value)); localStorage.setItem('coinkeep_salary', e.target.value)}} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#34495E', color: 'white' }} />
            <input type="number" placeholder="Extra" value={extraIncome || ''} onChange={(e) => {setExtraIncome(parseFloat(e.target.value)); localStorage.setItem('coinkeep_extra', e.target.value)}} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#34495E', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            <div><div style={{ fontSize: '0.7rem' }}>BALANCE</div><div style={{ color: '#2ECC71', fontWeight: 'bold' }}>JD {(salary + extraIncome - totalSpent).toFixed(2)}</div></div>
            <div><div style={{ fontSize: '0.7rem' }}>SPENT</div><div style={{ color: '#E74C3C', fontWeight: 'bold' }}>JD {totalSpent.toFixed(2)}</div></div>
          </div>
        </div>

        {/* Add Section */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px' }}>
          <select value={catInput} onChange={(e) => setCatInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', background: '#34495E', color: 'white' }}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Amount" value={amtInput} onChange={(e) => setAmtInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', background: '#34495E', color: 'white' }} />
          <input type="text" placeholder="Description" value={descInput} onChange={(e) => setDescInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', background: '#34495E', color: 'white' }} />
          <button onClick={addExpense} style={{ width: '100%', padding: '12px', background: '#D4AF37', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ADD EXPENSE</button>
        </div>

        {/* Table */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #34495E', color: '#85929E' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>Desc</th>
                <th style={{ textAlign: 'right', padding: '10px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #34495E' }}>
                  <td style={{ padding: '10px' }}>{exp.date}</td>
                  <td style={{ padding: '10px' }}>{exp.dsc} <br/><small style={{color: '#3498DB'}}>{exp.cat}</small></td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#E74C3C' }}>-{exp.amt.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
          <p style={{ color: '#85929E', fontSize: '0.8rem' }}>POWERED BY SOMA</p>
        </footer>
      </div>
    </div>
  )
}
