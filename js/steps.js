const Steps = {
  current: 0,
  max: 7,
  
  go(dir) {
    const next = this.current + dir;
    if (next < 0 || next > this.max) return;
    this.runStep(next);
  },
  
  runStep(step) {
    // Hide current step content
    document.querySelectorAll('.step-layer').forEach(el => el.classList.remove('active'));
    this.current = step;
    
    this.updateProgress();
    
    const layer = document.getElementById(`step-${step}`);
    if (layer) {
      // Force a reflow before adding active to restart CSS animations reliably
      void layer.offsetWidth;
      layer.classList.add('active');
    }
    
    // Shared Layer (Frames & Wishes) logic
    const sharedLayer = document.getElementById('shared-layer');
    if (step >= 2) {
      // frames are faded down for prints (4), the pre-finale (5), and the new slide (6)
      sharedLayer.style.opacity = (step === 4 || step === 5 || step === 6) ? '0.1' : '1';
    } else {
      sharedLayer.style.opacity = '0';
    }
    
    // Step specific logic
    if (step === 1) {
      document.getElementById('bg-canvas').classList.add('visible');
      if (CONFIG.features && CONFIG.features.confetti) this.fireConfetti();
    } 
    
    if (step === 2) {
      // Reveal frames
      const lFrame = document.querySelector('.left .frame');
      const rFrame = document.querySelector('.right .frame');
      
      if (!lFrame.classList.contains('frame-reveal')) {
        lFrame.classList.add('frame-reveal');
        setTimeout(() => rFrame.classList.add('frame-reveal'), 300);
        
        Slideshow.start('left');
        setTimeout(() => Slideshow.start('right'), 300);
      }
      
      if(this.current === 2) {
         document.querySelectorAll('.caption-pill').forEach(el => el.classList.add('visible'));
      }
    }
    
    if (step === 3) {
      document.querySelectorAll('.caption-pill').forEach(el => el.classList.add('visible'));
      document.querySelectorAll('.text-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 300}ms`;
        el.classList.add('visible');
      });
    } else {
      document.querySelectorAll('.text-card').forEach(el => el.classList.remove('visible'));
      if (step !== 2) {
         document.querySelectorAll('.caption-pill').forEach(el => el.classList.remove('visible'));
      }
    }
    
    if (step === 4) {
      // Deal prints
      const prints = layer.querySelectorAll('.print-card');
      prints.forEach((p, i) => {
        p.className = 'print-card'; // reset
        void p.offsetWidth;
        setTimeout(() => {
           if(this.current === 4) p.classList.add(`dealt-${i+1}`);
        }, i * 300 + 500);
      });
    }
    
    if (step === 6) {
       if (CONFIG.features && CONFIG.features.confetti) this.fireConfetti();
    }
    
    if (step >= 6) { // step 6 or 7
       const frames = document.querySelectorAll('.person-container');
       frames.forEach(f => {
           f.style.transform = `scale(0.6) translateY(-50px)`;
           f.style.opacity = '0.4';
       });
       
       const tilts = document.querySelectorAll('.frame-tilt');
       tilts.forEach(t => {
           t.style.transform = `rotateY(${t.parentElement.classList.contains('left')?5:-5}deg)`;
       });
       
       sharedLayer.style.opacity = '1';
    } else if (step < 6 && step >= 2) {
       const frames = document.querySelectorAll('.person-container');
       frames.forEach(f => {
           f.style.transform = `scale(1) translateY(0)`;
           f.style.opacity = '1';
       });
       
       const tilts = document.querySelectorAll('.frame-tilt');
       tilts.forEach(t => {
           t.style.transform = `rotateY(${t.parentElement.classList.contains('left')?3:-3}deg)`;
       });
    }
  },
  
  updateProgress() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.current);
    });
    const hint = document.querySelector('.hint');
    if (hint) {
      if (this.current > 0) hint.classList.add('hidden');
      else hint.classList.remove('hidden');
    }
  },
  
  fireConfetti() {
    const colors = (CONFIG.colors && CONFIG.colors.confetti) || ['#fff'];
    const count = 60;
    const container = document.getElementById('app');
    for(let i=0; i<count; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.left = `${Math.random() * 100}vw`;
      c.style.top = `-5vh`;
      
      const dur = 2 + Math.random() * 3;
      const delay = Math.random() * 0.5;
      const rot = Math.random() * 720 - 360;
      const x = Math.random() * 200 - 100;
      
      c.style.transition = `transform ${dur}s cubic-bezier(.22,1,.36,1) ${delay}s, opacity ${dur}s ease ${delay}s`;
      
      container.appendChild(c);
      
      void c.offsetWidth;
      c.style.transform = `translate(${x}vw, 110vh) rotate(${rot}deg)`;
      c.style.opacity = '1';
      
      setTimeout(() => {
        c.style.opacity = '0';
        setTimeout(() => c.remove(), 1000);
      }, (dur + delay) * 1000 - 500);
    }
  }
};
