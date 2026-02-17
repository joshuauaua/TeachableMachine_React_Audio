import React, { useEffect, useRef, useState } from 'react';

export default function LiveSpectrogram({ spectrogramData }) {
  const canvasRef = useRef(null);
  // We use a secondary canvas to buffer the image for scrolling
  const tempCanvasRef = useRef(document.createElement('canvas'));

  useEffect(() => {
    if (!spectrogramData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tempCanvas = tempCanvasRef.current;
    const tempCtx = tempCanvas.getContext('2d');

    const { data, frameSize } = spectrogramData;
    
    // Determine dimensions
    // data is a Float32Array of length frameSize * something? 
    // Usually standard spectrogram data from search-commands is a 2D array flattened.
    // However, the 'result.spectrogram' from listen() is typically { data: Float32Array, frameSize: number }
    // representing the *latest* frame(s).
    
    // Let's assume 'data' contains frequency bins.
    // If it's a single frame, length = frameSize.
    
    if (!data || !frameSize) return;

    const numFreqs = frameSize; 
    const numFrames = data.length / numFreqs;
    
    // Height of the canvas should match (or scale to) the number of frequency bins
    
    if (canvas.width === 0 || canvas.height === 0 || canvas.height !== numFreqs) {
        canvas.height = numFreqs;
        tempCanvas.height = numFreqs;
        
        // Width can be whatever we want the history to be.
        if (canvas.width !== 500) {
            canvas.width = 500;
            tempCanvas.width = 500;
             // Fill black initially
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            tempCtx.fillStyle = '#000';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        }
    }

    // Drawing logic:
    // 1. Draw current canvas to temp canvas, shifted left by 1 pixel.
    // 2. Clear current canvas.
    // 3. Draw temp canvas back to current canvas (at -1 x).
    // 4. Draw new data line at the rightmost pixel.

    // Scroll effect
    // We draw the current canvas onto the temp canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Draw temp canvas back to main, shifted left
    // We shift by sliceWidth * numFrames to keep up with real time?
    // Or just a constant speed? If we receive bursts of frames, we should plot all of them?
    // Let's plot the *last* frame for now to keep it simple, or iterate if we want speed.
    // If we plot 1 frame per update:
    
    const sliceWidth = 2; // Thinner slices for better resolution
    
    // Shift everything left
    ctx.drawImage(tempCanvas, -sliceWidth, 0);
    
    // Draw the NEWEST frame at the right edge
    // The spectrogram data usually comes as [frame0, frame1, ... frameN]
    // We want the last one: frameN.
    const lastFrameIndex = (Math.floor(numFrames) - 1) * frameSize;
    
    const x = canvas.width - sliceWidth;
    
    for (let i = 0; i < numFreqs; i++) {
        // Data structure: usually [freq0, freq1, ... freqN] for each frame?
        // OR [frame0_freq0, frame0_freq1... ]
        // We assume flat array: frame * frameSize + freqBin
        
        const value = data[lastFrameIndex + i]; 
        
        // Auto-normalize or better guess
        // Range often -100 (silence) to 0 (loud) in dB
        // Let's map -80 to 0 to 0..1
        let normalized = (value + 80) / 80;
        normalized = Math.max(0, Math.min(1, normalized));
        
        // Hue map: 240 (blue/black) to 0 (red/white)
        // Let's use a "Magma" or "Inferno" style or just simple HSL
        // 270 (purple) -> 0 (red) -> Yellow
        
        const hue = 270 * (1 - normalized); // 270=purple, 0=red. 
        const lightness = normalized * 60 + 10; // 10% to 70%
        const saturation = 100;
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Draw from bottom up
        const y = canvas.height - 1 - i;
        ctx.fillRect(x, y, sliceWidth, 1);
    }
    
  }, [spectrogramData]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden border border-gray-700">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-fill" 
        style={{ imageRendering: 'pixelated' }}
        width={500}
        height={232} // Default, will be updated
      />
    </div>
  );
}
