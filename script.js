
document.addEventListener('DOMContentLoaded', function () {
  const menTab = document.getElementById('men-tab');
  const womenTab = document.getElementById('women-tab');
  const kidsTab = document.getElementById('kids-tab');
  const productContainer = document.getElementById('product-container');

  // Fetch men's products by default
  fetchProducts('Men');

  menTab.addEventListener('click', () => fetchProducts('Men'));
  womenTab.addEventListener('click', () => fetchProducts('Women'));
  kidsTab.addEventListener('click', () => fetchProducts('Kids'));

  function fetchProducts(category) {
    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const categoryData = data.categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
        if (categoryData) {
          const products = categoryData.category_products;
          renderProducts(products);
        } else {
          throw new Error(`Category '${category}' not found.`);
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }

function renderProducts(products) {
  productContainer.innerHTML = '';

  products.forEach(product => {
    const discount = calculateDiscount(product.compare_at_price, product.price);
    const productCard = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}" class="product-image">
        ${product.badge_text ? `<div class="badge">${product.badge_text}</div>` : ''}
        <div class ="title-flex">
        <div class="product-title">${product.title}</div>
        <div class="vendor-name">${product.vendor}</div>
        </div>
        <div class ="price-flex">
        <div class="price">$${product.price}</div>
        <div class="compare-at-price">${product.compare_at_price}</div>
        <div class="discount">${discount}% off</div>
        </div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `;
    productContainer.innerHTML += productCard;
  });
}


  function calculateDiscount(compareAtPrice, price) {
    const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
    return Math.round(discount);
  }
});
