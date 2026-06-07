import { updateBadges, renderCartPage, wishlist, addToCart } from './cart.js';
import { renderProductDetail, renderProducts, renderAuthorPage } from './products.js';
import { initSearchAndFilter, initSearch } from './search.js';
import { renderCheckoutPage } from './checkout.js';
import { getCurrentUser, logoutUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial UI updates
    updateBadges();
    injectFAB();
    initSearch(); // Initialize fuzzy search functionality

    // 1.5 Auth UI Update
    const currentUser = getCurrentUser();
    const userBtn = document.querySelector('a[aria-label="Tài khoản"]');
    
    if (userBtn) {
        if (currentUser) {
            userBtn.classList.add('user-menu-btn');
            userBtn.innerHTML = `
                <div class="user-dropdown-container">
                    <div class="user-dropdown-trigger">
                        <i class="ph ph-user"></i>
                        <span class="user-dropdown-name">${currentUser.name.split(' ')[0]}</span>
                    </div>
                    <div class="user-dropdown">
                        <a href="account.html" class="user-dropdown-link">
                            <i class="ph ph-user-circle"></i> Tài khoản của tôi
                        </a>
                        <button type="button" class="user-dropdown-logout" id="logout-btn">
                            <i class="ph ph-sign-out"></i> Đăng xuất
                        </button>
                    </div>
                </div>
            `;
            userBtn.href = "#";
            
            const container = userBtn.querySelector('.user-dropdown-container');
            const dropdown = userBtn.querySelector('.user-dropdown');
            
            const closeDropdown = () => dropdown?.classList.remove('is-open');

            container.addEventListener('click', (e) => {
                if (e.target.closest('a') && e.target.closest('.user-dropdown')) return;
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('is-open');
            });

            const logoutBtn = userBtn.querySelector('#logout-btn');
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeDropdown();
                logoutUser();
            });

            document.addEventListener('click', (e) => {
                if (!userBtn.contains(e.target)) closeDropdown();
            });

            window.addEventListener('resize', closeDropdown);
            window.addEventListener('scroll', closeDropdown, { passive: true });
        } else {
            userBtn.href = 'login.html';
        }
    }

    // 2. Dark-only mode: remove the light/dark feature completely
    localStorage.setItem('bookly_theme', 'dark');
    document.body.classList.remove('light-mode');
    document.querySelectorAll('.theme-toggle-btn, #theme-toggle').forEach(btn => btn.remove());
    removeUnusedCategoryLinks();

    // 3. Sticky Header & Scroll To Top
    const header = document.getElementById('header');
    let scrollTopBtn = document.getElementById('scroll-top');
    
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top';
        scrollTopBtn.id = 'scroll-top';
        scrollTopBtn.setAttribute('aria-label', 'Lên đầu trang');
        scrollTopBtn.innerHTML = '<i class="ph ph-arrow-up"></i>';
        document.body.appendChild(scrollTopBtn);
    }

    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (scrollTopBtn) scrollTopBtn.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const megaMenuOverlay = document.querySelector('.mega-menu-overlay');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link (trừ mũi tên mở mega menu)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.target.closest('.mega-menu-caret')) return;
                navLinks.classList.remove('active');
                document.querySelectorAll('.nav-item-mega.is-open').forEach(item => item.classList.remove('is-open'));
            });
        });
    }

    initMegaMenuToggle(megaMenuOverlay);

    // 4. Modal Close Handlers
    const modal = document.getElementById('quick-view-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (modal && closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // 4.1 Ripple Effect for Buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.add('ripple');
    });

    // 4.2 Intersection Observer for slideUp animations and progress bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Thêm class visible cho các element fade-in-up
                if (entry.target.classList.contains('fade-in-up') || entry.target.classList.contains('section')) {
                    entry.target.classList.add('visible');
                }
                
                // Animate progress bars
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    if (width) bar.style.width = width + '%';
                });
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .section').forEach(el => observer.observe(el));

    // 4.3 Init Index Page specifics (Top 10 Slider & Flash Sale)
    initIndexPageSpecifics();
    initSiteVisuals();
    initHeroBooks3D();

    // 5. Page Specific Init
    const path = window.location.pathname;
    
    if (path.includes('product-detail.html')) {
        renderProductDetail();
    } else if (path.includes('author.html')) {
        renderAuthorPage();
    } else if (path.includes('cart.html')) {
        renderCartPage();
    } else if (path.includes('checkout.html')) {
        renderCheckoutPage();
    } else if (path.includes('wishlist.html')) {
        renderProducts('wishlist-container', wishlist);
    } else if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        initSearchAndFilter();
    }
});


