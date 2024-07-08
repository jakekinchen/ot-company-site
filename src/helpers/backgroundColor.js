document.addEventListener('DOMContentLoaded', () => {
    const imageUrl = '/backgroundImage.jpg'; // URL of your background image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = 'Anonymous'; // To avoid CORS issues if the image is from a different domain
  
    img.onload = function() {
      console.log('Image loaded successfully');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Get the pixel data of the last 200 rows
      const imageData = ctx.getImageData(0, img.height - 200, img.width, 200).data;
      const averageColor = getAverageColor(imageData);
      console.log('Average color:', averageColor);
      applyGradient(averageColor);
    };
  
    img.onerror = function() {
      console.error('Failed to load image');
    };
  
    function getAverageColor(imageData) {
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }
      
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      
      return `rgb(${r}, ${g}, ${b})`;
    }
  
    function applyGradient(color) {
      const body = document.body;
      const gradientColor = getComputedStyle(body).getPropertyValue('--dark-blue').trim();
      
      // Log the current gradient color
      console.log('Current gradient color:', gradientColor);
      
      // Calculate the top offset where the gradient should start
      const gradientStart = '140rem'; // or calculate dynamically based on the viewport size
      
      const newGradient = `linear-gradient(to bottom, ${color}, ${gradientColor} ${gradientStart}) no-repeat`;
      body.style.background = newGradient;
      
      // Force reflow to ensure the style is applied
      body.offsetHeight; // This forces a reflow
      console.log('Updated background style:', body.style.background);
    }
  });