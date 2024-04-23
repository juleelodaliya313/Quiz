const fs = require('fs');

const counterFilePath = 'counter.txt';

// Read the current count from the file
fs.readFile(counterFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading counter file:', err);
    return;
  }

  let count = parseInt(data) || 0; // Parse the count from file or initialize to 0
  count++; // Increment the count

  // Write the updated count back to the file
  fs.writeFile(counterFilePath, count.toString(), 'utf8', (err) => {
    if (err) {
      console.error('Error writing counter file:', err);
    } else {
      console.log('Counter incremented successfully. Total runs:', count);
    }
  });

  // update the total runs js file 
  fs.writeFileSync('src/totalRuns.js', `export const totalRuns = ${count};`, 'utf8');
  console.log('Total runs injected successfully.');
});