const createFlashSaleCartItem = (item, salePrice, discountPct) => ({
    ...item,
    price: salePrice,
    originalPrice: item.price,
    salePrice,
    discountPct,
    saleSource: 'Flash Sale',
    cartKey: `flash-${item.id}`,
    title: item.title
});

const createComboCartItem = (combo, books, salePrice, originalPrice) => ({
    id: combo.id,
    cartKey: combo.id,
    title: combo.name,
    author: 'Bookly Combo',
    category: 'Combo khuyến mãi',
    subcategory: 'Combo',
    cover: books[0]?.cover || '../assets/images/logo.png',
    price: salePrice,
    salePrice,
    originalPrice,
    discountPct: combo.discountPct,
    saleSource: 'Combo khuyến mãi',
    isCombo: true,
    comboBookIds: combo.bookIds,
    comboBooks: books.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        price: book.price,
        stock: book.stock
    })),
    stock: Math.min(...books.map(book => Number(book.stock || 0))),
    sold: 0,
    rating: 5
});

// Helper functions for Index Page features
function initIndexPageSpecifics() {
    // Lazily import products and components
    import('./products.js').then(({ products, renderProducts, comboPacks, blogPosts }) => {
        // 1. Render Top 10 Bestsellers (Real Data)
        const top10Slider = document.getElementById('top10-slider');
        if (top10Slider) {
            // Sort by sold descending, take top 10
            const top10Data = [...products]
                .sort((a, b) => (b.sold || 0) - (a.sold || 0))
                .slice(0, 10);

            const maxSold = top10Data[0]?.sold || 1;

            const cardsHtml = top10Data.map((item, index) => {
                const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
                const progressPercent = Math.min(100, Math.round((item.sold / maxSold) * 100));
                const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);
                return `
                    <div class="top10-card product-card ${rankClass}" onclick="window.location.href='product-detail.html?id=${item.id}'" style="cursor:pointer;">
                        <div class="top10-rank ${rankClass}">#${index + 1}</div>
                        <div class="product-img-wrapper" style="padding-top: 130%;">
                            <img src="${item.cover}" class="product-img" alt="${item.title}" style="object-fit:cover;" onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='#f5f0e8';this.parentElement.insertAdjacentHTML('afterbegin','<div style=\'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px\'><span style=\'font-size:3rem\'>📚</span><span style=\'font-size:0.8rem;color:#8B4513\'>Không có ảnh</span></div>');">
                        </div>
                        <div style="margin-top: 12px;">
                            <h4 style="font-size: 0.95rem; margin-bottom: 4px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.title}</h4>
                            <p style="font-size: 0.78rem; color: rgba(255,255,255,0.74); margin-bottom: 6px;">${item.author}</p>
                            <p style="font-weight: 700; color: var(--color-primary); font-size: 1rem;">${price}</p>
                            <div class="progress-container" style="margin-top: 8px;">
                                <div class="progress-bar" data-width="${progressPercent}"></div>
                            </div>
                            <div class="progress-text" style="margin-top: 4px;">
                                <span>Đã bán: <strong>${item.sold.toLocaleString('vi-VN')}</strong></span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Render cards then duplicate for seamless infinite marquee
            top10Slider.innerHTML = cardsHtml + cardsHtml;
        }

        // 2. Render Flash Sale (4 products fixed per day using date seed)
        const flashSaleContainer = document.getElementById('flash-sale-container');
        if (flashSaleContainer) {
            // Seeded shuffle: fixed per calendar day, changes at midnight
            const seed = new Date().toDateString();
            const seededRandom = (str) => {
                let h = 0;
                for (let i = 0; i < str.length; i++) { h = Math.imul(31, h) + str.charCodeAt(i) | 0; }
                return () => { h ^= h << 13; h ^= h >> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
            };
            const rng = seededRandom(seed);
            const shuffled = [...products].sort(() => rng() - 0.5).slice(0, 4);
            const discounts = [20, 25, 30, 35];


            const flashOffers = shuffled.map((item, i) => {
                const pct = discounts[i];
                const priceSale = Math.round(item.price * (1 - pct / 100) / 1000) * 1000;
                return {
                    id: item.id,
                    salePrice: priceSale,
                    originalPrice: item.price,
                    discountPct: pct,
                    expiresAt: Date.now() + (6 * 60 * 60 * 1000)
                };
            });
            localStorage.setItem('bookly_flash_sale_offers', JSON.stringify(flashOffers));

            flashSaleContainer.innerHTML = shuffled.map((item, i) => {
                const pct = discounts[i];
                const priceSale = Math.round(item.price * (1 - pct / 100) / 1000) * 1000;
                const stockRemaining = Math.max(0, Number(item.stock) || 0);
                const soldCount = Number(item.sold) || 0;
                const totalStock = stockRemaining + soldCount;
                const progressPercent = totalStock > 0 ? Math.round((soldCount / totalStock) * 100) : 100;
                const isOutOfStock = stockRemaining <= 0;
                const fmtSale = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceSale);
                const fmtOrig = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);
                return `
                    <div class="product-card flash-sale-card${isOutOfStock ? ' is-out-of-stock' : ''}" style="position:relative; cursor:pointer;">
                        <div class="flash-sale-badge">-${pct}%</div>
                        ${isOutOfStock ? '<div class="sold-out-badge">Hết hàng</div>' : ''}
                        <div class="product-img-wrapper" onclick="window.location.href='product-detail.html?id=${item.id}'">
                            <img src="${item.cover}" class="product-img" alt="${item.title}" onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='#f5f0e8';this.parentElement.insertAdjacentHTML('afterbegin','<div style=\'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px\'><span style=\'font-size:3rem\'>📚</span><span style=\'font-size:0.8rem;color:#8B4513\'>Không có ảnh</span></div>');">
                        </div>
                        <div class="product-info" style="text-align:center;">
                            <h4 class="product-title" onclick="window.location.href='product-detail.html?id=${item.id}'" style="font-size:0.95rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${item.title}</h4>
                            <div style="margin: 8px 0;">
                                <span class="price-original">${fmtOrig}</span>
                                <span class="price-sale" style="display:block; font-size:1.1rem;">${fmtSale}</span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar" data-width="${progressPercent}"></div>
                            </div>
                            <div class="progress-text">
                                <span>${isOutOfStock ? '<strong style="color:var(--color-danger);">Hết hàng</strong>' : `Còn lại: <strong>${stockRemaining}</strong> cuốn`}</span>
                            </div>
                            <button class="btn btn-primary flash-add-cart" data-id="${item.id}" style="width:100%; margin-top:12px; padding:10px 14px;" ${isOutOfStock ? 'disabled' : ''}>${isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}</button>
                        </div>
                    </div>
                `;
            }).join('');

            flashSaleContainer.querySelectorAll('.flash-add-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (btn.disabled) return;
                    const productId = Number(btn.dataset.id);
                    const productIndex = shuffled.findIndex(product => product.id === productId);
                    const product = shuffled[productIndex];
                    if (!product || (product.stock || 0) <= 0) return;
                    const discountPct = discounts[productIndex] || 0;
                    const salePrice = Math.round(product.price * (1 - discountPct / 100) / 1000) * 1000;
                    addToCart(createFlashSaleCartItem(product, salePrice, discountPct), 1);
                    window.location.href = 'cart.html';
                });
            });

            // Countdown Logic
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                // Set end time 6 hours from now, persist in sessionStorage so it doesn't reset on refresh
                let endTime = parseInt(sessionStorage.getItem('bookly_flash_end'));
                if (!endTime || endTime < Date.now()) {
                    endTime = Date.now() + (6 * 60 * 60 * 1000);
                    sessionStorage.setItem('bookly_flash_end', endTime);
                }

                const timer = setInterval(() => {
                    const distance = endTime - Date.now();
                    if (distance < 0) {
                        clearInterval(timer);
                        countdownEl.innerHTML = 'ĐÃ KẾT THÚC';
                        return;
                    }
                    const h = Math.floor(distance / 3600000);
                    const m = Math.floor((distance % 3600000) / 60000);
                    const s = Math.floor((distance % 60000) / 1000);
                    countdownEl.innerHTML = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                }, 1000);
            }
        }


        // 3. Render categories dynamically
        const categoriesMap = {
            'Văn học': ['Văn học', 'Tiểu thuyết', 'Truyện ngắn', 'Thơ ca'],
            'Khoa học': ['Khoa học', 'Vũ trụ - Thiên văn', 'Sinh học', 'Vật lý'],
            'Kinh doanh': ['Kinh doanh', 'Khởi nghiệp', 'Quản trị - Lãnh đạo', 'Marketing', 'Kinh tế học'],
            'Thiếu nhi': ['Thiếu nhi', 'Truyện tranh'],
            'Tâm lý': ['Tâm lý', 'Tâm lý - Self-help', 'Kỹ năng sống']
        };

        // Slug mapping for URLs
        const categorySlugMap = {
            'Văn học': 'van-hoc',
            'Khoa học': 'khoa-hoc',
            'Kinh doanh': 'kinh-doanh',
            'Thiếu nhi': 'thieu-nhi',
            'Tâm lý': 'tam-ly'
        };

        const dynamicCategoriesContainer = document.getElementById('dynamic-categories-container');
        if (dynamicCategoriesContainer) {
            let catHtml = '';
            const allCatKeys = Object.keys(categoriesMap);
            allCatKeys.forEach((catName, idx) => {
                const slug = categorySlugMap[catName];
                catHtml += `
                    <section class="section category-section" style="${idx % 2 === 1 ? 'background: rgba(0,0,0,0.01);' : ''}">
                        <div class="container fade-in-up">
                            <div class="section-category-header">
                                <div>
                                    <span class="section-label">Thể loại</span>
                                    <h2 class="section-category-title">${catName}</h2>
                                </div>
                                <a href="category.html?type=${slug}" class="see-all-link">Xem tất cả <i class="ph ph-arrow-right"></i></a>
                            </div>
                            <div class="cat-grid" id="cat-grid-${idx}"></div>
                        </div>
                    </section>
                `;
            });
            dynamicCategoriesContainer.innerHTML = catHtml;

            // Now render books into these containers
            allCatKeys.forEach((catName, idx) => {
                const keywords = categoriesMap[catName];
                let filtered = products.filter(p => keywords.some(k => p.category.includes(k)));
                if (filtered.length < 4) {
                    filtered = [...filtered, ...products.filter(p => !filtered.includes(p))].slice(0, 4);
                } else {
                    filtered = filtered.slice(0, 4);
                }
                renderProducts(`cat-grid-${idx}`, filtered);
            });
        }

        // 4. Render Combo Books
        const comboContainer = document.getElementById('combo-container');
        if (comboContainer && comboPacks) {
            comboContainer.innerHTML = comboPacks.map(combo => {
                const books = combo.bookIds.map(id => products.find(p => p.id === id)).filter(Boolean);
                if(books.length === 0) return '';
                const origPrice = books.reduce((sum, b) => sum + b.price, 0);
                const salePrice = Math.round((origPrice * (100 - combo.discountPct)) / 100);

                return `
                    <div class="combo-card" style="background: ${combo.theme};" data-combo-id="${combo.id}">
                        <div class="combo-books-preview">
                            ${books.slice(0,3).map(b => `<img src="${b.cover}" class="combo-book-thumb" alt="${b.title}">`).join('')}
                        </div>
                        <div class="combo-info">
                            <div class="combo-badge">${combo.badge}</div>
                            <h3 class="combo-name">${combo.name}</h3>
                            <p class="combo-desc">${combo.description}</p>
                            <div class="combo-pricing">
                                <span class="combo-price-original">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(origPrice)}</span>
                                <span class="combo-price-sale">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salePrice)}</span>
                                <span class="combo-discount-badge">-${combo.discountPct}%</span>
                            </div>
                            <button class="btn btn-primary combo-add-cart" data-combo-id="${combo.id}" style="margin-top:12px; padding:10px 16px;">Thêm combo vào giỏ hàng</button>
                        </div>
                    </div>
                `;
            }).join('');

            comboContainer.querySelectorAll('.combo-card, .combo-add-cart').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const comboId = el.dataset.comboId || el.closest('.combo-card')?.dataset.comboId;
                    const combo = comboPacks.find(item => item.id === comboId);
                    if (!combo) return;
                    const books = combo.bookIds.map(id => products.find(p => p.id === id)).filter(Boolean);
                    const origPrice = books.reduce((sum, book) => sum + book.price, 0);
                    const salePrice = Math.round((origPrice * (100 - combo.discountPct)) / 100);
                    const added = addToCart(createComboCartItem(combo, books, salePrice, origPrice), 1);
                    if (added) window.location.href = 'cart.html';
                });
            });
        }

        // 5. Render Blog Preview
        const blogContainer = document.getElementById('blog-container');
        if (blogContainer && blogPosts) {
            blogContainer.innerHTML = blogPosts.slice(0, 3).map(post => `
                <div class="blog-card ${post.featured ? 'featured' : ''}" onclick="window.location.href='blog.html'">
                    <div class="blog-card-img-wrap">
                        <img src="${post.cover}" class="blog-card-img" alt="${post.title}">
                    </div>
                    <div class="blog-card-body">
                        <div class="blog-tags">${post.tags.slice(0,2).map(t => `<span class="blog-tag">${t}</span>`).join('')}</div>
                        <h3 class="blog-card-title">${post.title}</h3>
                        <p class="blog-excerpt">${post.excerpt}</p>
                        <div class="blog-meta">
                            <span><i class="ph ph-calendar"></i> ${post.date}</span>
                            <span><i class="ph ph-clock"></i> ${post.readTime}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    });
}


