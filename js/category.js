import { products, renderProducts, initObserver } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Category page loaded');
    
    // 1. Get Category from URL
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    
    if (!typeParam) {
        window.location.href = 'index.html';
        return;
    }

    // Map URL parameter to actual category name (both main and sub categories)
    const categoryMap = {
        // Main Categories (Danh mục lớn)
        'van-hoc': 'Văn học',
        'khoa-hoc': 'Khoa học',
        'tam-ly': 'Tâm lý',
        'kinh-doanh': 'Kinh doanh',
        'thieu-nhi': 'Thiếu nhi',
        
        // Sub Categories (Danh mục nhỏ)
        'tieu-thuyet': 'Tiểu thuyết',
        'vu-tru': 'Vũ trụ - Thiên văn',
        'sinh-hoc': 'Sinh học',
        'vat-ly': 'Vật lý',
        'khoi-nghiep': 'Khởi nghiệp',
        'marketing': 'Marketing',
        'kinh-te-hoc': 'Kinh tế học',
        'truyen-tranh': 'Truyện tranh',
        'ky-nang-song': 'Kỹ năng sống'
    };

    const targetCategory = categoryMap[typeParam];

    const matchesCategory = (product, categoryName) => {
        const subcategory = product.subcategory || '';
        return product.category === categoryName || subcategory.includes(categoryName);
    };

    const getPublicationYear = (product) => Number(product.publicationYear || product.publishYear || product.year || 0);

    if (!targetCategory) {
        document.getElementById('cat-title').textContent = "Danh mục không tồn tại";
        document.getElementById('cat-count').textContent = "";
        return;
    }

    // Define main categories and their subcategories
    const mainCategoriesMap = {
        'Văn học': {
            main: 'van-hoc',
            subs: [
                { name: 'Văn học', slug: 'van-hoc' },
                { name: 'Tiểu thuyết', slug: 'tieu-thuyet' },
            ]
        },
        'Khoa học': {
            main: 'khoa-hoc',
            subs: [
                { name: 'Khoa học', slug: 'khoa-hoc' },
                { name: 'Vũ trụ - Thiên văn', slug: 'vu-tru' },
                { name: 'Sinh học', slug: 'sinh-hoc' },
                { name: 'Vật lý', slug: 'vat-ly' }
            ]
        },
        'Kinh doanh': {
            main: 'kinh-doanh',
            subs: [
                { name: 'Kinh doanh', slug: 'kinh-doanh' },
                { name: 'Khởi nghiệp', slug: 'khoi-nghiep' },
                { name: 'Marketing', slug: 'marketing' },
                { name: 'Kinh tế học', slug: 'kinh-te-hoc' }
            ]
        },
        'Thiếu nhi': {
            main: 'thieu-nhi',
            subs: [
                { name: 'Thiếu nhi', slug: 'thieu-nhi' },
                { name: 'Truyện tranh', slug: 'truyen-tranh' }
            ]
        },
        'Tâm lý': {
            main: 'tam-ly',
            subs: [
                { name: 'Tâm lý', slug: 'tam-ly' },
                { name: 'Kỹ năng sống', slug: 'ky-nang-song' }
            ]
        }
    };

    // Determine which main category to show subcategories for
    let mainCategoryKey = null;
    for (const [key, data] of Object.entries(mainCategoriesMap)) {
        if (data.subs.some(sub => sub.name === targetCategory)) {
            mainCategoryKey = key;
            break;
        }
    }

    // Populate sidebar with subcategories
    const sidebarList = document.getElementById('subcategories-list');
    if (sidebarList && mainCategoryKey) {
        const subcats = mainCategoriesMap[mainCategoryKey].subs.filter(sub => {
            const categoryName = categoryMap[sub.slug];
            return categoryName && products.some(product => matchesCategory(product, categoryName));
        });
        sidebarList.innerHTML = subcats.map(sub => {
            const isActive = sub.name === targetCategory ? 'active' : '';
            return `<a href="category.html?type=${sub.slug}" class="sidebar-link ${isActive}">${sub.name}</a>`;
        }).join('');
    }

    // 2. Filter Products by Category or Subcategory
    let filteredProducts = products.filter(p => matchesCategory(p, targetCategory));
    console.log('Target category:', targetCategory);
    console.log('Filtered products count:', filteredProducts.length);
    console.log('Filtered products:', filteredProducts);
    
    if (filteredProducts.length === 0) {
        console.warn('No products found for category:', targetCategory);
        document.getElementById('category-products-container').innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Không có sách trong danh mục này.</p>';
    }

    // Determine featured books (top 3 by sold count)
    const featuredIds = filteredProducts
        .slice()
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 3)
        .map(p => p.id);

    // Mark featured flag
    filteredProducts = filteredProducts.map(p => ({
        ...p,
        featured: featuredIds.includes(p.id)
    }));

    // 3. Update UI
    document.getElementById('cat-title').textContent = targetCategory;
    document.getElementById('cat-count').textContent = `Hiển thị ${filteredProducts.length} kết quả`;

    // 4. Render
    renderProducts('category-products-container', filteredProducts);
    initObserver();

    // 5. Add SlideUp animation for sections
    const sections = document.querySelectorAll('.fade-in-up');
    sections.forEach((el, index) => {
        el.style.animationDelay = (index * 0.1) + 's';
        el.classList.add('section');
    });

    // ===== ADVANCED FILTER LOGIC =====
    
    // State for active filters
    let activeFilters = {
        sort: 'newest',
        priceMax: 500000,
        rating: null
    };

    // Define applyFilters function
    const applyFilters = () => {
        console.log('Applying filters:', activeFilters);
        let result = [...filteredProducts];

        // Filter by price
        result = result.filter(p => p.price <= activeFilters.priceMax);

        // Filter by rating
        if (activeFilters.rating !== null) {
            result = result.filter(p => (p.rating || 0) >= activeFilters.rating);
        }

        // Sort
        if (activeFilters.sort === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (activeFilters.sort === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (activeFilters.sort === 'bestseller') {
            result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        } else if (activeFilters.sort === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else {
            // newest: sort by publication year first, then id as fallback
            result.sort((a, b) => (getPublicationYear(b) - getPublicationYear(a)) || (b.id - a.id));
        }

        // Update count
        document.getElementById('cat-count').textContent = `Hiển thị ${result.length} kết quả`;

        // Render
        renderProducts('category-products-container', result);
        initObserver();
    };

    // Get filter elements
    const filterToggle = document.getElementById('filter-toggle');
    const advancedFilters = document.getElementById('advanced-filters');
    const sortSelect = document.getElementById('sort-select');
    const priceRange = document.getElementById('price-range');
    const priceValDisplay = document.getElementById('price-val');
    const ratingFilter = document.getElementById('rating-filter');
    const clearFilterBtn = document.getElementById('clear-filter');

    console.log('Filter elements found:', {
        filterToggle: !!filterToggle,
        advancedFilters: !!advancedFilters,
        sortSelect: !!sortSelect,
        priceRange: !!priceRange,
        ratingFilter: !!ratingFilter,
        clearFilterBtn: !!clearFilterBtn
    });

    // Toggle filter panel
    if (filterToggle) {
        filterToggle.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Toggle clicked');
            advancedFilters.style.display = advancedFilters.style.display === 'none' ? 'grid' : 'none';
        });
    }

    // Update price range display and apply filter
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            activeFilters.priceMax = val;
            if (val === 500000) {
                priceValDisplay.textContent = 'Tất cả';
            } else {
                priceValDisplay.textContent = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(val);
            }
            applyFilters();
        });
    }

    // Sort select change
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            activeFilters.sort = e.target.value;
            console.log('Sort changed to:', e.target.value);
            applyFilters();
        });
    }

    // Rating filter buttons
    if (ratingFilter) {
        ratingFilter.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const val = parseInt(btn.dataset.val);
                console.log('Rating button clicked:', val);
                
                // Remove active class from all
                ratingFilter.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                
                // Toggle selection
                if (activeFilters.rating === val) {
                    activeFilters.rating = null;
                } else {
                    btn.classList.add('active');
                    activeFilters.rating = val;
                }
                console.log('Rating filter set to:', activeFilters.rating);
                applyFilters();
            });
        });
    }

    // Clear filter button
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clear filter clicked');
            
            // Reset all filters
            activeFilters = {
                sort: 'newest',
                priceMax: 500000,
                rating: null
            };
            
            // Reset UI
            if (sortSelect) sortSelect.value = 'newest';
            if (priceRange) priceRange.value = 500000;
            if (priceValDisplay) priceValDisplay.textContent = 'Tất cả';
            if (ratingFilter) ratingFilter.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            
            applyFilters();
        });
    }

    console.log('Filter listeners attached');
    
    // Initial render with default filters
    applyFilters();
});
