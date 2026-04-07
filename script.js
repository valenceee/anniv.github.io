const start = new Date (2025, 4 - 1, 8);

function updateCounter () {
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
}

updateCounter();
setInterval(updateCounter, 1000 * 60);

fetch('memories.json')
  .then(res => res.json())
  .then(memories => {
    const track = document.querySelector('.timeline-track');

    memories.forEach((memory, index) => {
      const isAbove = index % 2 === 0;
      const card = document.createElement('div');
      card.className = `tl-slot ${isAbove ? 'slot-above' : 'slot-below'}`;

      card.innerHTML = `
        <div class="tl-card-box">
          <div class="tl-photo">
            <img src="${memory.photo}" alt="${memory.title}">
          </div>
          <div class="tl-text">
            <span class="tl-date">${memory.date}</span>
            <h3 class="tl-title">${memory.title}</h3>
            <p class="tl-caption">${memory.caption}</p>
          </div>
        </div>
        <div class="tl-stem"></div>
        <div class="tl-dot"></div>
      `;

      track.appendChild(card);
    });

    const dots = document.createElement('div');
    dots.className = 'dots';

    for (let i = 0; i < 3; i++) {
      const circle = document.createElement('div');
      circle.className = 'dot';
      dots.appendChild(circle);
    }

    const kiss = document.createElement('div');
    kiss.className = 'kiss';
    kiss.textContent = '"then kiss me."';

    track.appendChild(dots);
    track.appendChild(kiss);

    const onwards = document.querySelector('.onwards-section');
    onwards.style.display = 'none';

    track.addEventListener('scroll', () => {
      const kissRect = kiss.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();

      const isVisible =
        kissRect.left >= trackRect.left &&
        kissRect.right <= trackRect.right;

      onwards.style.display = isVisible ? 'block' : 'none';
    });


    const dotsE1 = document.querySelector('.dots');
    const kissE1 = document.querySelector('.kiss');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          dotsE1.classList.add('show');
          kissE1.classList.add('show');
          observer.unobserve(dotsE1);
          observer.unobserve(kissE1);
        }
      });
    }, {
      threshold: 0.5
    });

    observer.observe(dotsE1);
    observer.observe(kissE1);


    const spine = document.querySelector('.timeline-spine');

    function updateSpineWidth() {
      const slots = track.querySelectorAll('.tl-slot');
      const lastSlot = slots[slots.length - 1];

      const trackRect = track.getBoundingClientRect();
      const lastRect = lastSlot.getBoundingClientRect();

      const width = (lastRect.left + lastRect.width / 2) - trackRect.left;
      
      spine.style.width = width + 'px';
    }

    updateSpineWidth();
    window.addEventListener('resize', updateSpineWidth);
});

const track = document.querySelector('.timeline-track');

let isDown = false;
let startX;
let scrollLeft;

track.addEventListener('mousedown', (e) => {
  isDown = true;
  track.classList.add('active');
  startX = e.pageX - track.offsetLeft;
  scrollLeft = track.scrollLeft;
});

track.addEventListener('mouseleave', () => {
  isDown = false;
  track.classList.remove('active');
});

track.addEventListener('mouseup', () => {
  isDown = false;
  track.classList.remove('active');
});

track.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - track.offsetLeft;
  const walk = (x - startX) * 1.5;
  track.scrollLeft = scrollLeft - walk;
});

fetch('secmemories.json')
  .then (res => res.json())
  .then (data => {
    const grid = document.getElementById('memoryGrid');

    data.forEach(memory2 => {
      const secCard = document.createElement('div');
      secCard.className = 'memory-card';

      secCard.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          
          <div class="card-back">
            <img src="${memory2.image}">
            <div class="card-back-text">
              <h3>${memory2.title}</h3>
              <div class="card-back-divider"></div>
              <p>${memory2.caption}</p>
            </div>
          </div>
        </div>
      `;

      secCard.addEventListener('click', () => {
        secCard.classList.toggle('flipped');
      });

      grid.appendChild(secCard);
    })
  });

document.getElementById('show-front').addEventListener('click', () => {
  document.querySelectorAll('.memory-card').forEach(card => {
    card.classList.add('flipped');
  });
});

document.getElementById('show-back').addEventListener('click', () => {
  document.querySelectorAll('.memory-card').forEach(card => {
    card.classList.remove('flipped');
  });
});


fetch('editorial.json')
  .then(res => res.json())
  .then(data => {
    const track = document.getElementById('editorialTrack');

    data.forEach((monthData, monthIndex) => {
      const group = document.createElement('div');
      group.className = `editorial-month-group ${monthIndex % 2 === 0 ? 'month-odd' : 'month-even'}`;

      const label = document.createElement('p');
      label.className = 'editorial-month-label';
      label.textContent = monthData.month;
      group.appendChild(label);

      monthData.entries.forEach(entry => {
        const row = document.createElement('div');
        row.className = 'editorial-entry';

        row.innerHTML = `
          <img class="editorial-photo" src="${entry.photo}" alt="${entry.title}">
          <div class="editorial-text">
            <h3 class="editorial-title">${entry.title}</h3>
            <p class="editorial-caption">${entry.caption}</p>
          </div>
        `;

        group.appendChild(row);
      });

      track.appendChild(group);
    });
  });              