function initHeroBooks3D() {
    const container = document.getElementById('hero-books-3d');
    if (!container) return;

    // Pick 6 top books (by sold count) to feature in hero
    import('./products.js').then(({ products }) => {
        if (!products || products.length === 0) return;

        const heroBooks = [...products]
            .sort((a, b) => (b.sold || 0) - (a.sold || 0))
            .slice(0, 6);

        container.innerHTML = heroBooks.map(book => `
            <div class="hero-book-3d" data-id="${book.id}" title="${book.title}">
                <div class="book-face">
                    <img src="${book.cover}" alt="${book.title}" loading="lazy"
                         onerror="this.parentElement.style.background='linear-gradient(135deg,#2d1b0e,#5c3a1e)';this.style.display='none';">
                </div>
                <div class="book-spine"></div>
                <div class="book-shine"></div>
                <div class="book-title-tip">${book.title}</div>
            </div>
        `).join('');

        // Click to navigate to product detail
        container.querySelectorAll('.hero-book-3d').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.id;
                window.location.href = `product-detail.html?id=${id}`;
            });
        });

        // Mouse parallax effect on the hero-visual
        const heroVisual = container.closest('.hero-visual');
        if (!heroVisual) return;

        if (!window.matchMedia('(pointer: fine)').matches) return;

        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
            const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

            container.querySelectorAll('.hero-book-3d').forEach((book, i) => {
                if (book.matches(':hover')) return; // don't override hover state
                const depth = 1 - (i * 0.12); // further books move less
                const tx = dx * 14 * depth;
                const ty = dy * 10 * depth;
                book.style.transition = 'transform 0.15s ease-out, filter 0.4s ease';
                const baseTransforms = [
                    `rotateY(-25deg) rotateX(4deg) rotate(-4deg)`,
                    `rotateY(20deg) rotateX(-5deg) rotate(6deg)`,
                    `rotateY(-20deg) rotateX(6deg) rotate(3deg)`,
                    `rotateY(15deg) rotateX(-3deg) rotate(-8deg)`,
                    `rotateY(25deg) rotateX(8deg) rotate(12deg)`,
                    `rotateY(-15deg) rotateX(-8deg) rotate(-10deg)`,
                ];
                book.style.transform = `${baseTransforms[i] || ''} translate(${tx}px, ${ty}px)`;
            });
        });

        heroVisual.addEventListener('mouseleave', () => {
            container.querySelectorAll('.hero-book-3d').forEach(book => {
                book.style.transition = 'transform 0.6s ease, filter 0.4s ease';
                book.style.transform = '';
            });
        });
    });
}

