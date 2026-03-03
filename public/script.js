function pretty(data) {
  return JSON.stringify(data, null, 2);
}

function money(amount) {
  return `USD ${Number(amount).toFixed(2)}`;
}

function safe(value, fallback = '-') {
  return value === null || value === undefined || value === '' ? fallback : value;
}

const categoryArt = {
  electronics: '/images/headphones.svg',
  clothing: '/images/fashion.svg',
  appliances: '/images/appliance.svg'
};

function pickImageByCategory(category) {
  const key = String(category || '').toLowerCase();
  return categoryArt[key] || '/images/headphones.svg';
}

function fillMetrics(products, lowStockData) {
  const variantCount = products.reduce((sum, product) => sum + (product.variants?.length || 0), 0);
  const ratings = products.map((p) => p.avgRating).filter((r) => typeof r === 'number');
  const average = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : '-';

  document.getElementById('metricProducts').textContent = products.length;
  document.getElementById('metricVariants').textContent = variantCount;
  document.getElementById('metricLowStock').textContent = lowStockData.lowStockProducts.length;
  document.getElementById('metricRating').textContent = average;
}

function fillGallery(products) {
  const gallery = document.getElementById('categoryGallery');
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  gallery.innerHTML = uniqueCategories
    .map(
      (category) => `
      <article class="gallery-card">
        <img src="${pickImageByCategory(category)}" alt="${category} catalog visual" />
        <p class="gallery-label">${category}</p>
      </article>
    `
    )
    .join('');
}

function fillFeatured(featured) {
  document.getElementById('featuredName').textContent = safe(featured.name, 'No product');
  document.getElementById('featuredCategory').textContent = safe(featured.category);
  document.getElementById('featuredRating').textContent = `Rating: ${safe(featured.avgRating)}`;
  document.getElementById('featuredImage').src = pickImageByCategory(featured.category);

  const variantRows = document.getElementById('variantRows');
  variantRows.innerHTML = '';

  (featured.variants || []).forEach((variant) => {
    const row = document.createElement('tr');
    const isLow = variant.stock < 10;

    row.innerHTML = `
      <td>${variant.sku}</td>
      <td>${variant.color}</td>
      <td>${money(variant.price)}</td>
      <td class="${isLow ? 'stock-low' : ''}">${variant.stock}</td>
    `;

    variantRows.appendChild(row);
  });

  const reviewWrap = document.getElementById('reviewsList');
  reviewWrap.innerHTML = '';

  if (!(featured.reviews || []).length) {
    reviewWrap.innerHTML = '<p class="item-sub">No reviews yet.</p>';
    return;
  }

  featured.reviews.forEach((review) => {
    const item = document.createElement('article');
    item.className = 'review';
    item.innerHTML = `
      <strong>${review.rating}/5</strong>
      <p>${review.comment}</p>
      <p class="item-sub">User: ${review.userId}</p>
    `;

    reviewWrap.appendChild(item);
  });
}

function fillLowStock(lowStockData) {
  const wrap = document.getElementById('lowStockCards');
  wrap.innerHTML = '';

  if (!lowStockData.lowStockProducts.length) {
    wrap.innerHTML = '<p class="item-sub">No low stock products under this threshold.</p>';
    return;
  }

  lowStockData.lowStockProducts.forEach((product) => {
    const el = document.createElement('article');
    el.className = 'item-card';

    const variants = (product.lowStockVariants || [])
      .map((variant) => `${variant.sku} (${variant.color}) - stock ${variant.stock}`)
      .join('<br />');

    el.innerHTML = `
      <img class="item-thumb" src="${pickImageByCategory(product.category)}" alt="${product.name} visual" />
      <p class="item-title">${product.name}</p>
      <p class="item-sub">${safe(product.category)}</p>
      <p class="item-sub">${variants}</p>
    `;

    wrap.appendChild(el);
  });
}

function fillCategoryRatings(ratingData) {
  const wrap = document.getElementById('ratingBars');
  wrap.innerHTML = '';

  if (!ratingData.categoryRatings.length) {
    wrap.innerHTML = '<p class="item-sub">No categories found.</p>';
    return;
  }

  ratingData.categoryRatings.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'rating-row';

    const value = typeof item.avgCategoryRating === 'number' ? item.avgCategoryRating : 0;
    const width = Math.max(0, Math.min((value / 5) * 100, 100));

    row.innerHTML = `
      <div class="rating-meta">
        <span>${item._id}</span>
        <span>${item.avgCategoryRating ?? 'N/A'}</span>
      </div>
      <div class="bar"><span style="width: ${width}%"></span></div>
    `;

    wrap.appendChild(row);
  });
}

async function loadDemo() {
  try {
    const [productsRes, lowStockRes, ratingsRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/analytics/low-stock?threshold=10'),
      fetch('/api/analytics/category-ratings')
    ]);

    if (!productsRes.ok || !lowStockRes.ok || !ratingsRes.ok) {
      throw new Error('Failed to load API data. Check server logs.');
    }

    const products = await productsRes.json();
    const lowStock = await lowStockRes.json();
    const ratings = await ratingsRes.json();

    const featured = products.find((item) => item.name === 'Premium Headphones') || products[0] || {};

    fillMetrics(products, lowStock);
    fillGallery(products);
    fillFeatured(featured);
    fillLowStock(lowStock);
    fillCategoryRatings(ratings);

    document.getElementById('productOutput').textContent = pretty(featured);
    document.getElementById('lowStockOutput').textContent = pretty(lowStock);
    document.getElementById('ratingsOutput').textContent = pretty(ratings);
  } catch (error) {
    const message = `Error: ${error.message}`;
    document.getElementById('productOutput').textContent = message;
    document.getElementById('lowStockOutput').textContent = message;
    document.getElementById('ratingsOutput').textContent = message;
  }
}

loadDemo();
