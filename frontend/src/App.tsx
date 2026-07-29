import React, { ChangeEvent, FormEvent } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Smartphone, 
  Laptop, 
  Layers, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  LogOut, 
  LogIn,
  Store,
  X,
  CheckCircle,
  HelpCircle,
  Info,
  Watch,
  Tablet as TabletIcon
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from './store';
import { 
  setActiveShop, 
  setShowAuthModal, 
  setAuthTab 
} from './store/authSlice';
import { 
  addShop, 
  updateShop,
  addProduct, 
  editProduct, 
  deleteProduct, 
  setSelectedProduct, 
  setShowAddEditModal, 
  setProductToEdit 
} from './store/productsSlice';
import { 
  setSearchQuery, 
  setSearchCategory, 
  setSelectedCategory, 
  setFilterBrand, 
  setFilterMinPrice, 
  setFilterMaxPrice, 
  setFilterInStockOnly, 
  setSortBy, 
  clearFilters 
} from './store/filtersSlice';
import { 
  addToast, 
  removeToast, 
  setActiveView, 
  setDashboardTab 
} from './store/uiSlice';
import { CATEGORIES } from './data/mockData';
import { Product, Shop } from './types';

export default function App() {
  const dispatch = useAppDispatch();

  // --- REDUX SELECTORS ---
  const { activeShop, showAuthModal, authTab } = useAppSelector(state => state.auth);
  const { items: products, shops, selectedProduct, showAddEditModal, productToEdit } = useAppSelector(state => state.products);
  const filters = useAppSelector(state => state.filters);
  const { toasts, activeView, dashboardTab } = useAppSelector(state => state.ui);

  // --- LOCAL COMPONENT STATES (FOR FORM INPUTS) ---
  const [loginShopId, setLoginShopId] = React.useState('');
  const [registerForm, setRegisterForm] = React.useState({
    name: '',
    ownerName: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    category: 'Mobiles & Accessories'
  });

  const [productForm, setProductForm] = React.useState({
    name: '',
    brand: '',
    category: 'Mobiles',
    description: '',
    price: '',
    stock: '',
    specVal1: '',
    specVal2: 'Grade A',
    specVal3: ''
  });

  const [profileForm, setProfileForm] = React.useState({
    name: '',
    ownerName: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    category: ''
  });

  // Sync profile form when dashboard tab loads or activeShop changes
  React.useEffect(() => {
    if (activeShop) {
      setProfileForm({
        name: activeShop.name,
        ownerName: activeShop.ownerName,
        phone: activeShop.phone,
        whatsapp: activeShop.whatsapp,
        address: activeShop.address,
        city: activeShop.city,
        category: activeShop.category || 'Mobiles & Accessories'
      });
    }
  }, [activeShop, dashboardTab]);

  // Sync edit product form
  React.useEffect(() => {
    if (productToEdit) {
      setProductForm({
        name: productToEdit.name,
        brand: productToEdit.brand,
        category: productToEdit.category,
        description: productToEdit.description,
        price: productToEdit.price.toString(),
        stock: productToEdit.stock.toString(),
        specVal1: productToEdit.specs?.['Storage'] || productToEdit.specs?.['Processor'] || '',
        specVal2: productToEdit.specs?.['Condition'] || 'Grade A',
        specVal3: productToEdit.specs?.['Warranty'] || ''
      });
    } else {
      setProductForm({
        name: '',
        brand: '',
        category: 'Mobiles',
        description: '',
        price: '',
        stock: '',
        specVal1: '',
        specVal2: 'Grade A',
        specVal3: ''
      });
    }
  }, [productToEdit, showAddEditModal]);

  // --- HELPERS ---
  const getSellerShop = (shopId: string): Shop => {
    return shops.find(s => s.id === shopId) || {
      id: "unknown",
      name: "Unknown Seller Shop",
      ownerName: "Dealer",
      phone: "+91 99999 99999",
      whatsapp: "919999999999",
      address: "Dealer Location",
      city: "India",
      category: "All Tech Products",
      verified: false,
      rating: 4.0,
      joinedDate: "Unknown"
    };
  };

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = products.filter(product => {
    // 1. Keyword search (Name, Brand, Description, Category)
    const query = filters.searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    // 2. Search category dropdown
    const matchesSearchCat = filters.searchCategory === 'All Categories' || 
      product.category.toLowerCase() === filters.searchCategory.toLowerCase();

    // 3. Quick-bar category select
    const matchesQuickCat = filters.selectedCategory === 'All Categories' || 
      product.category.toLowerCase() === filters.selectedCategory.toLowerCase();

    // 4. Sidebar Brand Filter
    const matchesBrand = !filters.filterBrand || 
      product.brand.toLowerCase() === filters.filterBrand.toLowerCase();

    // 5. Sidebar Price Range Filter
    const min = filters.filterMinPrice ? parseFloat(filters.filterMinPrice) : 0;
    const max = filters.filterMaxPrice ? parseFloat(filters.filterMaxPrice) : Infinity;
    const matchesPrice = product.price >= min && product.price <= max;

    // 6. Sidebar Stock Availability Filter
    const matchesStock = !filters.filterInStockOnly || product.stock > 0;

    return matchesQuery && matchesSearchCat && matchesQuickCat && matchesBrand && matchesPrice && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'stock') return b.stock - a.stock;
    return 0; // Default Featured (as defined in array)
  });

  // Extract unique brands for sidebar filters
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));

  // --- HANDLERS ---
  const triggerToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    dispatch(addToast({ message, type }));
    // Auto-remove toast via ID is handled inside slice (via action delay simulation)
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginShopId) return;
    const shop = shops.find(s => s.id === loginShopId);
    if (shop) {
      dispatch(setActiveShop(shop));
      dispatch(setShowAuthModal(false));
      triggerToast(`Welcome back, ${shop.name}!`, 'success');
      dispatch(setActiveView('marketplace'));
      setLoginShopId('');
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.ownerName || !registerForm.phone || !registerForm.whatsapp) {
      alert("Please fill in all mandatory fields.");
      return;
    }
    const newShop: Shop = {
      id: `shop-${shops.length + 1}`,
      name: registerForm.name,
      ownerName: registerForm.ownerName,
      phone: registerForm.phone,
      whatsapp: registerForm.whatsapp.replace(/\D/g, ''),
      address: registerForm.address || "Dealer Main Market",
      city: registerForm.city || "India",
      category: registerForm.category,
      verified: true,
      rating: 5.0,
      joinedDate: "Today"
    };

    dispatch(addShop(newShop));
    dispatch(setActiveShop(newShop));
    dispatch(setShowAuthModal(false));
    triggerToast(`Shop "${registerForm.name}" registered and logged in!`, 'success');
    
    // reset form
    setRegisterForm({
      name: '',
      ownerName: '',
      phone: '',
      whatsapp: '',
      address: '',
      city: '',
      category: 'Mobiles & Accessories'
    });
  };

  const handleProfileUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!activeShop) return;
    const updated: Shop = {
      ...activeShop,
      name: profileForm.name,
      ownerName: profileForm.ownerName,
      phone: profileForm.phone,
      whatsapp: profileForm.whatsapp,
      address: profileForm.address,
      city: profileForm.city,
      category: profileForm.category
    };
    
    dispatch(updateShop(updated));
    dispatch(setActiveShop(updated));
    triggerToast("Shop profile updated successfully!", "success");
  };

  const handleOpenAddProduct = () => {
    if (!activeShop) {
      dispatch(setAuthTab('login'));
      dispatch(setShowAuthModal(true));
      triggerToast("Please login or register your shop to list products.");
      return;
    }
    dispatch(setProductToEdit(null));
    dispatch(setShowAddEditModal(true));
  };

  const handleOpenEditProduct = (product: Product) => {
    dispatch(setProductToEdit(product));
    dispatch(setShowAddEditModal(true));
  };

  const handleProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeShop) return;

    const specs: Record<string, string> = {
      "Condition": productForm.specVal2
    };
    
    // Add conditional spec details
    if (productForm.category === 'Mobiles' || productForm.category === 'Tablets') {
      if (productForm.specVal1) specs['Storage'] = productForm.specVal1;
    } else if (productForm.category === 'Laptops') {
      if (productForm.specVal1) specs['Processor'] = productForm.specVal1;
    } else {
      if (productForm.specVal1) specs['Details'] = productForm.specVal1;
    }

    if (productForm.specVal3) specs['Warranty'] = productForm.specVal3;

    if (productToEdit) {
      const updated: Product = {
        ...productToEdit,
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        specs
      };
      dispatch(editProduct(updated));
      triggerToast("Product listing updated successfully!", "success");
    } else {
      const newProduct: Product = {
        id: `prod-${products.length + 1}`,
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        shopId: activeShop.id,
        specs
      };
      dispatch(addProduct(newProduct));
      triggerToast("New sourcing product listed successfully!", "success");
    }

    dispatch(setShowAddEditModal(false));
  };

  const handleDeleteListing = (productId: string) => {
    if (window.confirm("Are you sure you want to remove this product listing?")) {
      dispatch(deleteProduct(productId));
      triggerToast("Listing removed from database.");
    }
  };

  const handleCallSeller = (product: Product, seller: Shop) => {
    triggerToast(`📞 Simulating Direct Call: Dialing ${seller.phone} (${seller.name}) regarding "${product.name}"...`, 'success');
  };

  const handleWhatsAppSeller = (product: Product, seller: Shop) => {
    const text = `Hi ${seller.ownerName}, I saw your product "${product.name}" (Listed Sourcing Price: ₹${product.price.toLocaleString('en-IN')}) on MLX Market and want to source it to fulfill a customer requirement. Is it currently in stock?`;
    const waUrl = `https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(text)}`;
    triggerToast(`💬 Launching WhatsApp chat with ${seller.name} regarding sourcing...`, 'success');
    window.open(waUrl, '_blank');
  };

  const renderCategoryIcon = (category: string, cssClass = "card-visual-svg") => {
    switch (category.toLowerCase()) {
      case 'mobiles':
        return <Smartphone className={cssClass} />;
      case 'laptops':
        return <Laptop className={cssClass} />;
      case 'smart watches':
        return <Watch className={cssClass} />;
      case 'tablets':
        return <TabletIcon className={cssClass} />;
      default:
        return <Layers className={cssClass} />;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert Popups */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type === 'success' ? 'success' : ''}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
            <span>{toast.message}</span>
            <button className="clear-filter-btn" style={{ marginLeft: '1rem', color: 'white' }} onClick={() => dispatch(removeToast(toast.id))}>×</button>
          </div>
        ))}
      </div>

      {/* --- SITE HEADER --- */}
      <header className="site-header">
        <div className="header-container">
          <div className="logo-section" onClick={() => { dispatch(setActiveView('marketplace')); dispatch(clearFilters()); }}>
            <img src="/logo.png" alt="MLX Market Logo" className="logo-img" />
            <div className="logo-text">
              <span className="logo-title">MLX <span>MARKET</span></span>
              <span className="logo-subtitle">THE TRUSTED TECH SOURCING PLATFORM</span>
            </div>
          </div>

          {/* Search bar inside header */}
          <div className="header-search">
            <select 
              className="search-select"
              value={filters.searchCategory}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(setSearchCategory(e.target.value))}
            >
              <option value="All Categories">All Categories</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Laptops">Laptops</option>
              <option value="Accessories">Accessories</option>
              <option value="Tablets">Tablets</option>
              <option value="Smart Watches">Smart Watches</option>
            </select>
            <input 
              type="text" 
              className="search-input"
              placeholder="Search by product name, brand..."
              value={filters.searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setSearchQuery(e.target.value))}
            />
            <button className="search-btn" onClick={() => dispatch(setActiveView('marketplace'))}>
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <button className="action-btn sell-btn" onClick={handleOpenAddProduct}>
              <Plus size={16} />
              <span>Sell on MLX</span>
            </button>

            {activeShop ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  className={`action-btn ${activeView === 'dashboard' ? 'active' : ''}`}
                  onClick={() => { dispatch(setActiveView('dashboard')); dispatch(setDashboardTab('listings')); }}
                  style={{ 
                    backgroundColor: activeView === 'dashboard' ? 'var(--primary-light)' : 'transparent', 
                    color: activeView === 'dashboard' ? 'var(--primary)' : 'white' 
                  }}
                >
                  <Store size={16} />
                  <span>{activeShop.name}</span>
                </button>
                <button className="action-btn" onClick={() => { dispatch(setActiveShop(null)); triggerToast("Logged out successfully."); }} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="action-btn" onClick={() => { dispatch(setAuthTab('login')); dispatch(setShowAuthModal(true)); }}>
                <LogIn size={16} />
                <span>Dealer Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Category Sub-navigation */}
      <div className="category-bar">
        <div className="category-container">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`cat-tab ${filters.selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                dispatch(setSelectedCategory(cat));
                dispatch(setActiveView('marketplace'));
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- HERO BANNER (Marketplace Main View Only) --- */}
      {activeView === 'marketplace' && (
        <section className="hero-banner">
          <div className="hero-container">
            <div className="hero-content">
              <span className="hero-badge">
                <ShieldCheck size={14} />
                <span>100% Verified Shop-to-Shop Network</span>
              </span>
              <h1 className="hero-title">
                India's <span>Trusted</span> Tech Sourcing Network for Dealers
              </h1>
              <p className="hero-description">
                retailers can find products from other registered shops and source them to fulfill customer requirements. Zero commission. No checkout, direct call & whatsapp connections only.
              </p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => {
                  document.getElementById('marketplace-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Explore Sourcing Catalog
                </button>
                <button 
                  className="btn-outline-dark" 
                  onClick={() => {
                    if (activeShop) {
                      dispatch(setActiveView('dashboard'));
                    } else {
                      dispatch(setAuthTab('register'));
                      dispatch(setShowAuthModal(true));
                    }
                  }}
                >
                  Register Your Shop
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="device-art-card">
                <span className="art-title">Dealer Directory</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.25rem', color: '#FFF' }}>Sourcing Activity</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary-dark)' }}>Connecting 400+ tech shops across Delhi, Mumbai, Chennai, and Bengaluru</div>
                </div>
                <div className="art-stats">
                  <div className="stat-item">
                    <span className="stat-val">{shops.length}</span>
                    <span className="stat-lbl">Active Dealers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-val">{products.length}</span>
                    <span className="stat-lbl">Sourcing Assets</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-val">₹0</span>
                    <span className="stat-lbl">Platform Fees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="value-badges">
            <div className="badges-container">
              <span className="badge-item">
                <CheckCircle size={16} />
                <span><strong>100%</strong> Verified B2B Dealers Only</span>
              </span>
              <span className="badge-item">
                <Clock size={16} />
                <span><strong>No Customer</strong> Direct Checkout</span>
              </span>
              <span className="badge-item">
                <Layers size={16} />
                <span><strong>Real-time</strong> Stock & Spec Sheets</span>
              </span>
              <span className="badge-item">
                <Phone size={16} />
                <span><strong>Direct Call</strong> & WhatsApp Connections</span>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* --- MAIN MARKETPLACE / DASHBOARD VIEWS --- */}
      {activeView === 'marketplace' ? (
        <main className="main-content" id="marketplace-grid">
          {/* Sidebar Filters */}
          <aside className="sidebar-filters">
            <div className="filter-title-bar">
              <span className="filter-title">Filters</span>
              <button className="clear-filter-btn" onClick={() => dispatch(clearFilters())}>Clear All</button>
            </div>

            <div className="filter-group">
              <label className="filter-label">Brand</label>
              <select 
                className="filter-select"
                value={filters.filterBrand}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(setFilterBrand(e.target.value))}
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="number" 
                  className="filter-input" 
                  placeholder="Min" 
                  value={filters.filterMinPrice}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setFilterMinPrice(e.target.value))}
                />
                <input 
                  type="number" 
                  className="filter-input" 
                  placeholder="Max" 
                  value={filters.filterMaxPrice}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setFilterMaxPrice(e.target.value))}
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Stock Status</label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.filterInStockOnly}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setFilterInStockOnly(e.target.checked))}
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <div style={{ borderTop: '1px solid var(--light-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary-light)', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                <Info size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                <span>Showing sourcing options for shops. End-customers are not permitted.</span>
              </div>
            </div>
          </aside>

          {/* Products Grid Section */}
          <section className="products-section">
            <div className="catalog-header">
              <span className="catalog-count">
                Sourcing Inventory <span>({sortedProducts.length} items found)</span>
              </span>
              
              <div className="catalog-sort">
                <span>Sort by:</span>
                <select 
                  className="sort-select"
                  value={filters.sortBy}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(setSortBy(e.target.value as any))}
                >
                  <option value="featured">Featured Sourcing</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock">Stock Available</option>
                </select>
              </div>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="product-grid">
                {sortedProducts.map(product => {
                  const seller = getSellerShop(product.shopId);
                  const isOutOfStock = product.stock <= 0;
                  
                  return (
                    <article 
                      key={product.id} 
                      className="product-card"
                      onClick={() => dispatch(setSelectedProduct(product))}
                    >
                      <div className="card-img-wrapper">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="product-card-img" />
                        ) : (
                          renderCategoryIcon(product.category)
                        )}
                        <span className={`tag-stock ${isOutOfStock ? 'out' : 'in'}`}>
                          {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stock} units`}
                        </span>
                        {product.specs?.['Condition'] && (
                          <span className="tag-condition">{product.specs['Condition']}</span>
                        )}
                      </div>
                      
                      <div className="card-body">
                        <span className="card-brand">{product.brand}</span>
                        <h3 className="card-name">{product.name}</h3>
                        
                        <div className="card-dealer-info">
                          <div className="dealer-name">
                            <Store size={14} className="verified-icon" />
                            <span>{seller.name}</span>
                          </div>
                          <div className="dealer-location">
                            <MapPin size={12} />
                            <span>{seller.address}, {seller.city}</span>
                          </div>
                        </div>

                        <div className="card-footer">
                          <div>
                            <span className="card-price-label">Dealer wholesale price</span>
                            <div className="card-price">₹{product.price.toLocaleString('en-IN')}</div>
                          </div>
                          
                          <button className="card-action-btn" title="View details & contact">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <HelpCircle size={48} className="empty-icon" />
                <h3 className="empty-title">No matching sourcing inventory</h3>
                <p className="empty-desc">
                  Try adjusting your search criteria, selecting a different category, or removing filters.
                </p>
                <button className="btn-primary" onClick={() => dispatch(clearFilters())} style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </main>
      ) : (
        /* --- DASHBOARD VIEW --- */
        <main className="dashboard-view">
          <aside className="dashboard-sidebar">
            <div className="dashboard-profile-hdr">
              <div className="profile-avatar">
                {activeShop ? activeShop.name.charAt(0) : 'D'}
              </div>
              <h2 className="profile-name">{activeShop?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, backgroundColor: 'var(--success-bg)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                <ShieldCheck size={12} />
                <span>Verified Dealer Account</span>
              </div>
            </div>

            <div className="profile-stats-row">
              <div className="profile-stat-box">
                <div className="profile-stat-num">
                  {products.filter(p => p.shopId === activeShop?.id).length}
                </div>
                <div className="profile-stat-lbl">Active Listings</div>
              </div>
              <div className="profile-stat-box">
                <div className="profile-stat-num">{activeShop?.rating}★</div>
                <div className="profile-stat-lbl">Dealer Rating</div>
              </div>
            </div>

            <div className="dashboard-menu">
              <button 
                className={`dash-menu-btn ${dashboardTab === 'listings' ? 'active' : ''}`}
                onClick={() => dispatch(setDashboardTab('listings'))}
              >
                <Layers size={16} />
                <span>Manage Sourcing Listings</span>
              </button>
              <button 
                className={`dash-menu-btn ${dashboardTab === 'profile' ? 'active' : ''}`}
                onClick={() => dispatch(setDashboardTab('profile'))}
              >
                <User size={16} />
                <span>Edit Shop Profile</span>
              </button>
              <button className="dash-menu-btn" onClick={() => dispatch(setActiveView('marketplace'))} style={{ borderTop: '1px solid var(--light-border)', marginTop: '0.5rem', paddingTop: '1rem' }}>
                <Store size={16} />
                <span>Back to Sourcing Marketplace</span>
              </button>
            </div>
          </aside>

          <section style={{ flex: 1 }}>
            {dashboardTab === 'listings' ? (
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3 className="panel-title">My Sourcing Listings</h3>
                  <button className="btn-primary" onClick={handleOpenAddProduct} style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                    <Plus size={16} />
                    <span>Add Sourcing Product</span>
                  </button>
                </div>

                <div className="listings-list">
                  {products.filter(p => p.shopId === activeShop?.id).length > 0 ? (
                    products.filter(p => p.shopId === activeShop?.id).map(product => (
                      <div key={product.id} className="listing-item">
                        <div className="listing-preview-img">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="product-card-img" style={{ borderRadius: 'var(--radius-sm)' }} />
                          ) : (
                            renderCategoryIcon(product.category, "listing-preview-svg")
                          )}
                        </div>
                        <div className="listing-info">
                          <span className="listing-name">{product.name}</span>
                          <div className="listing-meta">
                            <span>Category: <strong>{product.category}</strong></span>
                            <span>Brand: <strong>{product.brand}</strong></span>
                            <span>Stock: <strong>{product.stock} units</strong></span>
                          </div>
                        </div>
                        <div className="listing-price-tag">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                        <div className="listing-actions">
                          <button 
                            className="btn-icon-action edit" 
                            title="Edit listing details"
                            onClick={() => handleOpenEditProduct(product)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-icon-action delete" 
                            title="Delete this listing"
                            onClick={() => handleDeleteListing(product.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary-light)' }}>
                      <Layers size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                      <p>You have not listed any products for other shops to source yet.</p>
                      <button className="btn-primary" onClick={handleOpenAddProduct} style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                        List Your First Product
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Edit Shop Profile</h3>
                </div>

                <form onSubmit={handleProfileUpdate} className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Shop Business Name *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      value={profileForm.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, name: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Owner Name *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      value={profileForm.ownerName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, ownerName: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Direct Phone Call Number *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      value={profileForm.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp Number (e.g. 919876543210) *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      value={profileForm.whatsapp}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, whatsapp: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      value={profileForm.city}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, city: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Main Business Segment</label>
                    <select 
                      className="form-select-box"
                      value={profileForm.category}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setProfileForm({...profileForm, category: e.target.value})}
                    >
                      <option value="Mobiles & Accessories">Mobiles & Accessories</option>
                      <option value="Laptops & Accessories">Laptops & Accessories</option>
                      <option value="Smart Watches & Audio">Smart Watches & Audio</option>
                      <option value="All Tech Products">All Tech Products</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Market Business Address *</label>
                    <textarea 
                      className="form-textarea" 
                      required
                      value={profileForm.address}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProfileForm({...profileForm, address: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="form-actions-row full-width">
                    <button type="submit" className="btn-primary">
                      Save Profile Updates
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </main>
      )}

      {/* --- FOOTER --- */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-info">
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/logo.png" alt="MLX Market Logo" style={{ height: '32px', width: '32px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              <span>MLX <span>MARKET</span></span>
            </div>
            <p className="footer-desc">
              MLX Market is an exclusive, closed-loop shop-to-shop (B2B) sourcing directory. It is not an e-commerce platform. There is no shopping cart, no checkout, and no customer directory.
            </p>
          </div>

          <div className="footer-links-col">
            <span className="footer-links-title">Quick Navigation</span>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); dispatch(setActiveView('marketplace')); dispatch(clearFilters()); }}>Sourcing Marketplace</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleOpenAddProduct(); }}>Add Product Listing</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); dispatch(setAuthTab('login')); dispatch(setShowAuthModal(true)); }}>Dealer Hub Access</a>
          </div>

          <div className="footer-links-col">
            <span className="footer-links-title">Support & Guidelines</span>
            <span className="footer-link">B2B Directory Policy</span>
            <span className="footer-link">Anti-Spam Verification</span>
            <span className="footer-link">Tech World Dealer Portal</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} MLX Market - Shop to Shop Sourcing Platform. All rights reserved.</span>
          <span>Designed exclusively for verified electronics retail dealers.</span>
        </div>
      </footer>

      {/* --- PRODUCT DETAIL MODAL OVERLAY --- */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => dispatch(setSelectedProduct(null))}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => dispatch(setSelectedProduct(null))}>
              <X size={18} />
            </button>

            <div className="product-detail-layout">
              <div className="detail-media">
                <div className="main-image-display">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="product-detail-img" />
                  ) : (
                    renderCategoryIcon(selectedProduct.category, "detail-visual-svg")
                  )}
                </div>
                <div className="thumbnail-row">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((img, idx) => (
                      <button key={idx} className={`thumb-btn ${idx === 0 ? 'active' : ''}`}>
                        <img src={img} alt="Product thumbnail" className="product-thumb-img" />
                      </button>
                    ))
                  ) : (
                    <>
                      <button className="thumb-btn active">
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {renderCategoryIcon(selectedProduct.category, "card-visual-svg")}
                        </div>
                      </button>
                      <button className="thumb-btn">
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                          <Layers size={20} />
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="detail-info">
                <div className="detail-header">
                  <span className="detail-category">{selectedProduct.category}</span>
                  <h2 className="detail-title">{selectedProduct.name}</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary-light)' }}>
                    Brand: <strong>{selectedProduct.brand}</strong> | Stock: <strong>{selectedProduct.stock > 0 ? `${selectedProduct.stock} units available` : 'Out of Stock'}</strong>
                  </span>
                </div>

                <div className="detail-price-row">
                  <span className="detail-price-lbl">Dealer Sourcing Cost:</span>
                  <span className="detail-price">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ borderTop: '1px solid var(--light-border)', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary-light)', lineHeight: 1.6 }}>
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Technical Specifications */}
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <div className="specs-section">
                    <span className="specs-title">Device Specifications</span>
                    <table className="specs-table">
                      <tbody>
                        {Object.entries(selectedProduct.specs).map(([key, val]) => (
                          <tr key={key}>
                            <td className="specs-key">{key}</td>
                            <td className="specs-val">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Seller shop Details & Actions */}
                {(() => {
                  const seller = getSellerShop(selectedProduct.shopId);
                  return (
                    <div className="dealer-info-card">
                      <span className="dealer-card-title">Fulfillment Partner Shop</span>
                      <div className="dealer-card-header">
                        <span className="dealer-card-name">{seller.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--info)', fontSize: '0.75rem', fontWeight: 600 }}>
                          <ShieldCheck size={14} />
                          <span>Verified Dealer</span>
                        </div>
                      </div>
                      <div className="dealer-card-address">
                        <MapPin size={14} style={{ marginTop: '0.1rem' }} />
                        <span>{seller.address}, {seller.city}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="dealer-card-joined">Joined: {seller.joinedDate}</span>
                        <span className="dealer-card-joined">Dealer Rating: <strong>{seller.rating} ★</strong></span>
                      </div>

                      {/* NO CART / Wishlist: Direct Connect B2B Actions only */}
                      <div className="sourcing-actions" style={{ marginTop: '0.5rem' }}>
                        <button 
                          className="btn-call"
                          onClick={() => handleCallSeller(selectedProduct, seller)}
                        >
                          <Phone size={16} />
                          <span>Call Dealer</span>
                        </button>
                        <button 
                          className="btn-whatsapp"
                          onClick={() => handleWhatsAppSeller(selectedProduct, seller)}
                        >
                          <Smartphone size={16} />
                          <span>WhatsApp Dealer</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {showAddEditModal && (
        <div className="modal-overlay" onClick={() => dispatch(setShowAddEditModal(false))}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <button className="modal-close-btn" onClick={() => dispatch(setShowAddEditModal(false))}>
              <X size={18} />
            </button>

            <div style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--light-border)', paddingBottom: '0.75rem' }}>
                {productToEdit ? 'Edit Sourcing Product Listing' : 'List Product for Sourcing Discovery'}
              </h3>

              <form onSubmit={handleProductSubmit} className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Product Name / Model *</label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    required
                    placeholder="e.g. iPhone 17 Pro (Grade A)"
                    value={productForm.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    required
                    placeholder="e.g. Apple, Samsung, Dell"
                    value={productForm.brand}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, brand: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Sourcing Category *</label>
                  <select 
                    className="form-select-box"
                    value={productForm.category}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setProductForm({...productForm, category: e.target.value})}
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Smart Watches">Smart Watches</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sourcing Cost (₹) *</label>
                  <input 
                    type="number" 
                    className="form-input-text" 
                    required
                    placeholder="Dealer cost in INR"
                    value={productForm.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, price: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity Available *</label>
                  <input 
                    type="number" 
                    className="form-input-text" 
                    required
                    placeholder="Units in hand"
                    value={productForm.stock}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, stock: e.target.value})}
                  />
                </div>

                {/* Technical specifications depending on category */}
                <div className="form-group">
                  <label className="form-label">
                    {productForm.category === 'Mobiles' || productForm.category === 'Tablets' ? 'Storage Size' : 
                     productForm.category === 'Laptops' ? 'Processor details' : 'Other Spec details'}
                  </label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    placeholder={productForm.category === 'Mobiles' ? "e.g. 128GB" : "e.g. Core i7, White color"}
                    value={productForm.specVal1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, specVal1: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Device Physical Condition *</label>
                  <select 
                    className="form-select-box"
                    value={productForm.specVal2}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setProductForm({...productForm, specVal2: e.target.value})}
                  >
                    <option value="Brand New (Sealed)">Brand New (Sealed)</option>
                    <option value="Open Box (Like New)">Open Box (Like New)</option>
                    <option value="Grade A (Like New)">Grade A (Like New)</option>
                    <option value="Grade B (Minor Wear)">Grade B (Minor Wear)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Warranty details</label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    placeholder="e.g. 6 Months Store Warranty, 1 Year Apple Warranty"
                    value={productForm.specVal3}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, specVal3: e.target.value})}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Detailed Sourcing Description *</label>
                  <textarea 
                    className="form-textarea" 
                    required
                    placeholder="Detail physical condition, screen state, battery, box availability, and bulk negotiation terms."
                    value={productForm.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProductForm({...productForm, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="form-actions-row full-width">
                  <button 
                    type="button" 
                    className="btn-outline-dark" 
                    style={{ padding: '0.6rem 1.2rem' }}
                    onClick={() => dispatch(setShowAddEditModal(false))}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                    {productToEdit ? 'Save Changes' : 'Submit Sourcing Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- AUTHENTICATION MODAL (LOGIN & REGISTRATION) --- */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => dispatch(setShowAuthModal(false))}>
          <div className="modal-content auth-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => dispatch(setShowAuthModal(false))}>
              <X size={18} />
            </button>

            <div className="auth-header">
              <h3 className="auth-title">Dealer Network Hub</h3>
              <p className="auth-subtitle">Verify your shop credentials to trade with other dealers.</p>
            </div>

            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => dispatch(setAuthTab('login'))}
              >
                Sign In Shop
              </button>
              <button 
                className={`auth-tab ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => dispatch(setAuthTab('register'))}
              >
                Register Shop
              </button>
            </div>

            {authTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Registered Sourcing Dealer Shop</label>
                  <select 
                    className="form-select-box"
                    required
                    value={loginShopId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setLoginShopId(e.target.value)}
                  >
                    <option value="">-- Choose Shop to Simulate --</option>
                    {shops.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.ownerName} - {s.city})</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary-light)', backgroundColor: 'var(--light-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <Info size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>Choose one of the demo shops above to log in and simulate adding, editing, and deleting inventory items.</span>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Login to Sourcing Portal
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Shop Business Name *</label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    required
                    placeholder="e.g. Apex Electronics"
                    value={registerForm.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Owner Name *</label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    required
                    placeholder="e.g. Vikram Mehta"
                    value={registerForm.ownerName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, ownerName: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input 
                    type="tel" 
                    className="form-input-text" 
                    required
                    placeholder="e.g. +91 98123 45678"
                    value={registerForm.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, phone: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp Number *</label>
                  <input 
                    type="tel" 
                    className="form-input-text" 
                    required
                    placeholder="e.g. 919812345678"
                    value={registerForm.whatsapp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, whatsapp: e.target.value})}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      placeholder="e.g. Mumbai"
                      value={registerForm.city}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category Segment</label>
                    <select 
                      className="form-select-box"
                      value={registerForm.category}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegisterForm({...registerForm, category: e.target.value})}
                    >
                      <option value="Mobiles & Accessories">Mobiles & Accessories</option>
                      <option value="Laptops & Accessories">Laptops & Accessories</option>
                      <option value="Smart Watches & Audio">Smart Watches & Audio</option>
                      <option value="All Tech Products">All Tech Products</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Market Business Address *</label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    required
                    placeholder="e.g. Shop 102, Lamington Road"
                    value={registerForm.address}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, address: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  Create Sourcing Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