function initSiteVisuals() {
    createDustCanvas();
    createGlobalDustCanvas();
    initHeaderSearchSuggestions();
    initAutoTypeSearch();
    initCountUpStats();
    initTickerAnimation();
}

function initHeaderSearchSuggestions() {
    const container = document.querySelector('.search-container');
    if (!container || container.querySelector('.search-suggestions')) return;

    const suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    suggestions.innerHTML = '<div class="search-suggestions-list"></div>';
    container.appendChild(suggestions);

    const input = container.querySelector('.search-input');
    if (!input) return;

    let products = [];
    let isIndex = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

    import('./products.js').then(module => {
        products = module.products || [];
    }).catch(() => {
        products = [];
    });

    const renderSuggestions = (items) => {
        const list = suggestions.querySelector('.search-suggestions-list');
        if (!list) return;
        if (items.length === 0) {
            list.innerHTML = '<div class="search-suggestion-empty">Không tìm thấy sách tương ứng.</div>';
            return;
        }
        list.innerHTML = items.map((item, index) => `
            <div class="search-suggestion-item" data-query="${item.title}" data-id="${item.id}">
                <span>${index + 1}</span>
                <div>
                    <div class="suggestion-title">${item.title}</div>
                    <div class="suggestion-meta">${item.author} · ${item.category}</div>
                </div>
            </div>
        `).join('');
    };

    const updateSuggestions = () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            suggestions.classList.remove('visible');
            return;
        }

        const matches = products
            .filter(item => item.title.toLowerCase().includes(query))
            .slice(0, 6);

        renderSuggestions(matches);
        suggestions.classList.toggle('visible', matches.length > 0 || query.length > 0);
    };

    input.addEventListener('input', updateSuggestions);
    input.addEventListener('focus', updateSuggestions);
    input.addEventListener('blur', () => setTimeout(() => suggestions.classList.remove('visible'), 150));

    suggestions.addEventListener('mousedown', (event) => {
        const item = event.target.closest('.search-suggestion-item');
        if (!item) return;
        const query = item.dataset.query;
        input.value = query;
        suggestions.classList.remove('visible');

        if (isIndex) {
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        event.preventDefault();
    });
}

