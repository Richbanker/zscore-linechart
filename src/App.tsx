import React from 'react';
import ZScoreChart from './ZScoreChart';

function App() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center' }}>Z-Score Line Chart</h2>
      <ZScoreChart />
    </div>
  );
}

export default App;
