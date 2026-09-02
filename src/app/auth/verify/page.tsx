// src/app/auth/verify/page.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/stays');
      } else {
        alert(data.error || 'Verification failed');
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Auto‑focus on OTP field
  useEffect(() => {
    const el = document.getElementById('otp-input');
    el?.focus();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
      <Input
        id="otp-input"
        type="text"
        placeholder="6‑digit code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="mb-4"
      />
      <Button onClick={verify} disabled={otp.length !== 6 || loading} variant="primary" className="w-full">
        {loading ? 'Verifying...' : 'Verify'}
      </Button>
    </div>
  );
}