function createDustCanvas() {
    if (document.getElementById('site-dust-canvas')) return;
    const existingCanvas = document.getElementById('dustCanvas');
    const canvas = existingCanvas || document.createElement('canvas');
    const isHeroCanvas = Boolean(existingCanvas);
    if (!isHeroCanvas) {
        canvas.id = 'site-dust-canvas';
        canvas.style.position = 'fixed';
        canvas.style.inset = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.92';
        document.body.appendChild(canvas);
    } else {
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.92';
    }

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    const particleCount = isHomePage ? 170 : 100;
    const particles = Array.from({ length: particleCount }, () => ({
        x: 0,
        y: 0,
        r: 1.2 + Math.random() * 3.8,
        alpha: 0.22 + Math.random() * 0.34,
        speed: 0.16 + Math.random() * 0.42,
        drift: -0.18 + Math.random() * 0.36,
    }));

    const resize = () => {
        if (isHeroCanvas) {
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles.forEach((particle) => {
            particle.x = Math.random() * width;
            particle.y = Math.random() * height;
        });
    };

    window.addEventListener('resize', resize);
    resize();

    function draw() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((particle) => {
            particle.x += particle.drift;
            particle.y -= particle.speed;
            if (particle.y < -20) particle.y = height + 20;
            if (particle.x < -20) particle.x = width + 20;
            if (particle.x > width + 20) particle.x = -20;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 209, 102, ${particle.alpha})`;
            ctx.shadowColor = 'rgba(255, 209, 102, 0.42)';
            ctx.shadowBlur = 8;
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}


function createGlobalDustCanvas() {
    if (document.getElementById('site-dust-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'site-dust-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.78';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    const particles = Array.from({ length: 145 }, () => ({
        x: 0,
        y: 0,
        r: 1 + Math.random() * 3,
        alpha: 0.18 + Math.random() * 0.32,
        speed: 0.12 + Math.random() * 0.32,
        drift: -0.14 + Math.random() * 0.28,
    }));

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles.forEach(p => {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
        });
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.drift;
            p.y -= p.speed;
            if (p.y < -20) p.y = height + 20;
            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 209, 102, ${p.alpha})`;
            ctx.shadowColor = 'rgba(255, 209, 102, 0.38)';
            ctx.shadowBlur = 8;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
}

function initAutoTypeSearch() {
    const input = document.querySelector('#searchInput, .search-input');
    if (!input) return;

    const searchPhrases = ['Tìm sách bom tấn...', 'Nhập tên tác giả...', 'Khám phá thể loại yêu thích...'];
    let phraseIndex = 0;
    let charIndex = 0;
    let forward = true;

    function type() {
        const phrase = searchPhrases[phraseIndex];
        if (forward) {
            charIndex++;
            input.placeholder = phrase.slice(0, charIndex);
            if (charIndex === phrase.length) {
                forward = false;
                setTimeout(type, 1200);
                return;
            }
        } else {
            charIndex--;
            input.placeholder = phrase.slice(0, charIndex);
            if (charIndex === 0) {
                forward = true;
                phraseIndex = (phraseIndex + 1) % searchPhrases.length;
            }
        }
        setTimeout(type, forward ? 120 : 40);
    }

    type();
}

function initCountUpStats() {
    document.querySelectorAll('.stat-card strong[data-target]').forEach((node) => {
        const target = Number(node.dataset.target) || 0;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 85));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                node.textContent = target.toLocaleString('vi-VN') + '+';
                clearInterval(interval);
            } else {
                node.textContent = current.toLocaleString('vi-VN') + '+';
            }
        }, 24);

        node.addEventListener('mouseenter', () => {
            clearInterval(interval);
            node.textContent = target.toLocaleString('vi-VN') + '+';
        });
    });
}

