import { products, renderProducts } from './products.js';

let currentFilter = 'all';
let currentSort = 'newest';
let currentSearch = '';
let currentPriceMax = 500000;
let currentRatingMin = 0;
let currentDisplayCount = 8;
const INITIAL_COUNT = 8;

const getPublicationYear = (product) => Number(product.publicationYear || product.publishYear || product.year || 0);

export const initSearchAndFilter = () => {
    // Render initially
    applyFilters();

    // Search Input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentSearch = e.target.value.toLowerCase().trim();
                currentDisplayCount = INITIAL_COUNT; // reset pagination on search
                applyFilters();
            }, 300);
        });
    }

    // Category Filters
    const filterBtns = document.querySelectorAll('.btn-filter');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-secondary');
                });
                const target = e.target;
                target.classList.remove('btn-secondary');
                target.classList.add('btn-primary');
                
                currentFilter = target.dataset.filter;
                currentDisplayCount = INITIAL_COUNT; // reset pagination
                applyFilters();
            });
        });
    }

    // Sort Select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentDisplayCount = INITIAL_COUNT; // reset pagination
            applyFilters();
        });
    }

    // Advanced Filters Toggle
    const filterToggleBtn = document.getElementById('filter-toggle');
    const advancedFiltersPanel = document.getElementById('advanced-filters');
    if (filterToggleBtn && advancedFiltersPanel) {
        filterToggleBtn.addEventListener('click', () => {
            const isHidden = advancedFiltersPanel.style.display === 'none';
            advancedFiltersPanel.style.display = isHidden ? 'flex' : 'none';
            filterToggleBtn.classList.toggle('open', isHidden);
        });
    }

    // Price Filter
    const priceRange = document.getElementById('price-range');
    const priceVal = document.getElementById('price-val');
    if (priceRange && priceVal) {
        priceRange.addEventListener('input', (e) => {
            currentPriceMax = parseInt(e.target.value);
            if (currentPriceMax >= 500000) {
                priceVal.textContent = 'Tất cả';
            } else {
                priceVal.textContent = 'Dưới ' + new Intl.NumberFormat('vi-VN').format(currentPriceMax) + 'đ';
            }
        });
        priceRange.addEventListener('change', (e) => {
            currentDisplayCount = INITIAL_COUNT;
            applyFilters();
        });
    }

    // Rating Filter
    const ratingFilter = document.getElementById('rating-filter');
    if (ratingFilter) {
        const ratingBtns = ratingFilter.querySelectorAll('button');
        ratingBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                if (target.classList.contains('active')) {
                    target.classList.remove('active');
                    currentRatingMin = 0;
                } else {
                    ratingBtns.forEach(b => b.classList.remove('active'));
                    target.classList.add('active');
                    currentRatingMin = parseFloat(target.dataset.val);
                }
                currentDisplayCount = INITIAL_COUNT;
                applyFilters();
            });
        });
    }

    // Clear Filters
    const clearFilterBtn = document.getElementById('clear-filter');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            currentSort = 'newest';
            if(sortSelect) sortSelect.value = 'newest';
            
            currentPriceMax = 500000;
            if(priceRange) priceRange.value = 500000;
            if(priceVal) priceVal.textContent = 'Tất cả';
            
            currentRatingMin = 0;
            if(ratingFilter) ratingFilter.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            
            currentDisplayCount = INITIAL_COUNT;
            applyFilters();
        });
    }

    // Load More Button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentDisplayCount += 8;
            applyFilters();
        });
    }
};

