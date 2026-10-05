const Slideshow = {
  intervals: {},
  images: { left: [], right: [], prints: [] },
  currentIndex: { left: 0, right: 0 },
  
  preloadImages() {
    const dir = CONFIG.settings.photoDir;
    ['left', 'right'].forEach(side => {
      CONFIG.people[side].photos.forEach(filename => {
        const img = new Image();
        img.src = `${dir}${filename}`;
        this.images[side].push(img);
      });
    });
    CONFIG.prints.photos.forEach(filename => {
       const img = new Image();
       img.src = `${dir}${filename}`;
       this.images.prints.push(img);
    });
  },
  
  start(side) {
    if (this.intervals[side]) return;
    this.updateImage(side);
    this.intervals[side] = setInterval(() => {
      this.currentIndex[side] = (this.currentIndex[side] + 1) % this.images[side].length;
      this.updateImage(side);
    }, CONFIG.settings.slideshowInterval);
  },
  
  stop(side) {
    clearInterval(this.intervals[side]);
    this.intervals[side] = null;
  },
  
  updateImage(side) {
    const frame = document.querySelector(`.person-container.${side} .frame`);
    if (!frame) return;
    
    const nextImgObj = this.images[side][this.currentIndex[side]];
    if (!nextImgObj || !nextImgObj.src) return;
    
    const currentImg = frame.querySelector('img.active');
    
    const newImg = document.createElement('img');
    newImg.src = nextImgObj.src;
    // Decode before showing to avoid jank
    newImg.decode().then(() => {
      frame.appendChild(newImg);
      // Trigger reflow
      void newImg.offsetWidth;
      newImg.classList.add('active');
      
      // Animate shine
      const shine = document.createElement('div');
      shine.className = 'frame-shine shine-anim';
      frame.appendChild(shine);
      setTimeout(() => shine.remove(), 1500);
      
      if (currentImg) {
        currentImg.classList.remove('active');
        currentImg.classList.add('exiting');
        setTimeout(() => currentImg.remove(), 800);
      }
    }).catch(e => {
      // Missing photo, skip quietly
      console.warn('Skipped missing photo', nextImgObj.src);
    });
  }
};