function initTickerAnimation() {
    const ticker = document.getElementById('ticker');
    if (!ticker) return;
    const children = Array.from(ticker.children);
    if (children.length > 0) {
        ticker.innerHTML += ticker.innerHTML;
    }
}


// Remove category links that do not match any real books in data/products.js
function removeUnusedCategoryLinks() {
    const unusedSlugs = new Set([
        'truyen-ngan',
        'tho-ca',
        'van-hoc-nuoc-ngoai',
        'khoa-hoc-thuong-thuc',
        'quan-tri',
        'lich-su'
    ]);

    document.querySelectorAll('a[href*="category.html?type="]').forEach(link => {
        try {
            const href = link.getAttribute('href') || '';
            const slug = href.split('type=')[1]?.split('&')[0]?.split('#')[0];
            if (unusedSlugs.has(slug)) {
                const item = link.closest('li') || link;
                item.remove();
            }
        } catch {
            // Ignore malformed links
        }
    });
}

function initMegaMenuToggle(overlay) {
    const megaItems = document.querySelectorAll('.nav-item-mega');
    if (!megaItems.length) return;

    const isMobileNav = () => window.matchMedia('(max-width: 768px)').matches;

    megaItems.forEach(item => {
        const trigger = item.querySelector('.nav-link');
        const megaMenu = item.querySelector('.mega-menu');
        if (!trigger || !megaMenu) return;

        const caret = trigger.querySelector('i.ph-caret-down');
        if (caret) caret.classList.add('mega-menu-caret');

        const closeMega = () => {
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
        };

        const openMega = () => {
            megaItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('is-open');
                    other.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
                }
            });
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
        };

        const toggleMega = (e) => {
            if (!isMobileNav()) return;
            e.preventDefault();
            e.stopPropagation();
            if (item.classList.contains('is-open')) closeMega();
            else openMega();
        };

        trigger.addEventListener('click', (e) => {
            if (!isMobileNav()) return;
            if (e.target.closest('.mega-menu-caret')) toggleMega(e);
        });

        megaMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMega();
                document.getElementById('nav-links')?.classList.remove('active');
            });
        });
    });

    document.addEventListener('click', (e) => {
        if (!isMobileNav()) return;
        if (e.target.closest('.nav-item-mega')) return;
        megaItems.forEach(item => {
            item.classList.remove('is-open');
            item.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', () => {
        if (!isMobileNav()) {
            megaItems.forEach(item => {
                item.classList.remove('is-open');
                item.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
            });
            overlay?.classList.remove('active');
        }
    });
}

// Global FAB Injection Function
function injectFAB() {
    if (document.querySelector('.float-btns')) return;
    const fab = document.createElement('div');
    fab.className = 'float-btns';
    fab.innerHTML = `
      <a class="fab fab-zalo" href="https://zalo.me/0901234567" target="_blank" aria-label="Chat Zalo">
        <div class="pulse-ring"></div>
        <svg viewBox="0 0 48 48"><path d="M24 4C13 4 4 12.1 4 22.2c0 5.6 2.8 10.6 7.2 14L9.5 43l8.4-3.8C19.9 39.7 21.9 40 24 40c11 0 20-8.1 20-17.8S35 4 24 4zm-8 20.5l-4.5-4.8 8.8-4.7-4.3 9.5zm16 0l-4.3-9.5 8.8 4.7-4.5 4.8z"/></svg>
        <div class="fab-tooltip">Nhắn tin Zalo</div>
      </a>
      <button class="fab fab-phone" type="button" aria-label="Số điện thoại" title="0901 234 567">
        <div class="pulse-ring"></div>
        <svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
        <div class="fab-tooltip">0901 234 567</div>
      </button>
    `;
    document.body.appendChild(fab);

    const phoneBtn = fab.querySelector('.fab-phone');
    if (phoneBtn) {
        phoneBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    }
}

window.injectFAB = injectFAB;
