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
    // تحميل البيانات
    const savedExp = localStorage.getItem('coinkeep_exp')
    const savedSal = localStorage.getItem('coinkeep_salary')
    const savedExtra = localStorage.getItem('coinkeep_extra')
    if (savedExp) setExpenses(JSON.parse(savedExp))
    if (savedSal) setSalary(parseFloat(savedSal))
    if (savedExtra) setExtraIncome(parseFloat(savedExtra))

    // شاشة التحميل (Splash Screen) لمدة ثانيتين
    const timer = setTimeout(() => setLoading(false), 2000)

    // تحميل مكتبة الـ Chart
    const script = document.createElement('script')
    script.src = "https://cdn.jsdelivr.net/npm/chart.js"
    script.async = true
    script.onload = () => renderChart()
    document.body.appendChild(script)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => { if(!loading) renderChart() }, [expenses, loading])

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

  // شاشة الـ Splash Screen الملكية
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
        <p style={{ color: '#85929E', fontSize: '0.9rem', fontWeight: 'bold' }}>POWERED BY SOMA</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Chart Section */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <canvas id="myChart" style={{ maxHeight: '200px' }}></canvas>
        </div>

        {/* Financials */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div className="input-group">
                <label style={{fontSize: '0.7rem', color: '#85929E'}}>SALARY</label>
                <input type="number" placeholder="Salary" value={salary || ''} onChange={(e) => {setSalary(parseFloat(e.target.value)); localStorage.setItem('coinkeep_salary', e.target.value)}} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#34495E', color: 'white' }} />
            </div>
            <div className="input-group">
                <label style={{fontSize: '0.7rem', color: '#85929E'}}>EXTRA INCOME</label>
                <input type="number" placeholder="Extra" value={extraIncome || ''} onChange={(e) => {setExtraIncome(parseFloat(e.target.value)); localStorage.setItem('coinkeep_extra', e.target.value)}} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#34495E', color: 'white' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            <div><div style={{ fontSize: '0.7rem' }}>BALANCE</div><div style={{ color: '#2ECC71', fontWeight: 'bold' }}>JD {(salary + extraIncome - expenses.reduce((s,e)=>s+e.amt,0)).toFixed(2)}</div></div>
            <div><div style={{ fontSize: '0.7rem' }}>SPENT</div><div style={{ color: '#E74C3C', fontWeight: 'bold' }}>JD {expenses.reduce((s,e)=>s+e.amt,0).toFixed(2)}</div></div>
          </div>
        </div>

        {/* Add Expense */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px' }}>
          <select value={catInput} onChange={(e) => setCatInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
            <option>Food</option><option>Transport</option><option>Utilities</option><option>Shopping</option>
          </select
