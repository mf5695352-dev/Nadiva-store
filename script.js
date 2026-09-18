document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------
    // 1. Cart Management & Counter Update
    // ------------------------------------------
    let cartCount = 0;
    
    // Select cart badge count element in header
    const cartBadge = document.querySelector('header .relative span') || 
                      document.querySelector('.cart-badge') || 
                      document.querySelector('.nav-icons span');

    // Handle "Add to Cart" button clicks
    document.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('button, a');
        if (!targetBtn) return;

        const btnText = targetBtn.textContent.trim().toLowerCase();
        
        if (btnText === 'add to cart' || targetBtn.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            cartCount++;

            if (cartBadge) {
                cartBadge.textContent = cartCount;
            }

            // Find product title from card container
            const productCard = targetBtn.closest('div');
            const productTitle = productCard ? 
                (productCard.querySelector('h3, h4, .product-title')?.textContent.trim() || 'Product') : 
                'Product';

            alert(`"${productTitle}" has been added to your cart!`);
            window.location.href = "cart.html";
        }
    });


    // ------------------------------------------
    // 2. Search Functionality
    // ------------------------------------------
    const searchInput = document.querySelector('input[type="text"]') || 
                        document.querySelector('input[placeholder*="typing"]');

    function executeSearch() {
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (query === '') {
            alert('Please enter a keyword to search.');
        } else {
            alert(`Searching for: "${query}"`);
            // Uncomment line below to enable actual page redirection:
            // window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    }

    // Handle search button click
    document.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('button');
        if (!targetBtn) return;

        if (targetBtn.textContent.trim().toUpperCase() === 'SEARCH') {
            e.preventDefault();
            executeSearch();
        }
    });

    // Handle Enter keypress in search input
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch();
            }
        });
    }


    // ------------------------------------------
    // 3. Top Categories Selector & Filter
    // ------------------------------------------
    const categoryButtons = document.querySelectorAll('.categories-section button, button:has(svg), .category-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const currentBtn = e.currentTarget;
            
            // Remove active styles from all category buttons
            categoryButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-600', 'text-white');
            });

            // Set active state on clicked button
            currentBtn.classList.add('active', 'bg-blue-600', 'text-white');

            const categoryName = currentBtn.textContent.trim();
            console.log(`Selected Category: ${categoryName}`);
            
            // Filter product cards matching category (if applicable)
            filterProductsByCategory(categoryName);
        });
    });

    function filterProductsByCategory(category) {
        const productCards = document.querySelectorAll('.trending-section .card, .product-card');
        if (!productCards.length) return;

        productCards.forEach(card => {
            const cardCategory = card.querySelector('.category-label')?.textContent.trim().toLowerCase();
            if (category.toLowerCase() === 'all' || !cardCategory || cardCategory.includes(category.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

});