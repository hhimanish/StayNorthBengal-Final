"use client";

// src/components/PayoutModal.tsx

import { useState } from 'react';

interface PayoutModalProps {
  onClose: () => void;
  currentBalance: number;
}

export default function PayoutModal({ onClose, currentBalance }: PayoutModalProps) {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }
    if (amt > currentBalance) {
      setMessage('Amount exceeds current balance');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/payments/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, accountNumber, ifsc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payout failed');
      setMessage('Payout successful!');
      // Optionally refresh wallet balance in parent via window location reload or custom event
    } catch (err: any) {
      setMessage(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal glass">
        <h2 className="modal-title">Initiate Payout</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
            Amount (₹)
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              required
            />
          </label>
          <label className="modal-label">
            Account Number
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="input"
              required
            />
          </label>
          <label className="modal-label">
            IFSC Code
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              className="input"
              required
            />
          </label>
          {message && <p className="message">{message}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn cancel" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Processing…' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 1rem;
          padding: 2rem;
          width: 350px;
          max-width: 90%;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .modal-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
          color: #2c3e50;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .modal-label {
          font-size: 0.9rem;
          color: #34495e;
          display: flex;
          flex-direction: column;
        }
        .input {
          margin-top: 0.25rem;
          padding: 0.5rem;
          border-radius: 0.4rem;
          border: 1px solid #ccc;
          background: rgba(255, 255, 255, 0.6);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.4rem;
          cursor: pointer;
          font-weight: 500;
        }
        .btn.primary {
          background: linear-gradient(90deg, #ff7e5f, #feb47b);
          color: #fff;
          border: none;
        }
        .btn.cancel {
          background: #e0e0e0;
          color: #333;
          border: none;
        }
        .message {
          margin-top: 0.5rem;
          color: #d9534f;
        }
      `}</style>
    </div>
  );
}
