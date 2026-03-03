function pretty(data) {
  return JSON.stringify(data, null, 2);
}

async function loadDemo() {
  try {
    const [productsRes, lowStockRes, ratingsRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/analytics/low-stock?threshold=10'),
      fetch('/api/analytics/category-ratings')
    ]);

    const products = await productsRes.json();
    const lowStock = await lowStockRes.json();
    const ratings = await ratingsRes.json();

    const featured = products.find((item) => item.name === 'Premium Headphones') || products[0] || {};

    document.getElementById('productOutput').textContent = pretty(featured);
    document.getElementById('lowStockOutput').textContent = pretty(lowStock);
    document.getElementById('ratingsOutput').textContent = pretty(ratings);
  } catch (error) {
    document.getElementById('productOutput').textContent = error.message;
    document.getElementById('lowStockOutput').textContent = error.message;
    document.getElementById('ratingsOutput').textContent = error.message;
  }
}

loadDemo();
