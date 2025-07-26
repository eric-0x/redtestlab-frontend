'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const VerifyReportPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<null | { valid: boolean; name?: string; issuedOn?: string }>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    axios
      .get(`https://redtestlab.com/api/report/check?id=${id}`)
      .then((res) => {
        setResult(res.data);
      })
      .catch(() => {
        setError('Could not verify the report. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Report Verification</h1>
        {loading && <div className="text-gray-500">Verifying...</div>}
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        {!loading && result && (
          result.valid ? (
            <div>
              <div className="flex flex-col items-center mb-4">
                <svg className="w-16 h-16 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 12l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-lg font-semibold text-green-600">This is a valid report.</span>
              </div>
              <div className="text-left text-gray-700 mb-2">
                <div><span className="font-medium">Name:</span> {result.name}</div>
                <div><span className="font-medium">Issued On:</span> {result.issuedOn ? new Date(result.issuedOn).toLocaleString() : '-'}</div>
                <div><span className="font-medium">Report ID:</span> {id}</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-red-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-lg font-semibold text-red-600">Fake Report Detected!</span>
              <div className="text-gray-700 mt-2">This report ID is not valid in our system.</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default VerifyReportPage;
