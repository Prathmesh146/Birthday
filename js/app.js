function getSafeText(value) {
  if (value === undefined || value === null) return '';
  return value;
}

function validateConfig() {
  const missing = [];
  const requiredKeys = [
    'people.left.name', 'people.right.name',
    'people.left.wishes.marathi', 'people.left.wishes.english',
    'people.right.wishes.marathi', 'people.right.wishes.english',
    'prints.headingMarathi', 'prints.headingEnglish', 'prints.caption',
    'finale.text1Marathi', 'finale.text1English',
    'finale.newSlideMain', 'finale.newSlideMarathi', 'finale.newSlideNamesMarathi', 'finale.newSlideNamesEnglish',
    'finale.text2Marathi', 'finale.text2English', 'finale.signature'
  ];

  requiredKeys.forEach(keyPath => {
    const keys = keyPath.split('.');
    let current = CONFIG;
    for (let k of keys) {
      if (current === undefined || current === null) break;
      current = current[k];
    }
    if (current === undefined || current === null) {
      missing.push(keyPath);
    }
  });

  if (missing.length > 0) {
    console.error('Missing CONFIG keys:', missing.join(', '));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  validateConfig();
  Background.init();
  Slideshow.preloadImages();
  
  // Build DOM based on config
  document.getElementById('title-marathi').textContent = 'वाढदिवसाच्या हार्दिक शुभेच्छा!';
  document.getElementById('title-english').textContent = 'Happy Birthday!';
  
  document.getElementById('left-name').textContent = getSafeText(CONFIG.people?.left?.name);
  document.getElementById('right-name').textContent = getSafeText(CONFIG.people?.right?.name);
  
  document.getElementById('left-wishes-m').textContent = getSafeText(CONFIG.people?.left?.wishes?.marathi);
  document.getElementById('left-wishes-e').textContent = getSafeText(CONFIG.people?.left?.wishes?.english);
  
  document.getElementById('right-wishes-m').textContent = getSafeText(CONFIG.people?.right?.wishes?.marathi);
  document.getElementById('right-wishes-e').textContent = getSafeText(CONFIG.people?.right?.wishes?.english);
  
  document.getElementById('step-4-heading-m').textContent = getSafeText(CONFIG.prints?.headingMarathi);
  document.getElementById('step-4-heading-e').textContent = getSafeText(CONFIG.prints?.headingEnglish);
  
  const printsCont = document.getElementById('prints-container');
  (CONFIG.prints?.photos || []).forEach(p => {
    const card = document.createElement('div');
    card.className = 'print-card';
    const img = document.createElement('img');
    img.src = `${CONFIG.settings.photoDir}${p}`;
    const cap = document.createElement('div');
    cap.className = 'caption';
    cap.textContent = getSafeText(CONFIG.prints?.caption);
    card.appendChild(img);
    card.appendChild(cap);
    printsCont.appendChild(card);
  });
  
  document.getElementById('step-5-text-m').textContent = getSafeText(CONFIG.finale?.text1Marathi);
  document.getElementById('step-5-text-e').textContent = getSafeText(CONFIG.finale?.text1English);
  
  // New slide (step 6)
  document.getElementById('step-6-main').textContent = getSafeText(CONFIG.finale?.newSlideMain);
  document.getElementById('step-6-marathi').textContent = getSafeText(CONFIG.finale?.newSlideMarathi);
  
  const namesM = getSafeText(CONFIG.finale?.newSlideNamesMarathi);
  const namesE = getSafeText(CONFIG.finale?.newSlideNamesEnglish);
  document.getElementById('step-6-names').textContent = namesM && namesE ? `${namesM} · ${namesE}` : namesM || namesE;
  
  if (CONFIG.features && !CONFIG.features.useScriptFont) {
     document.getElementById('step-6-main').style.fontFamily = 'var(--font-serif)';
  }
  
  // Last slide (step 7)
  document.getElementById('step-7-text-m').textContent = getSafeText(CONFIG.finale?.text2Marathi);
  document.getElementById('step-7-text-e').textContent = getSafeText(CONFIG.finale?.text2English);
  document.getElementById('step-7-sig').textContent = getSafeText(CONFIG.finale?.signature);
  
  // Key listeners
  let debounce = false;
  window.addEventListener('keydown', (e) => {
    if (debounce) return;
    debounce = true;
    setTimeout(() => debounce = false, 300); // 300ms debounce
    
    if (e.code === 'Space' || e.code === 'ArrowRight') {
       if(Steps.current === 0) {
           try { document.documentElement.requestFullscreen(); } catch(e){}
       }
       Steps.go(1);
    } else if (e.code === 'ArrowLeft') {
       Steps.go(-1);
    } else if (e.code === 'KeyM' && CONFIG.features?.music) {
       const audio = document.getElementById('bg-music');
       if(audio) {
           if(audio.paused) audio.play();
           else audio.pause();
       }
    }
  });
  
  // Init
  Steps.runStep(0);
});
