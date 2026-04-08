"use client"

import React, { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function CoinKeepDashboard() {
  const [salary, setSalary] = useState(0)
  const [extraIncome, setExtraIncome] = useState(0)
  const [expenses, setExpenses] = useState<{amt: number, cat: string, dsc: string}[]>([])
  const [amtInput, setAmtInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [catInput, setCatInput] = useState('Food')
  
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Load data
  useEffect(() => {
    const savedExp = localStorage.getItem('coinkeep_exp')
    const savedSal = localStorage.getItem('coinkeep_salary')
    const savedExtra = localStorage.getItem('coinkeep_extra')
    if (savedExp) setExpenses(JSON.parse(savedExp))
    if (savedSal) setSalary(parseFloat(savedSal))
    if (savedExtra) setExtraIncome(parseFloat(savedExtra))
  }, [])

  // Chart Logic
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const categories = ['Food', 'Transport', 'Utilities', 'Shopping']
      const data = categories.map(cat => 
        expenses.filter(e => e.cat === cat).reduce((sum, e) => sum + e.amt, 0)
      )

      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: categories,
            datasets: [{
              data: data,
              backgroundColor: ['#E74C3C', '#3498DB', '#F1C40F', '#1ABC9C'],
              borderWidth: 0,
              hoverOffset: 10
            }]
          },
          options: {
            plugins: {
              legend: { position: 'bottom', labels: { color: '#ECF0F1', font: { size: 12 } } }
            },
            cutout: '70%'
          }
        })
      }
    }
  }, [expenses])

  const totalIncome = salary + extraIncome
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amt, 0)
  const balance = totalIncome - totalSpent

  const addExpense = () => {
    if (!amtInput || !descInput) return
    const newExp = [...expenses, { amt: parseFloat(amtInput), cat: catInput, dsc: descInput }]
    setExpenses(newExp)
    localStorage.setItem('coinkeep_exp', JSON.stringify(newExp))
    setAmtInput('')
    setDescInput('')
  }

  const updateIncome = (val: string, type: 'salary' | 'extra') => {
    const num = parseFloat(val) || 0
    if (type === 'salary') {
      setSalary(num)
      localStorage.setItem('coinkeep_salary', num.toString())
    } else {
      setExtraIncome(num)
      localStorage.setItem('coinkeep_extra', num.toString())
    }
  }

  return (
    <div style={{ backgroundColor: '#1A252F', color: '#ECF0F1', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#D4AF37', letterSpacing: '4px', fontSize: '2.5rem' }}>COINKEEP</h1>
        <p style={{ color: '#85929E', fontSize: '0.9rem' }}>Engineered by SOMA - DEV Agency</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Chart Card */}
        <div style={{ background: '#2C3E50', padding: '25px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#3498DB' }}>Expense Analytics</h2>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Budget Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#2C3E50', padding: '20px', borderRadius: '15px' }}>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #34495E', paddingBottom: '15px' }}>
             <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#BDC3C7' }}>INCOME</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{totalIncome.toFixed(2)}</div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#BDC3C7' }}>SPENT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#E74C3C' }}>{totalSpent.toFixed(2)}</div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#BDC3C7' }}>BALANCE</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2ECC71' }}>{balance.toFixed(2)}</div>
             </div>
          </div>
          
          <div>
            <label style={{ fontSize: '0.7rem', color: '#BDC3C7' }}>Monthly Salary</label>
            <input type="number" value={salary || ''} onChange={(e) => updateIncome(e.target.value, 'salary')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#1A252F', color: 'white' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#BDC3C7' }}>Extra Income</label>
            <input type="number" value={extraIncome || ''} onChange={(e) => updateIncome(e.target.value, 'extra')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#1A252F', color: 'white' }} />
          </div>
        </div>

        {/* Add Expense */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '15px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#3498DB', marginBottom: '15px' }}>New Transaction</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select value={catInput} onChange={(e) => setCatInput(e.target.value)} style={{ padding: '12px', borderRadius: '8px', background: '#1A252F', color: 'white', border: 'none' }}>
              <option>Food</option>
              <option>Transport</option>
              <option>Utilities</option>
              <option>Shopping</option>
            </select>
            <input type="number" placeholder="Amount (JD)" value={amtInput} onChange={(e) => setAmtInput(e.target.value)} style={{ padding: '12px', borderRadius: '8px', background: '#1A252F', color: 'white', border: 'none' }} />
            <input type="text" placeholder="What did you buy?" value={descInput} onChange={(e) => setDescInput(e.target.value)} style={{ padding: '12px', borderRadius: '8px', background: '#1A252F', color: 'white', border: 'none' }} />
            <button onClick={addExpense} style={{ padding: '15px', background: '#3498DB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>Record Expense</button>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.8rem', color: '#85929E' }}>
        <p>&copy; 2026 CoinKeep | Verified by <strong>DEV Agency</strong></p>
      </footer>
    </div>
  )
}
