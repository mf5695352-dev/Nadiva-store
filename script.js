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
// ================= خطوة واحدة لربط السلة بالواتساب =================
document.addEventListener('click', function(e) {
    // مراقبة الضغط على أي زرار إتمام طلب أو Checkout في السلة
    var btn = e.target.closest('button, a, .checkout, #checkout');
    if (btn && (btn.innerText.toLowerCase().includes('check') || btn.innerText.includes('إتمام') || btn.innerText.includes('طلب'))) {
        e.preventDefault();
        
        // جلب المنتجات من السلة الذكية
        var cartData = localStorage.getItem('cart') || localStorage.getItem('products') || localStorage.getItem('cartItems');
        var cart = [];
        try { cart = JSON.parse(cartData); } catch(err) {}

        var message = "🛒 *طلب جديد من سلة المتجر*%0A%0A";
        
        if (cart && cart.length > 0) {
            message += "*المنتجات المطلوب شراءها:*%0A";
            cart.forEach(function(item, i) {
                var name = item.name || item.title || item.productName || "منتج";
                var price = item.price ? (" - " + item.price) : "";
                var qty = item.quantity || item.qty ? (" (العدد: " + (item.quantity || item.qty) + ")") : "";
                message += (i + 1) + ". " + encodeURIComponent(name + qty + price) + "%0A";
            });
        } else {
            message += "*ملاحظة:* يرجى تأكيد المنتجات الموجودة في السلة.%0A";
        }

        message += "%0A📍 *يرجى التواصل لتأكيد العنوان والتوصيل.*";

        // التوجيه المباشر للواتساب على رقمك
        window.location.href = "https://api.whatsapp.com/send?phone=201010397972&text=" + message;
    }
}, true);
// ================= الحل المضمون 100% لربط السلة بالواتساب =================
document.addEventListener('click', function (e) {
    // البحث عن أي عنصر يتداخله الضغط عليه كلمة checkout أو إتمام
    var target = e.target.closest('button, a, input, div');
    
    if (target) {
        var text = (target.innerText || target.value || '').toLowerCase();
        
        if (text.includes('checkout') || text.includes('إتمام') || text.includes('شراء')) {
            e.preventDefault();
            e.stopPropagation();

            // قراءة السلة بجميع المسميات المحتملة
            var rawCart = localStorage.getItem('cart') || localStorage.getItem('products') || localStorage.getItem('cartItems') || '[]';
            var cart = [];
            try { cart = JSON.parse(rawCart); } catch(err) {}

            var msg = "🛒 *طلب جديد من المتجر*%0A%0A";

            if (Array.isArray(cart) && cart.length > 0) {
                msg += "*تفاصيل السلة:*%0A";
                cart.forEach(function(item, index) {
                    var name = item.name || item.title || item.productName || "منتج";
                    var qty = item.quantity || item.qty || 1;
                    var price = item.price ? (" - " + item.price) : "";
                    msg += (index + 1) + ". " + name + " (العدد: " + qty + ")" + price + "%0A";
                });
            } else {
                msg += "أريد تأكيد الطلب للمنتجات المضافة في السلة.%0A";
            }

            msg += "%0A📍 *يرجى التواصل لتأكيد العنوان والشحن.*";

            // التوجيه المباشر للواتساب
            var phone = "201010397972"; // الرقم الأول
            window.location.href = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(msg);
        }
    }
}, true);
// ================= نافذة اختيار الرقم للواتساب =================
(function makeWhatsAppForce() {
    function attachWhatsAppFix() {
        var buttons = document.querySelectorAll('button, a, input[type="submit"], input[type="button"], .btn');
        buttons.forEach(function(btn) {
            var text = (btn.innerText || btn.value || '').toLowerCase().trim();
            if ((text.includes('check') || text.includes('إتمام') || text.includes('طلب') || text.includes('شراء')) && !btn.dataset.waDone) {
                btn.dataset.waDone = "true";
                
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // 1. قراءة المنتجات من السلة
                    var cart = [];
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        try {
                            var d = JSON.parse(localStorage.getItem(k));
                            if (Array.isArray(d) && d.length > 0) { cart = d; break; }
                        } catch(err) {}
                    }

                    var msg = "🛒 *طلب جديد من المتجر*%0A%0A";
                    if (cart.length > 0) {
                        msg += "*المنتجات المطلوبة:*%0A";
                        cart.forEach(function(item, idx) {
                            var name = item.name || item.title || item.productName || "منتج";
                            var qty = item.quantity || item.qty || item.count || 1;
                            msg += (idx + 1) + ". " + name + " (العدد: " + qty + ")%0A";
                        });
                    } else {
                        msg += "أريد تأكيد طلب المنتجات الموجودة في السلة.";
                    }

                    // 2. إزالة أي نافذة قديمة إن وجدت
                    var oldModal = document.getElementById('wa-phone-modal');
                    if (oldModal) oldModal.remove();

                    // 3. إنشاء النافذة التفاعلية لاختيار الرقم
                    var modalHtml = `
                        <div id="wa-phone-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:sans-serif;">
                            <div style="background:#fff; padding:20px 25px; border-radius:12px; text-align:center; max-width:320px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
                                <h3 style="margin-top:0; color:#333; font-size:18px;">اختر رقم الواتساب لإرسال الطلب:</h3>
                                <button id="wa-btn-1" style="width:100%; margin:8px 0; padding:12px; background:#25D366; color:white; border:none; border-radius:8px; font-size:15px; font-weight:bold; cursor:pointer;">01010397972 💬</button>
                                <button id="wa-btn-2" style="width:100%; margin:8px 0; padding:12px; background:#128C7E; color:white; border:none; border-radius:8px; font-size:15px; font-weight:bold; cursor:pointer;">01020189861 💬</button>
                                <button id="wa-btn-cancel" style="background:none; border:none; color:#777; margin-top:10px; cursor:pointer; font-size:13px; text-decoration:underline;">إلغاء</button>
                            </div>
                        </div>
                    `;
                    document.body.insertAdjacentHTML('beforeend', modalHtml);

                    // 4. تشغيل أزرار التوجيه للواتساب
                    document.getElementById('wa-btn-1').onclick = function() {
                        window.location.href = "https://api.whatsapp.com/send?phone=201010397972&text=" + encodeURIComponent(msg);
                    };

                    document.getElementById('wa-btn-2').onclick = function() {
                        window.location.href = "https://api.whatsapp.com/send?phone=201020189861&text=" + encodeURIComponent(msg);
                    };

                    document.getElementById('wa-btn-cancel').onclick = function() {
                        document.getElementById('wa-phone-modal').remove();
                    };

                    return false;
                }, true);
            }
        });
    }

    attachWhatsAppFix();
    setInterval(attachWhatsAppFix, 1000);
})();
// ================= سحب بيانات العميل والسلة وإرسالها للواتساب =================
(function makeWhatsAppForce() {
    function attachWhatsAppFix() {
        var buttons = document.querySelectorAll('button, a, input[type="submit"], input[type="button"], .btn');
        buttons.forEach(function(btn) {
            var text = (btn.innerText || btn.value || '').toLowerCase().trim();
            if ((text.includes('check') || text.includes('إتمام') || text.includes('طلب') || text.includes('شراء')) && !btn.dataset.waDone) {
                btn.dataset.waDone = "true";
                
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // 1. قراءة بيانات العميل من الخانات (Form Inputs)
                    var nameInput = document.querySelector('input[name*="name"], input[id*="name"], input[placeholder*="اسم"]');
                    var phoneInput = document.querySelector('input[type="tel"], input[name*="phone"], input[id*="phone"], input[placeholder*="رقم"], input[placeholder*="تليفون"]');
                    var addressInput = document.querySelector('textarea, input[name*="address"], input[id*="address"], input[placeholder*="عنوان"]');

                    var customerName = nameInput ? nameInput.value.trim() : "";
                    var customerPhone = phoneInput ? phoneInput.value.trim() : "";
                    var customerAddress = addressInput ? addressInput.value.trim() : "";

                    // 2. قراءة المنتجات من السلة
                    var cart = [];
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        try {
                            var d = JSON.parse(localStorage.getItem(k));
                            if (Array.isArray(d) && d.length > 0) { cart = d; break; }
                        } catch(err) {}
                    }

                    // 3. تجهيز نص الرسالة
                    var msg = "🛒 *طلب جديد من المتجر*%0A";
                    msg += "---------------------------%0A";
                    
                    if (customerName) msg += "👤 *الاسم:* " + customerName + "%0A";
                    if (customerPhone) msg += "📞 *الرقم:* " + customerPhone + "%0A";
                    if (customerAddress) msg += "📍 *العنوان:* " + customerAddress + "%0A";
                    
                    msg += "---------------------------%0A";

                    if (cart.length > 0) {
                        msg += "*📦 تفاصيل المنتجات:*%0A";
                        cart.forEach(function(item, idx) {
                            var name = item.name || item.title || item.productName || "منتج";
                            var qty = item.quantity || item.qty || item.count || 1;
                            var price = item.price ? (" - " + item.price) : "";
                            msg += (idx + 1) + ". " + name + " (العدد: " + qty + ")" + price + "%0A";
                        });
                    } else {
                        msg += "*المنتجات:* أريد تأكيد الطلب المضاف في السلة.%0A";
                    }

                    // 4. إنشاء النافذة لاختيار الرقم المرسل إليه
                    var oldModal = document.getElementById('wa-phone-modal');
                    if (oldModal) oldModal.remove();

                    var modalHtml = `
                        <div id="wa-phone-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:sans-serif;">
                            <div style="background:#fff; padding:20px 25px; border-radius:12px; text-align:center; max-width:320px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
                                <h3 style="margin-top:0; color:#333; font-size:18px;">اختر رقم الواتساب لإرسال الطلب:</h3>
                                <button id="wa-btn-1" style="width:100%; margin:8px 0; padding:12px; background:#25D366; color:white; border:none; border-radius:8px; font-size:15px; font-weight:bold; cursor:pointer;">01010397972 💬</button>
                                <button id="wa-btn-2" style="width:100%; margin:8px 0; padding:12px; background:#128C7E; color:white; border:none; border-radius:8px; font-size:15px; font-weight:bold; cursor:pointer;">01020189861 💬</button>
                                <button id="wa-btn-cancel" style="background:none; border:none; color:#777; margin-top:10px; cursor:pointer; font-size:13px; text-decoration:underline;">إلغاء</button>
                            </div>
                        </div>
                    `;
                    document.body.insertAdjacentHTML('beforeend', modalHtml);

                    document.getElementById('wa-btn-1').onclick = function() {
                        window.location.href = "https://api.whatsapp.com/send?phone=201010397972&text=" + encodeURIComponent(msg);
                    };

                    document.getElementById('wa-btn-2').onclick = function() {
                        window.location.href = "https://api.whatsapp.com/send?phone=201020189861&text=" + encodeURIComponent(msg);
                    };

                    document.getElementById('wa-btn-cancel').onclick = function() {
                        document.getElementById('wa-phone-modal').remove();
                    };

                    return false;
                }, true);
            }
        });
    }

    attachWhatsAppFix();
    setInterval(attachWhatsAppFix, 1000);
})();