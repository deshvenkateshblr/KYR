let sequenceData = [];
let currentIndex = 0;

const noDataEl = document.getElementById('no-data');
const carouselEl = document.getElementById('carousel-container');
const progressEl = document.getElementById('progress-text');
const cardOrder = document.getElementById('card-order');
const cardKannada = document.getElementById('card-kannada');
const cardEnglish = document.getElementById('card-english');
const cardGotra = document.getElementById('card-gotra');
const cardName = document.getElementById('card-name');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const touchCard = document.getElementById('touch-card');

function initSequence() {
  const saved = localStorage.getItem('pindaPradanaData');
  if (!saved) {
    noDataEl.style.display = 'block';
    return;
  }

  const parsedData = JSON.parse(saved);
  
  // Filter included only
  sequenceData = parsedData.filter(item => item.include);

  // Sort numerically
  sequenceData.sort((a, b) => {
    const parse = (ord) => {
      const parts = String(ord).split('-');
      return { base: parseInt(parts[0]), sub: parts[1] ? parseInt(parts[1]) : 0 };
    };
    const valA = parse(a.order);
    const valB = parse(b.order);
    if (valA.base !== valB.base) return valA.base - valB.base;
    return valA.sub - valB.sub;
  });

  if (sequenceData.length === 0) {
    noDataEl.textContent = 'No persons included. Go back and select at least one.';
    noDataEl.style.display = 'block';
    return;
  }

  carouselEl.style.display = 'block';
  renderSlide(0);
}

function getRel(order) {
  const baseOrder = (typeof order === 'string' && order.includes('-')) 
    ? parseInt(order.split('-')[0]) 
    : parseInt(order);
  return relations.find(r => r.order === baseOrder);
}

function renderSlide(index) {
  const item = sequenceData[index];
  const rel = getRel(item.order);

  progressEl.textContent = `Person ${index + 1} of ${sequenceData.length}`;
  cardOrder.textContent = `Order: ${item.order}`;
  
  if (rel) {
    cardKannada.textContent = rel.kannada;
    cardEnglish.textContent = `${rel.sanskrit} • ${rel.english}`;
  } else {
    cardKannada.textContent = 'Unknown';
    cardEnglish.textContent = '';
  }

  cardGotra.textContent = item.gotra;
  cardName.textContent = item.name;

  btnPrev.disabled = index === 0;
  btnNext.disabled = index === sequenceData.length - 1;
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    renderSlide(currentIndex);
  }
}

function nextSlide() {
  if (currentIndex < sequenceData.length - 1) {
    currentIndex++;
    renderSlide(currentIndex);
  }
}

// ========== MOBILE SWIPE GESTURES ==========
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 45;

touchCard.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

touchCard.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const distance = touchEndX - touchStartX;
  
  if (Math.abs(distance) > minSwipeDistance) {
    if (distance < 0) {
      nextSlide(); // Swiped left -> Next
    } else {
      prevSlide(); // Swiped right -> Previous
    }
  }
}, { passive: true });

// ========== KEYBOARD NAVIGATION ==========
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

initSequence();