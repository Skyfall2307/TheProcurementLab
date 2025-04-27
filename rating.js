const webAppUrl = 'https://script.google.com/macros/s/AKfycbxAwuNoclRvN89NSPak0ewlBfjWz8rrwmoIJ2ZkssNJZUIfieNKNo96ot37PjVpE2cY/exec';

// Dynamically detect article name based on body data attribute
const articleName = document.body.getAttribute('data-article');

const starContainer = document.getElementById('rating-stars');
const ratingText = document.getElementById('rating-count');

async function fetchRatings() {
  try {
    const res = await fetch(`${webAppUrl}?article=${encodeURIComponent(articleName)}`);
    const data = await res.json();
    ratingText.textContent = `Total ratings: ${data.totalRatings}`;
    displayStars(data.averageRating);
  } catch (error) {
    console.error('Error fetching ratings:', error);
  }
}

function displayStars(averageRating) {
  let fullStars = Math.floor(averageRating);
  let halfStar = (averageRating - fullStars) >= 0.5;
  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += `<span style="color: #6c63ff;">★</span>`;
  }
  if (halfStar) {
    starsHtml += `<span style="color: #6c63ff;">☆</span>`;
  }
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
    starsHtml += `<span style="color: #ccc;">★</span>`;
  }
  starContainer.innerHTML = starsHtml;
}

fetchRatings();

starContainer.addEventListener('click', async (e) => {
  const rect = starContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const starWidth = rect.width / 5;
  let clickedStars = Math.floor(clickX / starWidth) + 1;

  if (clickedStars > 5) clickedStars = 5;
  if (clickedStars < 1) clickedStars = 1;

  try {
    await fetch(webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `article=${encodeURIComponent(articleName)}&rating=${clickedStars}`
    });

    fetchRatings();
  } catch (error) {
    console.error('Error sending rating:', error);
  }
});
