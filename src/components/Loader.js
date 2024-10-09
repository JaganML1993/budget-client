import React from 'react';

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="spinner" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '5px solid gray', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
    <style>
      {`
      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
      `}
    </style>
  </div>
);

export default Loader;
