import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRLogin: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      setShowQR(true);
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_${name}_${phone}.png`;
      a.click();
    }
  };

  const qrData = JSON.stringify({ name, phone });

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-slate-900 rounded shadow-md w-full max-w-md border border-slate-700 m-0">
        <h2 className="text-xl font-bold mb-2 text-white">Login with Name & Phone</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-slate-700 bg-slate-800 text-slate-200 p-2 rounded placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full text-base"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border border-slate-700 bg-slate-800 text-slate-200 p-2 rounded placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full text-base"
          required
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded font-semibold transition">Generate QR</button>
      </form>
      {showQR && (
        <div className="mt-6 flex flex-col items-center" ref={qrRef}>
          <QRCodeCanvas value={qrData} size={200} bgColor="#0f172a" fgColor="#22d3ee" />
          <button onClick={handleDownload} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold transition">Download QR</button>
        </div>
      )}
    </div>
  );
};

export default QRLogin;
