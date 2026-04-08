"use client"

import React, { useState, useEffect } from 'react'

export default function CoinKeepDashboard() {
  const [salary, setSalary] = useState(0)
  const [extraIncome, setExtraIncome] = useState(0)
  const [expenses, setExpenses] = useState<{amt: number, cat: string, dsc: string, date: string}[]>([])
  const [amtInput, setAmtInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [catInput, setCatInput] = useState('Food')

  useEffect(() => {
    const savedExp = localStorage.getItem('coinkeep_exp')
    const savedSal = localStorage.getItem('coinkeep_salary')
    const savedExtra = localStorage.getItem('coinkeep_extra')
    if (savedExp) setExpenses(JSON.parse(savedExp))
    if (savedSal) setSalary(parseFloat(savedSal))
    if (savedExtra) setExtraIncome(parseFloat(savedExtra))

    const script = document.createElement('script')
    script.src = "https://cdn.jsdelivr.net/npm/chart.js"
    script.async = true
    script.onload = () => renderChart()
    document.body.appendChild(script)
  }, [])

  useEffect(() => { renderChart() }, [expenses])

  const renderChart = () => {
    const win = window as any
    if (!win.Chart) return
    const ctx = document.getElementById('myChart') as HTMLCanvasElement
    if (!ctx) return
    if (win.myChartInstance) win.myChartInstance.destroy()
    const categories = ['Food', 'Transport', 'Utilities', 'Shopping']
    const data = categories.map(cat => expenses.filter(e => e.cat === cat).reduce((sum, e) => sum + e.amt, 0))
    win.myChartInstance = new win.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{ data, backgroundColor: ['#E74C3C', '#3498DB', '#F1C40F', '#1ABC9C'], borderWidth: 0 }]
      },
      options: { plugins: { legend: { position: 'bottom', labels: { color: '#ECF0F1' } } }, cutout: '70%' }
    })
  }

  const addExpense = () => {
    if (!amtInput || !descInput) return
    const newExp = [...expenses, { amt: parseFloat(amtInput), cat: catInput, dsc: descInput, date: new Date().toLocaleDateString() }]
    setExpenses(newExp)
    localStorage.setItem('coinkeep_exp', JSON.stringify(newExp))
    setAmtInput(''); setDescInput('')
  }

  return (
    <div style={{ backgroundColor: '#1A252F', color: '#ECF0F1', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#D4AF37', letterSpacing: '4px' }}>COINKEEP</h1>
        <p style={{ color: '#85929E', fontSize: '0.8rem' }}>DEV AGENCY PROFESSIONAL</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Chart Section */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <canvas id="myChart" style={{ maxHeight: '200px' }}></canvas>
        </div>

        {/* Financials */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <input type="number" placeholder="Salary" value={salary || ''} onChange={(e) => {setSalary(parseFloat(e.target.value)); localStorage.setItem('coinkeep_salary', e.target.value)}} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#34495E', color: 'white' }} />
            <input type="number" placeholder="Extra" value={extraIncome || ''} onChange={(e) => {setExtraIncome(parseFloat(e.target.value)); localStorage.setItem('coinkeep_extra', e.target.value)}} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#34495E', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            <div><div style={{ fontSize: '0.7rem' }}>BALANCE</div><div style={{ color: '#2ECC71', fontWeight: 'bold' }}>JD {(salary + extraIncome - expenses.reduce((s,e)=>s+e.amt,0)).toFixed(2)}</div></div>
            <div><div style={{ fontSize: '0.7rem' }}>SPENT</div><div style={{ color: '#E74C3C', fontWeight: 'bold' }}>JD {expenses.reduce((s,e)=>s+e.amt,0).toFixed(2)}</div></div>
          </div>
        </div>

        {/* Add Section */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px' }}>
          <select value={catInput} onChange={(e) => setCatInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
            <option>Food</option><option>Transport</option><option>Utilities</option><option>Shopping</option>
          </select>
          <input type="number" placeholder="Amount" value={amtInput} onChange={(e) => setAmtInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px' }} />
          <input type="text" placeholder="Description" value={descInput} onChange={(e) => setDescInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px' }} />
          <button onClick={addExpense} style={{ width: '100%', padding: '12px', background: '#D4AF37', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ADD EXPENSE</button>
        </div>

        {/* THE TABLE (الجدول اللي كان ناقص) */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1rem', color: '#3498DB', marginBottom: '10px' }}>Recent Transactions</h3>
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
      </div>
    </div>
  )
}
