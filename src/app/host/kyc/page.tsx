"use client";

// src/app/host/kyc/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function KycUploadPage() {
  const [type, setType] = useState('passport');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    setLoading(true);
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);
    try {
      const res = await fetch('/api/kyc/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert('KYC uploaded successfully');
        router.push('/');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Host KYC Verification</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Document Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="passport">Passport</option>
          <option value="aadhaar">Aadhaar</option>
          <option value="business_license">Business License</option>
        </select>
        <label className="block mb-2 font-medium">Document File</label>
        <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-4" />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit KYC'}
        </Button>
      </form>
    </div>
  );
}
