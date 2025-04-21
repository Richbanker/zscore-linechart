import React from 'react';
import ZScoreChart from './ZScoreChart';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Z-Score Line Chart</h2>
      <ZScoreChart />
    </div>
  );
}

export default App;
