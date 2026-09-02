// src/app/auth/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const requestOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone, method: 'sms' }),
      });
      const data = await res.json();
      if (res.ok) {
        // redirect to verification page with the phone in query
        router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`);
      } else {
        alert(data.error || 'Failed to send OTP');
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign in with OTP</h2>
      <Input
        type="tel"
        placeholder="Enter your mobile number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mb-4"
      />
      <Button onClick={requestOtp} disabled={!phone || loading} variant="primary" className="w-full">
        {loading ? 'Sending...' : 'Send OTP'}
      </Button>
    </div>
  );
}
