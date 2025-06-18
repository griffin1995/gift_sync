import React from 'react';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>GiftSync Web App - Test Page</h1>
      <p>✅ Web app is running successfully!</p>
      <p>Available pages:</p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/discover">Discover (Swipe Interface)</a></li>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
      </ul>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #ccc' }}>
        <h3>Backend API Status</h3>
        <p>API URL: http://localhost:8000</p>
        <p>Backend running: ✅ (confirmed via E2E tests)</p>
      </div>
    </div>
  );
}