import React from 'react';
import { ThemeProvider } from './ThemeContext';
import DynamicBackground from './DynamicBackground';
import HandbagDisplay from './HandbagDisplay'; // You need to create this component

function App() {
  return (
    <ThemeProvider>
      <DynamicBackground>
        <HandbagDisplay />
        {/* Add more components as needed */}
      </DynamicBackground>
    </ThemeProvider>
  );
}

export default App;
