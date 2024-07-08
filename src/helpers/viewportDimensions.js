// viewportDimensions.js

export function displayViewportDimensions() {
    // Create a new div element
    const viewportDisplay = document.createElement('div');
  
    // Set initial styles for the div
    viewportDisplay.style.position = 'fixed';
    viewportDisplay.style.top = '0';
    viewportDisplay.style.left = '0';
    viewportDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    viewportDisplay.style.color = 'white';
    viewportDisplay.style.padding = '5px';
    viewportDisplay.style.fontSize = '12px';
    viewportDisplay.style.zIndex = '1000';
    viewportDisplay.style.pointerEvents = 'none';
  
    // Append the div to the body
    document.body.appendChild(viewportDisplay);
  
    // Function to update the dimensions
    function updateViewportDimensions() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      viewportDisplay.textContent = `Viewport: ${width} x ${height}`;
    }
  
    // Initial update
    updateViewportDimensions();
  
    // Update the dimensions on window resize
    window.addEventListener('resize', updateViewportDimensions);
  }