const applyFilters = () => {
    let filtered = [...products];

    // Search
    if (currentSearch) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(currentSearch) || 
            p.author.toLowerCase().includes(currentSearch)
        );
    }

    // Category (Fallback if needed, though index.html removed it from all-books)
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter || p.category.includes(currentFilter));
    }

    // Advanced Filters
    if (currentPriceMax < 500000) {
        filtered = filtered.filter(p => p.price <= currentPriceMax);
    }
    if (currentRatingMin > 0) {
        filtered = filtered.filter(p => p.rating >= currentRatingMin);
    }

    // Sort
    if (currentSort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'bestseller') {
        filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    } else if (currentSort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
        // newest: publication year first, id fallback
        filtered.sort((a, b) => (getPublicationYear(b) - getPublicationYear(a)) || (b.id - a.id));
    }

    const total = filtered.length;
    const paginated = filtered.slice(0, currentDisplayCount);
    
    // Show skeleton briefly for UX
    const container = document.getElementById('product-list');
    if (container) {
        let skeletonHtml = '';
        for(let i=0; i<Math.min(8, paginated.length || 1); i++) {
            skeletonHtml += `
                <div class="product-card">
                    <div class="skeleton" style="padding-top: 150%;"></div>
                    <div class="product-info">
                        <div class="skeleton" style="height: 15px; width: 40%; margin-bottom: 10px;"></div>
                        <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: 10px;"></div>
                        <div class="skeleton" style="height: 15px; width: 60%; margin-bottom: auto;"></div>
                    </div>
                </div>
            `;
        }
        container.innerHTML = skeletonHtml;
        
        setTimeout(() => {
            renderProducts('product-list', paginated);
            
            // Handle Load More Button
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                if (currentDisplayCount >= total) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'inline-flex';
                }
            }
        }, 300); // 300ms fake loading
    }
};

// ==========================================
// FUZZY SEARCH LOGIC
// ==========================================
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

function highlight(text, query) {
  const norm = normalize(text);
  const normQ = normalize(query);
  const idx = norm.indexOf(normQ);
  if (idx === -1) return text;
  return text.slice(0, idx)
    + `<span class="search-highlight">${text.slice(idx, idx + query.length)}</span>`
    + text.slice(idx + query.length);
}

function fuzzyMatch(product, query) {
  const q = normalize(query);
  const name = normalize(product.title || product.name || '');
  const author = normalize(product.author || '');
  const category = normalize(product.category || '');
  return name.includes(q) || author.includes(q) || category.includes(q);
}

function getImgPath(product) {
  const img = product.image || product.img || product.cover || '';
  if (img.startsWith('http') || img.startsWith('../') || img.startsWith('/')) return img;
  return `../assets/images/${img}`;
}

function formatPrice(price) {
  return Number(price).toLocaleString('vi-VN') + ' đ';
}

function renderResults(results, query, dropdown) {
  if (results.length === 0) {
    dropdown.innerHTML = `
      <div class="search-no-result">Không tìm thấy sách phù hợp 😕</div>
    `;
    return;
  }
  dropdown.innerHTML = results.slice(0, 8).map(p => {
    const name = highlight(p.title || p.name || '', query);
    const author = p.author || '';
    const price = formatPrice(p.price || p.salePrice || 0);
    const img = getImgPath(p);
    const id = p.id;
    // Handle path differently depending on where we are
    const detailPath = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('index.html')
      ? `product-detail.html?id=${id}`
      : `pages/product-detail.html?id=${id}`;
      
    return `
      <a href="${detailPath}" class="search-result-item">
        <img src="${img}" alt="${p.title}" class="search-result-img" onerror="this.onerror=null;this.src='../assets/images/mat-biec.jpg'">
        <div class="search-result-info">
          <div class="search-result-name">${name}</div>
          <div class="search-result-author">${author}</div>
        </div>
        <div class="search-result-price">${price}</div>
      </a>
    `;
  }).join('');
}

export const initSearch = () => {
  const input = document.getElementById('search-input');
  const btn = document.getElementById('search-btn');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !btn || !dropdown) return;

  function doSearch() {
    const q = input.value.trim();
    if (q.length < 1) { dropdown.classList.remove('open'); return; }
    const results = products.filter(p => fuzzyMatch(p, q));
    renderResults(results, q, dropdown);
    dropdown.classList.add('open');
  }

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
    if (e.key === 'Escape') dropdown.classList.remove('open');
  });
  
  // Real-time fuzzy search while typing
  let debounceTimer;
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const q = e.target.value.trim();
        if (q.length > 0) {
            doSearch();
        } else {
            dropdown.classList.remove('open');
        }
    }, 200);
  });

  document.addEventListener('click', e => {
    if (!document.getElementById('search-wrapper')?.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
};
