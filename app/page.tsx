"use client"

import React, { useState, useEffect } from 'react'

export default function CoinKeepDashboard() {
  const [salary, setSalary] = useState(0)
  const [extraIncome, setExtraIncome] = useState(0)
  const [expenses, setExpenses] = useState<{amt: number, cat: string, dsc: string}[]>([])
  const [amtInput, setAmtInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [catInput, setCatInput] = useState('Food')

  // Load data from localStorage
  useEffect(() => {
    const savedExp = localStorage.getItem('coinkeep_exp')
    const savedSal = localStorage.getItem('coinkeep_salary')
    const savedExtra = localStorage.getItem('coinkeep_extra')
    if (savedExp) setExpenses(JSON.parse(savedExp))
    if (savedSal) setSalary(parseFloat(savedSal))
    if (savedExtra) setExtraIncome(parseFloat(savedExtra))
  }, [])

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
        <h1 style={{ color: '#D4AF37', letterSpacing: '4px' }}>COINKEEP</h1>
        <p style={{ color: '#85929E' }}>Professional Wealth Management by SOMA</p>
      </header>

      {/* Premium Banner */}
      <div style={{ border: '2px solid #D4AF37', borderRadius: '15px', padding: '20px', marginBottom: '25px', textAlign: 'center', background: '#2C3E50' }}>
        <h3 style={{ color: '#D4AF37' }}>Premium Services - Coming Soon</h3>
        <p style={{ fontSize: '0.9rem' }}>Advanced Analytics & Cyber Protection for your finances.</p>
      </div>

      {/* Income Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#2C3E50', padding: '20px', borderRadius: '12px', marginBottom: '25px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#BDC3C7' }}>Monthly Salary (JD)</label>
          <input type="number" value={salary || ''} onChange={(e) => updateIncome(e.target.value, 'salary')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', marginTop: '5px' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#BDC3C7' }}>Freelance / Extra (JD)</label>
          <input type="number" value={extraIncome || ''} onChange={(e) => updateIncome(e.target.value, 'extra')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', marginTop: '5px' }} />
        </div>
        
        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', marginTop: '15px', borderTop: '1px solid #34495E', paddingTop: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem' }}>TOTAL INCOME</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totalIncome.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem' }}>SPENT</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#E74C3C' }}>{totalSpent.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem' }}>BALANCE</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ECC71' }}>{balance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Add Expense */}
      <div style={{ background: '#2C3E50', padding: '20px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.1rem', color: '#3498DB', marginBottom: '15px' }}>Add Transaction</h2>
        <select value={catInput} onChange={(e) => setCatInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
          <option>Food</option>
          <option>Transport</option>
          <option>Utilities</option>
          <option>Shopping</option>
        </select>
        <input type="number" placeholder="Amount (JD)" value={amtInput} onChange={(e) => setAmtInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px' }} />
        <input type="text" placeholder="Description" value={descInput} onChange={(e) => setDescInput(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px' }} />
        <button onClick={addExpense} style={{ width: '100%', padding: '12px', background: '#3498DB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Add Expense</button>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.8rem', color: '#85929E' }}>
        <p>Engineered by <strong>SOMA (DEV Agency)</strong></p>
      </footer>
    </div>
  )
}
