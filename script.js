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
document.addEventListener("DOMContentLoaded", function () {
    const checkoutBtns = document.querySelectorAll("button, a, input[type='submit']");
    checkoutBtns.forEach(btn => {
        const text = (btn.innerText || btn.value || "").toLowerCase();
        if (text.includes("إتمام") || text.includes("check") || text.includes("طلب")) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                // 1. قراءة البيانات
                const name = document.querySelector("input[placeholder*='اسم']")?.value || "";
                const phone = document.querySelector("input[type='tel'], input[placeholder*='رقم']")?.value || "";
                const address = document.querySelector("textarea, input[placeholder*='عنوان']")?.value || "";

                // 2. قراءة السلة
                let cart = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    try {
                        const parsed = JSON.parse(localStorage.getItem(key));
                        if (Array.isArray(parsed) && parsed.length > 0) { cart = parsed; break; }
                    } catch (err) {}
                }

                // 3. تجهيز الرسالة
                let msg = "🛒 *طلب جديد*%0A";
                msg += `👤 *الاسم:* ${name}%0A`;
                msg += `📞 *الرقم:* ${phone}%0A`;
                msg += `📍 *العنوان:* ${address}%0A%0A`;
                msg += "📦 *المنتجات:*%0A";
                cart.forEach((item, index) => {
                    msg += `${index + 1}. ${item.name || item.title} (العدد: ${item.quantity || 1})%0A`;
                });

                // 4. الاختيار المباشر
                if (confirm("اختر (موافق) للرقم الأول: 01010397972 أو (إلغاء) للرقم الثاني: 01020189861")) {
                    window.open(`https://api.whatsapp.com/send?phone=201010397972&text=${encodeURIComponent(msg)}`, "_blank");
                } else {
                    window.open(`https://api.whatsapp.com/send?phone=201020189861&text=${encodeURIComponent(msg)}`, "_blank");
                }
            });
        }
    });
});
// ================= إرسال البيانات + السلة بعد التعبئة =================
(function waCheckoutSystem() {
    function initWA() {
        // البحث عن جميع الأزرار والخانات في الصفحة
        var allInputs = document.querySelectorAll('input, textarea');
        var buttons = document.querySelectorAll('button, a, input[type="submit"], input[type="button"], .btn');

        buttons.forEach(function(btn) {
            var text = (btn.innerText || btn.value || '').toLowerCase().trim();
            
            // استهداف زرار الإرسال النهائي
            if ((text.includes('إتمام') || text.includes('طلب') || text.includes('شراء') || text.includes('إرسال') || text.includes('confirm') || text.includes('checkout')) && !btn.dataset.waReady) {
                btn.dataset.waReady = "true";

                btn.addEventListener('click', function(e) {
                    // قراءة بيانات العميل لحظة الضغط على الزرار
                    var name = "", phone = "", address = "";

                    allInputs.forEach(function(inp) {
                        var val = inp.value ? inp.value.trim() : "";
                        var ph = (inp.placeholder || "").toLowerCase();
                        var n = (inp.name || "").toLowerCase();
                        var id = (inp.id || "").toLowerCase();
                        var type = (inp.type || "").toLowerCase();

                        if (val) {
                            if (ph.includes("اسم") || n.includes("name") || id.includes("name")) {
                                name = val;
                            } else if (type === "tel" || ph.includes("رقم") || ph.includes("هاتف") || ph.includes("تليفون") || n.includes("phone") || id.includes("phone")) {
                                phone = val;
                            } else if (ph.includes("عنوان") || n.includes("address") || id.includes("address") || inp.tagName === "TEXTAREA") {
                                address = val;
                            }
                        }
                    });

                    // لو الخانات فضيت، جرب يجيب أول ٣ خانات بالترتيب
                    if (!name && allInputs[0] && allInputs[0].value) name = allInputs[0].value.trim();
                    if (!phone && allInputs[1] && allInputs[1].value) phone = allInputs[1].value.trim();
                    if (!address && allInputs[2] && allInputs[2].value) address = allInputs[2].value.trim();

                    // لو العميل لسه مكتبش البيانات، سيبه يكملهم في الموقع
                    if (!name && !phone) {
                        return; // يترك الفورم يشتغل عادي أو يطلب التعبئة
                    }

                    // لو كتب البيانات، نوقف الانتقال العادي ونحوله للواتساب
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // قراءة سلة المنتجات
                    var cart = [];
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        try {
                            var d = JSON.parse(localStorage.getItem(k));
                            if (Array.isArray(d) && d.length > 0) { cart = d; break; }
                        } catch(err) {}
                    }

                    // صياغة الرسالة الشاملة
                    var msg = "🛒 *طلب جديد من المتجر*%0A";
                    msg += "---------------------------%0A";
                    msg += "👤 *الاسم:* " + (name || "غير محدد") + "%0A";
                    msg += "📞 *الرقم:* " + (phone || "غير محدد") + "%0A";
                    msg += "📍 *العنوان:* " + (address || "غير محدد") + "%0A";
                    msg += "---------------------------%0A";

                    if (cart.length > 0) {
                        msg += "*📦 المنتجات المطلوبة:*%0A";
                        cart.forEach(function(item, idx) {
                            var title = item.name || item.title || item.productName || "منتج";
                            var qty = item.quantity || item.qty || item.count || 1;
                            msg += (idx + 1) + ". " + title + " (العدد: " + qty + ")%0A";
                        });
                    } else {
                        msg += "*المنتجات:* تفاصيل السلة المضافة.%0A";
                    }

                    // ظهور نافذة اختيار الرقمين
                    var oldModal = document.getElementById('wa-phone-modal');
                    if (oldModal) oldModal.remove();

                    var modalHtml = `
                        <div id="wa-phone-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:sans-serif;">
                            <div style="background:#fff; padding:20px 25px; border-radius:12px; text-align:center; max-width:320px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.3);">
                                <h3 style="margin-top:0; color:#333; font-size:17px;">اختر رقم الواتساب لإرسال الطلب:</h3>
                                <button id="wa-b1" style="width:100%; margin:8px 0; padding:12px; background:#25D366; color:white; border:none; border-radius:8px; font-size:15px; font-weight:bold; cursor:pointer;">01010397972 💬</button>
                                <button id="wa-b2" style="width:100%; margin:8px 0; padding:12px; background:#128C7E; color:white; border:none; border-radius:8px; font-size:15px; font-weight:bold; cursor:pointer;">01020189861 💬</button>
                                <button id="wa-close" style="background:none; border:none; color:#777; margin-top:8px; cursor:pointer; font-size:13px; text-decoration:underline;">تعديل البيانات</button>
                            </div>
                        </div>
                    `;
                    document.body.insertAdjacentHTML('beforeend', modalHtml);

                    document.getElementById('wa-b1').onclick = function() {
                        window.location.href = "https://api.whatsapp.com/send?phone=201010397972&text=" + encodeURIComponent(msg);
                    };
                    document.getElementById('wa-b2').onclick = function() {
                        window.location.href = "https://api.whatsapp.com/send?phone=201020189861&text=" + encodeURIComponent(msg);
                    };
                    document.getElementById('wa-close').onclick = function() {
                        document.getElementById('wa-phone-modal').remove();
                    };

                    return false;
                }, true);
            }
        });
    }

    initWA();
    setInterval(initWA, 1000);
})();
// ================= كود إرسال الطلب والبيانات للواتساب =================
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (e) {
        var btn = e.target.closest("button, a, input[type='submit'], .btn");
        if (!btn) return;

        var text = (btn.innerText || btn.value || "").toLowerCase().trim();

        if (text.includes("إتمام") || text.includes("طلب") || text.includes("شراء") || text.includes("إرسال") || text.includes("confirm") || text.includes("checkout")) {
            
            var nameInput = document.querySelector('input[placeholder*="اسم"], input[name*="name"], input[id*="name"]');
            var phoneInput = document.querySelector('input[type="tel"], input[placeholder*="رقم"], input[placeholder*="هاتف"], input[placeholder*="تليفون"], input[name*="phone"], input[id*="phone"]');
            var addressInput = document.querySelector('textarea, input[placeholder*="عنوان"], input[name*="address"], input[id*="address"]');

            var name = nameInput ? nameInput.value.trim() : "";
            var phone = phoneInput ? phoneInput.value.trim() : "";
            var address = addressInput ? addressInput.value.trim() : "";

            var allInputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea');
            if (!name && allInputs[0]) name = allInputs[0].value.trim();
            if (!phone && allInputs[1]) phone = allInputs[1].value.trim();
            if (!address && allInputs[2]) address = allInputs[2].value.trim();

            // لو العميل لسه مكتبش البيانات، سيبه يكملهم في الموقع
            if (!name && !phone) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var cart = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                try {
                    var parsed = JSON.parse(localStorage.getItem(key));
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        cart = parsed;
                        break;
                    }
                } catch (err) {}
            }

            var msg = "🛒 *طلب جديد من المتجر*%0A";
            msg += "---------------------------%0A";
            msg += "👤 *الاسم:* " + (name || "غير محدد") + "%0A";
            msg += "📞 *الرقم:* " + (phone || "غير محدد") + "%0A";
            msg += "📍 *العنوان:* " + (address || "غير محدد") + "%0A";
            msg += "---------------------------%0A";

            if (cart.length > 0) {
                msg += "*📦 المنتجات المطلوبة:*%0A";
                cart.forEach(function (item, idx) {
                    var title = item.name || item.title || item.productName || "منتج";
                    var qty = item.quantity || item.qty || item.count || 1;
                    msg += (idx + 1) + ". " + title + " (العدد: " + qty + ")%0A";
                });
            } else {
                msg += "*المنتجات:* تفاصيل السلة المطلوبة.%0A";
            }

            var oldModal = document.getElementById("wa-phone-modal");
            if (oldModal) oldModal.remove();

            var modalHtml = `
                <div id="wa-phone-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:sans-serif;">
                    <div style="background:#fff; padding:20px 25px; border-radius:12px; text-align:center; max-width:320px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.3);">
                        <h3 style="margin-top:0; color:#333; font-size:17px;">اختر رقم الواتساب لإرسال الطلب:</h3>
                        <button id="wa-b1" style="width:100%; margin:8px 0; padding:12px; background:#25D366; color:white; border:none; border-radius:8px; font-size:15px; font-weight:bold; cursor:pointer;">01010397972 💬</button>
                        <button id="wa-b2" style="width:100%; margin:8px 0; padding:12px; background:#128C7E; color:white; border:none; border-radius:8px; font-size:15px; font-weight:bold; cursor:pointer;">01020189861 💬</button>
                        <button id="wa-close" style="background:none; border:none; color:#777; margin-top:8px; cursor:pointer; font-size:13px; text-decoration:underline;">تعديل البيانات</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend", modalHtml);

            document.getElementById("wa-b1").onclick = function () {
                window.open("https://api.whatsapp.com/send?phone=201010397972&text=" + encodeURIComponent(msg), "_blank");
            };
            document.getElementById("wa-b2").onclick = function () {
                window.open("https://api.whatsapp.com/send?phone=201020189861&text=" + encodeURIComponent(msg), "_blank");
            };
            document.getElementById("wa-close").onclick = function () {
                document.getElementById("wa-phone-modal").remove();
            };
        }
    }, true);
});