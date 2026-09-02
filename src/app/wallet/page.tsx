// src/app/wallet/page.tsx

import { useEffect, useState } from 'react';
import PayoutModal from '../../components/PayoutModal';

interface WalletInfo {
  balance: number;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch('/api/payments/wallet');
        if (!res.ok) throw new Error('Failed to fetch wallet');
        const data = await res.json();
        setWallet({ balance: data.balance });
      } catch (err) {
        console.error(err);
      }
    }
    fetchBalance();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <section className="wallet-section">
      <h1 className="wallet-title">Your Wallet</h1>
      {wallet ? (
        <div className="balance-card glass">
          <p className="balance-label">Current Balance</p>
          <p className="balance-amount">₹ {wallet.balance.toLocaleString()}</p>
          <button className="payout-button" onClick={openModal}>
            Initiate Payout
          </button>
        </div>
      ) : (
        <p>Loading…</p>
      )}
      {showModal && <PayoutModal onClose={closeModal} currentBalance={wallet?.balance || 0} />}
      <style jsx>{`
        .wallet-section {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f4ff, #e0eafc);
          padding: 2rem;
        }
        .wallet-title {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          font-family: 'Inter', sans-serif;
          color: #2c3e50;
        }
        .balance-card {
          width: 320px;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .glass {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .balance-label {
          font-size: 1.2rem;
          color: #34495e;
          margin-bottom: 0.5rem;
        }
        .balance-amount {
          font-size: 2rem;
          font-weight: 600;
          color: #27ae60;
          margin-bottom: 1.5rem;
        }
        .payout-button {
          background: linear-gradient(90deg, #ff7e5f, #feb47b);
          border: none;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          transition: transform 0.2s ease;
        }
        .payout-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
