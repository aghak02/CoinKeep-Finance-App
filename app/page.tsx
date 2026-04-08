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

  // Load data from localStorage
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

      const categories = ['Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment']
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
              backgroundColor: ['#E74C3C', '#3498DB', '#F1C40F', '#1ABC9C', '#9B59B6'],
              borderWidth: 2,
              borderColor: '#2C3E50',
              hoverOffset: 10
            }]
          },
          options: {
            plugins: {
              legend: { 
                position: 'bottom', 
                labels: { color: '#ECF0F1', font: { size: 12, family: 'sans-serif' }, padding: 20 } 
              }
            },
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: false
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
      <style>{`
        input::placeholder { color: #85929E; }
        select { cursor: pointer; }
      `}</style>

      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#D4AF37', letterSpacing: '4px', fontSize: '2.2rem', fontWeight: 'bold' }}>COINKEEP</h1>
        <p style={{ color: '#85929E', fontSize: '0.9rem' }}>Engineered by SOMA - DEV Agency</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Chart Card */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1rem', color: '#3498DB', marginBottom: '15px', textTransform: 'uppercase' }}>Expense Analytics</h2>
          <div style={{ height: '250px', position: 'relative' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Financial Summary */}
        <div style={{ background: 'linear-gradient(135deg, #2C3E50 0%, #1A252F 100%)', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#BDC3C7' }}>Monthly Salary (JD)</label>
              <input type="number" value={salary || ''} onChange={(e) => updateIncome(e.target.value, 'salary')} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#34495E', color: 'white', marginTop: '5px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#BDC3C7' }}>Extra Income (JD)</label>
              <input type="number" value={extraIncome || ''} onChange={(e) => updateIncome(e.target.value, 'extra')} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#34495E', color: 'white', marginTop: '5px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #34495E', paddingTop: '15px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#BDC3C7' }}>INCOME</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totalIncome.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#BDC3C7' }}>SPENT</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#E74C3C' }}>{totalSpent.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#BDC3C7' }}>BALANCE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ECC71' }}>{balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '1rem', color: '#3498DB', marginBottom: '15px' }}>ADD TRANSACTION</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select value={catInput} onChange={(e) => setCatInput(e.target.value)} style={{ padding: '12px', borderRadius: '10px', background: '#34495E', color: 'white', border: 'none' }}>
              <option>Food</option>
              <option>Transport</option>
              <option>Utilities</option>
              <option>Shopping</option>
              <option>Entertainment</option>
            </select>
            <input type="number" placeholder="Amount (JD)" value={amtInput} onChange={(e) => setAmtInput(e.target.value)} style={{ padding: '12px', borderRadius: '10px', background: '#34495E', color: 'white', border: 'none' }} />
            <input type="text" placeholder="Description" value={descInput} onChange={(e) => setDescInput(e.target.value)} style={{ padding: '12px', borderRadius: '10px', background: '#34495E', color: 'white', border: 'none' }} />
            <button onClick={addExpense} style={{ padding: '15px', background: '#D4AF37', color: '#1A252F', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>RECORD EXPENSE</button>
          </div>
        </div>

      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.75rem', color: '#85929E' }}>
        <p>Licensed to <strong>DEV Agency Jordan</strong> | &copy; 2026</p>
      </footer>
    </div>
  )
}
