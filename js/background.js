const Background = {
  canvas: null,
  ctx: null,
  resizeTimeout: null,
  init() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.paint();
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.paint(), 200);
    });
  },
  // Simple seeded random to keep the strokes same on repaint
  seed: 12345,
  random() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  },
  paint() {
    // Half resolution for performance
    const w = window.innerWidth / 2;
    const h = window.innerHeight / 2;
    this.canvas.width = w;
    this.canvas.height = h;
    
    // Fill base colors
    const leftWidth = w * 0.435; // 50% - 6.5%
    const rightWidth = w * 0.565; // 50% + 6.5%
    
    this.ctx.fillStyle = CONFIG.colors.bgLeft;
    this.ctx.fillRect(0, 0, leftWidth, h);
    
    this.ctx.fillStyle = CONFIG.colors.bgRight;
    this.ctx.fillRect(rightWidth, 0, w - rightWidth, h);
    
    // The blend area in the middle (approx 13% of width)
    this.seed = 42; // Reset seed for consistent paint
    const centerX = w / 2;
    const blendAreaWidth = w * 0.13;
    const colors = [CONFIG.colors.bgLeft, CONFIG.colors.bgCenter, CONFIG.colors.bgRight];
    
    // Draw background for center
    this.ctx.fillStyle = CONFIG.colors.bgCenter;
    this.ctx.fillRect(leftWidth, 0, rightWidth - leftWidth, h);

    // Draw strokes
    const numStrokes = 400;
    for (let i = 0; i < numStrokes; i++) {
      const y = this.random() * h;
      const x = centerX + (this.random() - 0.5) * blendAreaWidth * 1.5;
      
      const width = 50 + this.random() * 150;
      const height = 10 + this.random() * 30;
      
      // Determine color based on x position to blend
      let colorIdx;
      const relX = (x - (centerX - blendAreaWidth/2)) / blendAreaWidth;
      if (relX < 0.3) colorIdx = this.random() > 0.3 ? 0 : 1;
      else if (relX > 0.7) colorIdx = this.random() > 0.3 ? 2 : 1;
      else colorIdx = 1;
      
      if (this.random() > 0.9) colorIdx = Math.floor(this.random() * 3);
      
      this.drawBrushStroke(x, y, width, height, colors[colorIdx]);
    }
  },
  drawBrushStroke(cx, cy, w, h, color) {
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate((this.random() - 0.5) * 0.1); // Slight tilt
    
    const grad = this.ctx.createLinearGradient(-w/2, 0, w/2, 0);
    // Convert hex to rgba to fade ends
    const r = parseInt(color.slice(1,3), 16);
    const g = parseInt(color.slice(3,5), 16);
    const b = parseInt(color.slice(5,7), 16);
    grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
    grad.addColorStop(0.2, color);
    grad.addColorStop(0.8, color);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w/2, h/2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Bristles
    if (this.random() > 0.5) {
      this.ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
      for(let i=0; i<3; i++) {
         const by = (this.random() - 0.5) * h;
         this.ctx.fillRect(-w/2.2, by, w * 0.9, 1);
      }
    }
    
    this.ctx.restore();
  }
};
