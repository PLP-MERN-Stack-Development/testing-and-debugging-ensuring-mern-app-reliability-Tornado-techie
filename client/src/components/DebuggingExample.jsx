import React, { useState } from 'react';

const DebuggingExample = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  // Intentional bug for debugging
  const handleBuggyClick = () => {
    // Bug: Modifying state directly
    count = count + 1;
    console.log('Count:', count);
  };

  // Another intentional bug
  const fetchData = async () => {
    try {
      // Bug: Incorrect API endpoint
      const response = await fetch('/api/nonexistent-endpoint');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Bug: Not setting error state
    }
  };

  // Bug: Infinite re-render potential
  const computedValue = Math.random() * count;

  return (
    <div>
      <h2>Debugging Example</h2>
      <p>Count: {count}</p>
      <button onClick={handleBuggyClick}>Buggy Increment</button>
      <button onClick={fetchData}>Fetch Data</button>
      <p>Computed: {computedValue}</p>
    </div>
  );
};

export default DebuggingExample;