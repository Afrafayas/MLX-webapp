import React, { ChangeEvent, FormEvent } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Smartphone, 
  Laptop, 
  Layers, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
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
  Tablet as TabletIcon,
  MessageSquare,
  Tag,
  Calendar
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from './store';
import { 
  setActiveShop, 
  setActiveUser,
  setAuthRole,
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
  setProductToEdit,
  addLead
} from './store/productsSlice';
import { 
  setSearchQuery, 
  setSearchCategory, 
  setSelectedCategory, 
  setFilterBrand, 
  setFilterMinPrice, 
  setFilterMaxPrice, 
  setFilterInStockOnly, 
  setFilterCity,
  setFilterMaxBudget,
  setSortBy, 
  clearFilters 
} from './store/filtersSlice';
import { 
  addToast, 
  removeToast, 
  setActiveView, 
  setDashboardTab 
} from './store/uiSlice';
import { CATEGORIES, CITIES, BUDGET_PRESETS, INITIAL_USERS } from './data/mockData';
import { Product, Shop, Lead, User as CustomerUser } from './types';

interface ToastItemProps {
  toast: {
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning';
  };
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${toast.type === 'success' ? 'success' : ''}`}>
      {toast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
      <span>{toast.message}</span>
      <button className="clear-filter-btn" style={{ marginLeft: '1rem', color: 'white' }} onClick={onClose}>×</button>
    </div>
  );
}

export default function App() {
  const dispatch = useAppDispatch();

  // --- REDUX SELECTORS ---
  const { activeShop, activeUser, authRole, showAuthModal, authTab } = useAppSelector(state => state.auth);
  const { items: products, shops, leads, selectedProduct, showAddEditModal, productToEdit } = useAppSelector(state => state.products);
  const filters = useAppSelector(state => state.filters);
  const { toasts, activeView, dashboardTab } = useAppSelector(state => state.ui);

  // --- LOCAL COMPONENT STATES (FOR FORM INPUTS) ---
  const [customerEmailInput, setCustomerEmailInput] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      badge: "🔥 Hot Deal of the Week",
      title: "Up to 40% Off on Certified Used iPhones",
      subtext: "Hand-tested Grade A devices with store warranty. Direct deals, zero platform commission.",
      offerText: "Limited stock starting at ₹12,000",
      image: "/images/iphone_17_pro_1.png",
      bgColor: "#111217"
    },
    {
      badge: "💻 Tech For Students",
      title: "Spotless Refurbished MacBooks & Laptops",
      subtext: "Corporate refurbished items. Minimum 3 months seller warranty and fast chargers included.",
      offerText: "Deals starting at ₹18,000",
      image: "/images/macbook_air_m3.png",
      bgColor: "#0f172a"
    },
    {
      badge: "🛡️ MLX Verified Local Stores",
      title: "Buy Directly From Local Dealers Near You",
      subtext: "Pick your city location, click Call/WhatsApp to inspect before you buy. 100% safe store checks.",
      offerText: "Available in Kochi, Calicut, Trivandrum & Thrissur",
      image: "/images/watch_ultra_2.png",
      bgColor: "#022c22"
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  
  const [customerRegisterForm, setCustomerRegisterForm] = React.useState({
    name: '',
    email: '',
    phone: ''
  });

  // customer dashboard sub-navigation tab state
  const [customerTab, setCustomerTab] = React.useState<'inquiries' | 'profile'>('inquiries');
  
  // customer profile editor form inputs state
  const [custProfileForm, setCustProfileForm] = React.useState({
    name: '',
    email: '',
    phone: ''
  });

  // Sync profile editor fields when the logged-in customer user changes
  React.useEffect(() => {
    if (activeUser) {
      setCustProfileForm({
        name: activeUser.name,
        email: activeUser.email,
        phone: activeUser.phone
      });
    }
  }, [activeUser]);

  const [registerForm, setRegisterForm] = React.useState({
    name: '',
    ownerName: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: 'Kochi',
    category: 'Mobiles & Tablets'
  });

  const [productForm, setProductForm] = React.useState({
    name: '',
    brand: '',
    category: 'Mobiles',
    description: '',
    price: '',
    stock: '',
    specVal1: '',
    specVal2: 'Grade A (Like New)',
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
        category: activeShop.category || 'Mobiles & Tablets'
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
        specVal2: productToEdit.specs?.['Condition'] || 'Grade A (Like New)',
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
        specVal2: 'Grade A (Like New)',
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
    const seller = getSellerShop(product.shopId);

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

    // 7. B2C City Location Filter
    const matchesCity = filters.filterCity === 'All Cities' || 
      seller.city.toLowerCase() === filters.filterCity.toLowerCase();

    // 8. B2C Budget Preset Filter
    let matchesBudget = true;
    if (filters.filterMaxBudget !== 'Any Budget') {
      const limit = parseInt(filters.filterMaxBudget.replace(/\D/g, ''), 10);
      if (!isNaN(limit)) {
        matchesBudget = product.price <= limit;
      }
    }

    return matchesQuery && matchesSearchCat && matchesQuickCat && matchesBrand && matchesPrice && matchesStock && matchesCity && matchesBudget;
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
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (authRole === 'seller') {
      if (!customerEmailInput) return;
      // Strip out any non-digits from input for comparison
      const enteredPhone = customerEmailInput.replace(/\D/g, '').trim();
      
      if (!enteredPhone) {
        alert("Please enter a valid phone number to sign in.");
        return;
      }

      // Find shop by comparing the numeric digits of phone or whatsapp numbers
      const shop = shops.find(s => {
        const shopPhoneClean = s.phone.replace(/\D/g, '');
        const shopWhatsappClean = s.whatsapp.replace(/\D/g, '');
        return shopPhoneClean.endsWith(enteredPhone) || shopWhatsappClean.endsWith(enteredPhone) || s.phone.includes(enteredPhone);
      });
      
      if (shop) {
        dispatch(setActiveShop(shop));
        dispatch(setActiveUser(null)); // Logout user
        dispatch(setShowAuthModal(false));
        triggerToast(`Welcome back, ${shop.name}!`, 'success');
        dispatch(setActiveView('seller-dashboard'));
        dispatch(setDashboardTab('listings'));
        setCustomerEmailInput('');
      } else {
        alert(`No registered store partner found with phone number matching "${customerEmailInput}". Please check the phone number or register a new shop account.`);
      }
    } else {
      // Customer login logic
      if (!customerEmailInput) return;
      const cleanInput = customerEmailInput.toLowerCase().trim();

      // Retrieve dynamic registered users from localStorage
      let customUsers: CustomerUser[] = [];
      try {
        const savedUsers = localStorage.getItem('mlx_registered_users');
        if (savedUsers) customUsers = JSON.parse(savedUsers);
      } catch (err) {
        console.error(err);
      }

      const allUsers = [...INITIAL_USERS, ...customUsers];
      const matchedUser = allUsers.find(u => u.email.toLowerCase() === cleanInput || u.phone.replace(/\D/g, '') === customerEmailInput.replace(/\D/g, '').trim());
      
      if (matchedUser) {
        dispatch(setActiveUser(matchedUser));
        dispatch(setActiveShop(null)); // Logout seller
        dispatch(setShowAuthModal(false));
        triggerToast(`Welcome back, ${matchedUser.name}!`, 'success');
        dispatch(setActiveView('customer-dashboard'));
        setCustomerEmailInput('');
      } else {
        // Fallback demo user creation
        const demoUser: CustomerUser = {
          id: `user-${Date.now()}`,
          name: "Guest Customer",
          email: customerEmailInput.includes('@') ? customerEmailInput.trim() : `${customerEmailInput.replace(/\D/g, '') || Date.now()}@mlx.com`,
          phone: customerEmailInput.includes('@') ? "+91 90000 00000" : customerEmailInput.trim()
        };
        dispatch(setActiveUser(demoUser));
        dispatch(setActiveShop(null));
        dispatch(setShowAuthModal(false));
        triggerToast(`Signed in as ${demoUser.name} (${demoUser.email})`, 'success');
        dispatch(setActiveView('customer-dashboard'));
        setCustomerEmailInput('');
      }
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (authRole === 'seller') {
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
        city: registerForm.city,
        category: registerForm.category,
        verified: true,
        rating: 5.0,
        joinedDate: "Today"
      };

      dispatch(addShop(newShop));
      dispatch(setActiveShop(newShop));
      dispatch(setActiveUser(null));
      dispatch(setShowAuthModal(false));
      triggerToast(`Shop "${registerForm.name}" registered and logged in!`, 'success');
      dispatch(setActiveView('seller-dashboard'));
      
      // reset form
      setRegisterForm({
        name: '',
        ownerName: '',
        phone: '',
        whatsapp: '',
        address: '',
        city: 'New Delhi',
        category: 'Mobiles & Tablets'
      });
    } else {
      // Customer registration logic
      if (!customerRegisterForm.name || !customerRegisterForm.email || !customerRegisterForm.phone) {
        alert("Please fill in all fields.");
        return;
      }
      const newCust: CustomerUser = {
        id: `user-${Date.now()}`,
        name: customerRegisterForm.name,
        email: customerRegisterForm.email,
        phone: customerRegisterForm.phone
      };

      // Save new user profile dynamically to localStorage
      let customUsers: CustomerUser[] = [];
      try {
        const savedUsers = localStorage.getItem('mlx_registered_users');
        if (savedUsers) customUsers = JSON.parse(savedUsers);
      } catch (err) {
        console.error(err);
      }
      customUsers.push(newCust);
      localStorage.setItem('mlx_registered_users', JSON.stringify(customUsers));

      dispatch(setActiveUser(newCust));
      dispatch(setActiveShop(null));
      dispatch(setShowAuthModal(false));
      triggerToast(`Welcome to MLX Market, ${customerRegisterForm.name}!`, 'success');
      dispatch(setActiveView('customer-dashboard'));

      setCustomerRegisterForm({
        name: '',
        email: '',
        phone: ''
      });
    }
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
      dispatch(setAuthRole('seller'));
      dispatch(setAuthTab('login'));
      dispatch(setShowAuthModal(true));
      triggerToast("Please login as a seller to list products.");
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
      triggerToast("Listing updated successfully!", "success");
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
        specs,
        images: []
      };
      dispatch(addProduct(newProduct));
      triggerToast("New used gadget listed successfully!", "success");
    }

    dispatch(setShowAddEditModal(false));
  };

  const handleDeleteListing = (productId: string) => {
    if (window.confirm("Are you sure you want to remove this product listing?")) {
      dispatch(deleteProduct(productId));
      triggerToast("Listing removed from directory.");
    }
  };

  // Capture Lead & Open Link
  const triggerLeadCapture = (product: Product, seller: Shop, contactType: 'call' | 'whatsapp') => {
    const leadId = `lead-${Date.now()}`;
    const name = activeUser ? activeUser.name : "Anonymous Buyer";
    const phone = activeUser ? activeUser.phone : "Not Logged In";
    
    const newLead: Lead = {
      id: leadId,
      shopId: seller.id,
      productId: product.id,
      productName: product.name,
      customerName: name,
      customerPhone: phone,
      contactType,
      createdAt: new Date().toISOString()
    };
    
    dispatch(addLead(newLead));
  };

  const handleCallSeller = (product: Product, seller: Shop) => {
    triggerLeadCapture(product, seller, 'call');
    triggerToast(`📞 Connecting call with ${seller.name} (${seller.phone}) regarding "${product.name}"...`, 'success');
  };

  const handleWhatsAppSeller = (product: Product, seller: Shop) => {
    triggerLeadCapture(product, seller, 'whatsapp');
    const name = activeUser ? activeUser.name : "Customer";
    const text = `Hi ${seller.ownerName}, I saw your product "${product.name}" listed for ₹${product.price.toLocaleString('en-IN')} on MLX Market. I am interested in buying it. Is it still available? - Sent by ${name}`;
    const waUrl = `https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(text)}`;
    triggerToast(`💬 Opening WhatsApp chat with ${seller.name} regarding "${product.name}"...`, 'success');
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

  // Filter lists inside Instagram search overlay
  const handleTagClick = (tagType: 'query' | 'category' | 'budget' | 'city', value: string) => {
    if (tagType === 'query') {
      dispatch(setSearchQuery(value));
    } else if (tagType === 'category') {
      dispatch(setSelectedCategory(value));
    } else if (tagType === 'budget') {
      dispatch(setFilterMaxBudget(value));
    } else if (tagType === 'city') {
      dispatch(setFilterCity(value));
    }
    setIsSearchFocused(false);
    dispatch(setActiveView('marketplace'));
  };

  return (
    <div className="app-container">
      {/* Toast Alert Popups */}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onClose={() => dispatch(removeToast(toast.id))} 
          />
        ))}
      </div>

      {/* --- SITE HEADER --- */}
      <header className="site-header">
        <div className="header-container">
          <div className="logo-section" onClick={() => { dispatch(setActiveView('marketplace')); dispatch(clearFilters()); }}>
            <img src="/logo.png" alt="MLX Market Logo" className="logo-img" />
            <div className="logo-text">
              <span className="logo-title">MLX <span>DIRECT</span></span>
              <span className="logo-subtitle">USED GADGETS DIRECTORY</span>
            </div>
          </div>

          {/* Search bar inside header with Instagram-Style dropdown overlay */}
          <div className="header-search-container" style={{ position: 'relative', flex: 1, maxWidth: '550px', zIndex: isSearchFocused ? 102 : 1 }}>
            <div className="header-search" style={{ position: 'relative', zIndex: isSearchFocused ? 105 : 1 }}>
              <select 
                className="search-select"
                value={filters.searchCategory}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(setSearchCategory(e.target.value))}
              >
                <option value="All Categories">All Categories</option>
                {CATEGORIES.filter(c => c !== "All Categories").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input 
                type="text" 
                className="search-input"
                placeholder="Search used iPhones, OnePlus, budget..."
                value={filters.searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setSearchQuery(e.target.value))}
              />
              <button className="search-btn" onClick={() => { setIsSearchFocused(false); dispatch(setActiveView('marketplace')); }}>
                <Search size={16} />
                <span>Search</span>
              </button>
            </div>

            {/* Instagram Style Search Overlay Panel */}
            {isSearchFocused && (
              <>
                <div className="search-overlay-backdrop" onClick={() => setIsSearchFocused(false)}></div>
                <div className="search-explore-overlay minimal-search-overlay">
                  {/* Row 1: Detect Location & Cities */}
                  <div className="overlay-minimal-row">
                    <button 
                      type="button"
                      className="detect-location-btn" 
                      onClick={() => {
                        dispatch(setFilterCity('Kochi'));
                        triggerToast("📍 Geolocation active: Selected Kochi as nearest city!", "success");
                        setIsSearchFocused(false);
                        dispatch(setActiveView('marketplace'));
                      }}
                    >
                      <MapPin size={13} style={{ flexShrink: 0 }} />
                      <span>Near Me</span>
                    </button>
                    <div className="minimal-tags">
                      {CITIES.filter(c => c !== "All Cities").map(city => (
                        <button key={city} className="min-tag city" onClick={() => handleTagClick('city', city)}>{city}</button>
                      ))}
                    </div>
                  </div>

                  {/* Row 2: Budgets & Categories */}
                  <div className="overlay-minimal-row">
                    <span className="min-row-lbl">Budgets:</span>
                    <div className="minimal-tags">
                      <button className="min-tag budget" onClick={() => handleTagClick('budget', 'Under ₹5,000')}>&lt; 5k</button>
                      <button className="min-tag budget" onClick={() => handleTagClick('budget', 'Under ₹10,000')}>&lt; 10k</button>
                      <button className="min-tag budget" onClick={() => handleTagClick('budget', 'Under ₹25,000')}>&lt; 25k</button>
                    </div>
                    <span className="min-row-lbl" style={{ marginLeft: '0.5rem' }}>Categories:</span>
                    <div className="minimal-tags">
                      <button className="min-tag cat" onClick={() => handleTagClick('category', 'Mobiles')}>Mobiles</button>
                      <button className="min-tag cat" onClick={() => handleTagClick('category', 'Laptops')}>Laptops</button>
                      <button className="min-tag cat" onClick={() => handleTagClick('category', 'Smart Watches')}>Watches</button>
                    </div>
                  </div>

                  {/* Row 3: Trending Models */}
                  <div className="overlay-minimal-row" style={{ borderTop: '1px solid var(--light-border)', paddingTop: '0.5rem', marginTop: '0.25rem', width: '100%' }}>
                    <span className="min-row-lbl">Trending:</span>
                    <div className="minimal-tags">
                      <button className="min-tag model" onClick={() => handleTagClick('query', 'iPhone 13')}>iPhone 13</button>
                      <button className="min-tag model" onClick={() => handleTagClick('query', 'Samsung S22')}>Samsung S22</button>
                      <button className="min-tag model" onClick={() => handleTagClick('query', 'MacBook Air')}>MacBook Air</button>
                      <button className="min-tag model" onClick={() => handleTagClick('query', 'OnePlus')}>OnePlus</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Header Action Buttons for standard Users and Seller Shop Portal */}
          <div className="header-actions">
            {activeShop ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  className={`action-btn sell-btn ${activeView === 'seller-dashboard' ? 'active' : ''}`} 
                  onClick={() => { dispatch(setActiveView('seller-dashboard')); dispatch(setDashboardTab('listings')); }}
                >
                  <Store size={16} />
                  <span>Shop Dashboard</span>
                </button>
                <button className="action-btn" onClick={() => { dispatch(setActiveShop(null)); triggerToast("Seller logged out."); dispatch(setActiveView('marketplace')); }} title="Logout Shop">
                  <LogOut size={16} />
                </button>
              </div>
            ) : activeUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  className={`action-btn sell-btn ${activeView === 'customer-dashboard' ? 'active' : ''}`}
                  onClick={() => dispatch(setActiveView('customer-dashboard'))}
                >
                  <Layers size={15} />
                  <span>My Dashboard</span>
                </button>
                <span className="user-indicator">
                  <User size={14} />
                  <span>{activeUser.name} (Buyer)</span>
                </span>
                <button className="action-btn" onClick={() => { dispatch(setActiveUser(null)); triggerToast("Logged out successfully."); dispatch(setActiveView('marketplace')); }} title="Logout User">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="action-btn sell-btn" onClick={() => { dispatch(setAuthRole('customer')); dispatch(setAuthTab('login')); dispatch(setShowAuthModal(true)); }}>
                  <LogIn size={15} />
                  <span>Sign In / Register</span>
                </button>
              </div>
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

      {/* --- TOP DYNAMIC SLIDER (Marketplace Main View Only) --- */}
      {activeView === 'marketplace' && (
        <section className="slider-banner-section" style={{ background: slides[currentSlide].bgColor }}>
          <div className="slider-banner-container">
            <div className="slider-content-pane">
              <span className="slider-badge">
                <ShieldCheck size={14} />
                <span>{slides[currentSlide].badge}</span>
              </span>
              <h2 className="slider-title">{slides[currentSlide].title}</h2>
              <p className="slider-subtext">{slides[currentSlide].subtext}</p>
              <div className="slider-offer-badge">
                <Tag size={14} />
                <span>{slides[currentSlide].offerText}</span>
              </div>
              <div className="slider-controls">
                {slides.map((_, idx) => (
                  <button 
                    key={idx} 
                    className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="slider-image-pane">
              <div className="slider-radial-glow"></div>
              <img src={slides[currentSlide].image} alt="Promotion device" className="slider-floating-img" />
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
              <span className="filter-title">Filter Gadgets</span>
              <button className="clear-filter-btn" onClick={() => dispatch(clearFilters())}>Clear All</button>
            </div>

            {/* City Selector */}
            <div className="filter-group">
              <label className="filter-label">Select City</label>
              <select 
                className="filter-select"
                value={filters.filterCity}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(setFilterCity(e.target.value))}
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Budget Presets */}
            <div className="filter-group">
              <label className="filter-label">Max Budget Limit</label>
              <select 
                className="filter-select"
                value={filters.filterMaxBudget}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(setFilterMaxBudget(e.target.value))}
              >
                {BUDGET_PRESETS.map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
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

            {/* Custom Price Range */}
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

            {/* In Stock only */}
            <div className="filter-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.filterInStockOnly}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setFilterInStockOnly(e.target.checked))}
                />
                <span>Show in-stock items only</span>
              </label>
            </div>

            <div className="trust-sidebar-widget">
              <Info size={16} className="widget-icon" />
              <span><strong>No Checkout System:</strong> MLX lists verified device inventories. Dial or WhatsApp shop owners directly to buy.</span>
            </div>
          </aside>

          {/* Products Grid Section */}
          <section className="products-section">
            <div className="catalog-header">
              <span className="catalog-count">
                Available Devices <span>({sortedProducts.length} items found)</span>
              </span>
              
              <div className="catalog-sort">
                <span>Sort by:</span>
                <select 
                  className="sort-select"
                  value={filters.sortBy}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(setSortBy(e.target.value as any))}
                >
                  <option value="featured">Featured Listings</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock">Stock Available</option>
                </select>
              </div>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="product-grid">
                {/* Dynamically insert Center Banner in between products (after 3 items) */}
                {sortedProducts.map((product, index) => {
                  const seller = getSellerShop(product.shopId);
                  const isOutOfStock = product.stock <= 0;
                  
                  const renderCard = (
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
                            <span className="card-price-label">Consumer Selling Price</span>
                            <div className="card-price">₹{product.price.toLocaleString('en-IN')}</div>
                          </div>
                          
                          <button className="card-action-btn" title="View details & contact">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );

                  // Inject Centre banner
                  if (index === 3) {
                    return (
                      <React.Fragment key="center-banner-wrapper">
                        <div className="centre-process-banner">
                          <div className="process-guide-badge">
                            <ShieldCheck size={14} />
                            <span>Safe Buyer Guide</span>
                          </div>
                          <h3 className="process-headline">How to buy safely in 3 easy steps:</h3>
                          <div className="process-steps">
                            <div className="process-step-card">
                              <div className="step-icon-wrapper">
                                <MapPin size={18} />
                              </div>
                              <span className="step-card-num">Step 1</span>
                              <p className="step-card-txt">Select your city and browse used gadgets near you</p>
                            </div>
                            
                            <div className="process-step-card">
                              <div className="step-icon-wrapper">
                                <Phone size={18} />
                              </div>
                              <span className="step-card-num">Step 2</span>
                              <p className="step-card-txt">Click WhatsApp or Call to contact the store directly</p>
                            </div>
                            
                            <div className="process-step-card">
                              <div className="step-icon-wrapper">
                                <CheckCircle size={18} />
                              </div>
                              <span className="step-card-num">Step 3</span>
                              <p className="step-card-txt">Meet dealer, physically inspect the gadget, and buy</p>
                            </div>
                          </div>
                          <span className="process-footer">No hidden platform fees. No commissions. Pure peer-to-merchant deals.</span>
                        </div>
                        {renderCard}
                      </React.Fragment>
                    );
                  }

                  return renderCard;
                })}
              </div>
            ) : (
              <div className="empty-state">
                <HelpCircle size={48} className="empty-icon" />
                <h3 className="empty-title">No used gadgets match these criteria</h3>
                <p className="empty-desc">
                  Try clearing location/budget filters or searching for another device name.
                </p>
                <button className="btn-primary" onClick={() => dispatch(clearFilters())} style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </main>
      ) : activeView === 'customer-dashboard' ? (
        /* --- CUSTOMER DASHBOARD VIEW --- */
        <main className="dashboard-view customer-dashboard-view">
          <aside className="dashboard-sidebar">
            <div className="dashboard-profile-hdr">
              <div className="profile-avatar">
                {activeUser ? activeUser.name.charAt(0) : 'C'}
              </div>
              <h2 className="profile-name">{activeUser?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, backgroundColor: 'rgba(255, 111, 0, 0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                <User size={12} />
                <span>Verified Buyer Portal</span>
              </div>
            </div>

            <div className="profile-stats-row">
              <div className="profile-stat-box">
                <div className="profile-stat-num">
                  {leads.filter(l => activeUser && l.customerPhone === activeUser.phone).length}
                </div>
                <div className="profile-stat-lbl">Inquiries Sourced</div>
              </div>
            </div>

            <div className="dashboard-menu">
              <button 
                className={`dash-menu-btn ${customerTab === 'inquiries' ? 'active' : ''}`}
                onClick={() => setCustomerTab('inquiries')}
              >
                <MessageSquare size={16} />
                <span>My Inquiries Log</span>
              </button>
              
              <button 
                className={`dash-menu-btn ${customerTab === 'profile' ? 'active' : ''}`}
                onClick={() => setCustomerTab('profile')}
              >
                <User size={16} />
                <span>My Profile Details</span>
              </button>

              <button 
                className="dash-menu-btn exit-dash-btn"
                onClick={() => dispatch(setActiveView('marketplace'))}
                style={{ marginTop: 'auto', backgroundColor: 'transparent', border: '1px solid var(--light-border)', color: 'var(--text-primary-light)' }}
              >
                <ChevronLeft size={16} />
                <span>Exit Dashboard</span>
              </button>
            </div>
          </aside>

          <section className="dashboard-content">
            {customerTab === 'inquiries' ? (
              /* Customer Inquiries Log */
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3 className="panel-title">My Inquiries Log</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary-light)' }}>
                    Direct Peer-to-Merchant Connections
                  </div>
                </div>

                <div className="leads-list-container" style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary-light)', marginBottom: '1.5rem' }}>
                    Below is the log of verified used gadgets you inquired about. You can use these details to contact store partners again.
                  </p>
                  
                  {leads.filter(l => activeUser && l.customerPhone === activeUser.phone).length > 0 ? (
                    <table className="leads-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--light-bg)', textAlign: 'left', borderBottom: '1px solid var(--light-border)' }}>
                          <th style={{ padding: '0.75rem' }}>Inquiry Date</th>
                          <th style={{ padding: '0.75rem' }}>Used Device Model</th>
                          <th style={{ padding: '0.75rem' }}>Store Partner</th>
                          <th style={{ padding: '0.75rem' }}>Store Location</th>
                          <th style={{ padding: '0.75rem' }}>Contact Channel</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.filter(l => activeUser && l.customerPhone === activeUser.phone).map((lead) => {
                          const matchingProduct = products.find(p => p.id === lead.productId);
                          const store = shops.find(s => s.id === lead.shopId);
                          return (
                            <tr key={lead.id} style={{ borderBottom: '1px solid var(--light-border)' }}>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <Calendar size={14} style={{ color: 'var(--text-secondary-light)' }} />
                                  <span>{new Date(lead.createdAt).toLocaleDateString('en-IN', { dateStyle: 'short' })}</span>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                                {lead.productName}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                {store ? store.name : "Local Store Partner"}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                {store ? `${store.address}, ${store.city}` : "Kerala, India"}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <span className={`lead-badge ${lead.contactType}`}>
                                  {lead.contactType === 'whatsapp' ? 'WhatsApp' : 'Direct Call'}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                {store && matchingProduct ? (
                                  <button 
                                    className="action-btn sell-btn" 
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                    onClick={() => {
                                      if (lead.contactType === 'whatsapp') {
                                        handleWhatsAppSeller(matchingProduct, store);
                                      } else {
                                        handleCallSeller(matchingProduct, store);
                                      }
                                    }}
                                  >
                                    <Phone size={11} />
                                    <span>Contact Again</span>
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary-light)' }}>Unavailable</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary-light)' }}>
                      <HelpCircle size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                      <p>You haven't made any inquiries yet. Click Call/WhatsApp on any used device to connect with local stores!</p>
                      <button className="btn-primary" onClick={() => dispatch(setActiveView('marketplace'))} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                        Browse Used Gadgets
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Customer Profile Edit */
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3 className="panel-title">My Profile Details</h3>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!custProfileForm.name || !custProfileForm.email || !custProfileForm.phone) {
                      alert("Please fill in all required fields.");
                      return;
                    }
                    if (activeUser) {
                      const updatedUser = {
                        ...activeUser,
                        name: custProfileForm.name,
                        email: custProfileForm.email,
                        phone: custProfileForm.phone
                      };

                      // Update user list in localStorage
                      let customUsers: CustomerUser[] = [];
                      try {
                        const savedUsers = localStorage.getItem('mlx_registered_users');
                        if (savedUsers) customUsers = JSON.parse(savedUsers);
                      } catch (err) {
                        console.error(err);
                      }

                      const userIdx = customUsers.findIndex(u => u.id === activeUser.id);
                      if (userIdx !== -1) {
                        customUsers[userIdx] = updatedUser;
                      } else {
                        customUsers.push(updatedUser);
                      }
                      localStorage.setItem('mlx_registered_users', JSON.stringify(customUsers));

                      dispatch(setActiveUser(updatedUser));
                      triggerToast("Profile updated successfully!", "success");
                    }
                  }} 
                  className="form-grid"
                >
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      value={custProfileForm.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustProfileForm({...custProfileForm, name: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-input-text" 
                      required
                      value={custProfileForm.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustProfileForm({...custProfileForm, email: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-input-text" 
                      required
                      value={custProfileForm.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustProfileForm({...custProfileForm, phone: e.target.value})}
                    />
                  </div>

                  <div className="form-actions-row full-width" style={{ marginTop: '1rem' }}>
                    <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </main>
      ) : (
        /* --- SELLER DASHBOARD VIEW --- */
        <main className="dashboard-view">
          <aside className="dashboard-sidebar">
            <div className="dashboard-profile-hdr">
              <div className="profile-avatar">
                {activeShop ? activeShop.name.charAt(0) : 'D'}
              </div>
              <h2 className="profile-name">{activeShop?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, backgroundColor: 'var(--success-bg)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                <ShieldCheck size={12} />
                <span>Verified Seller Shop</span>
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
                <div className="profile-stat-num">
                  {leads.filter(l => l.shopId === activeShop?.id).length}
                </div>
                <div className="profile-stat-lbl">Total Leads</div>
              </div>
            </div>

            <div className="dashboard-menu">
              <button 
                className={`dash-menu-btn ${dashboardTab === 'listings' ? 'active' : ''}`}
                onClick={() => dispatch(setDashboardTab('listings'))}
              >
                <Layers size={16} />
                <span>Manage Product Listings</span>
              </button>
              
              {/* New Leads Report Tab */}
              <button 
                className={`dash-menu-btn ${dashboardTab === 'leads' ? 'active' : ''}`}
                onClick={() => dispatch(setDashboardTab('leads'))}
              >
                <MessageSquare size={16} />
                <span>Leads & Performance Report</span>
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
                <span>Back to Marketplace Directory</span>
              </button>
            </div>
          </aside>

          <section style={{ flex: 1 }}>
            {dashboardTab === 'listings' ? (
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3 className="panel-title">My Used Devices Inventory</h3>
                  <button className="btn-primary" onClick={handleOpenAddProduct} style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                    <Plus size={16} />
                    <span>List Used Product</span>
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
                            title="Edit details"
                            onClick={() => handleOpenEditProduct(product)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-icon-action delete" 
                            title="Remove listing"
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
                      <p>You have not listed any gadgets for customers to discover yet.</p>
                      <button className="btn-primary" onClick={handleOpenAddProduct} style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                        List Your First Device
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : dashboardTab === 'leads' ? (
              /* Leads Report Panel */
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Customer Lead Inquiries Report</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary-light)' }}>
                    Subscription Billing: <strong>Active (Per Lead Model)</strong>
                  </div>
                </div>

                <div className="leads-metric-cards">
                  <div className="metric-card">
                    <span className="metric-num">{leads.filter(l => l.shopId === activeShop?.id).length}</span>
                    <span className="metric-lbl">Total Sourced Leads</span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-num">{leads.filter(l => l.shopId === activeShop?.id && l.contactType === 'whatsapp').length}</span>
                    <span className="metric-lbl">WhatsApp Inquiries</span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-num">{leads.filter(l => l.shopId === activeShop?.id && l.contactType === 'call').length}</span>
                    <span className="metric-lbl">Direct Calls Logged</span>
                  </div>
                </div>

                <div className="leads-list-container" style={{ marginTop: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Inquiry Log History</h4>
                  
                  {leads.filter(l => l.shopId === activeShop?.id).length > 0 ? (
                    <table className="leads-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--light-bg)', textAlign: 'left', borderBottom: '1px solid var(--light-border)' }}>
                          <th style={{ padding: '0.75rem' }}>Date & Time</th>
                          <th style={{ padding: '0.75rem' }}>Product Device</th>
                          <th style={{ padding: '0.75rem' }}>Customer (Buyer)</th>
                          <th style={{ padding: '0.75rem' }}>Phone Details</th>
                          <th style={{ padding: '0.75rem' }}>Inquiry Channel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.filter(l => l.shopId === activeShop?.id).map((lead) => (
                          <tr key={lead.id} style={{ borderBottom: '1px solid var(--light-border)' }}>
                            <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Calendar size={14} style={{ color: 'var(--text-secondary-light)' }} />
                              <span>{new Date(lead.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </td>
                            <td style={{ padding: '0.75rem', fontWeight: 600 }}>{lead.productName}</td>
                            <td style={{ padding: '0.75rem' }}>{lead.customerName}</td>
                            <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{lead.customerPhone}</td>
                            <td style={{ padding: '0.75rem' }}>
                              <span className={`lead-badge ${lead.contactType}`}>
                                {lead.contactType === 'whatsapp' ? 'WhatsApp Clicks' : 'Direct Call Clicks'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary-light)' }}>
                      <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                      <p>No customer contacts recorded yet. Make sure your shop location and contact info are accurate to attract clicks!</p>
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
                    <label className="form-label">City Location *</label>
                    <select 
                      className="form-select-box"
                      value={profileForm.city}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setProfileForm({...profileForm, city: e.target.value})}
                    >
                      {CITIES.filter(c => c !== "All Cities").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Main Business Segment</label>
                    <select 
                      className="form-select-box"
                      value={profileForm.category}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setProfileForm({...profileForm, category: e.target.value})}
                    >
                      <option value="Mobiles & Tablets">Mobiles & Tablets</option>
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
              <span>MLX <span>DIRECT</span></span>
            </div>
            <p className="footer-desc">
              MLX Direct is India's premium B2C used gadgets directory, connecting verified local dealers with consumers directly. We collect zero commission fees on user transactions.
            </p>
          </div>

          <div className="footer-links-col">
            <span className="footer-links-title">Quick Navigation</span>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); dispatch(setActiveView('marketplace')); dispatch(clearFilters()); }}>Consumer Marketplace</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleOpenAddProduct(); }}>List Used Gadget</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); dispatch(setAuthRole('seller')); dispatch(setAuthTab('login')); dispatch(setShowAuthModal(true)); }}>Verified Store Sign In</a>
          </div>

          <div className="footer-links-col">
            <span className="footer-links-title">Support & Guidelines</span>
            <span className="footer-link">MLX verification process</span>
            <span className="footer-link">Anti-Fraud purchasing tips</span>
            <span className="footer-link">Retail subscription model</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} MLX Direct - Shop to Customer Used Gadget Directory.</span>
          <span>Connecting consumers with verified merchants near their city.</span>
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
                  <span className="detail-price-lbl">Dealer Listing Price:</span>
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
                    <span className="specs-title">Device Specifics</span>
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
                      <span className="dealer-card-title">Sold by Store Partner</span>
                      <div className="dealer-card-header">
                        <span className="dealer-card-name">{seller.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--info)', fontSize: '0.75rem', fontWeight: 600 }}>
                          <ShieldCheck size={14} />
                          <span>Verified Store</span>
                        </div>
                      </div>
                      <div className="dealer-card-address">
                        <MapPin size={14} style={{ marginTop: '0.1rem' }} />
                        <span>{seller.address}, {seller.city}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                        <span className="dealer-card-joined">Joined: {seller.joinedDate}</span>
                        <span className="dealer-card-joined">Seller Rating: <strong>{seller.rating} ★</strong></span>
                      </div>

                      {/* NO CART: Call/WhatsApp Direct Action dispatches a Lead */}
                      <div className="sourcing-actions" style={{ marginTop: '0.75rem' }}>
                        <button 
                          className="btn-call"
                          onClick={() => handleCallSeller(selectedProduct, seller)}
                        >
                          <Phone size={16} />
                          <span>Call Dealer Shop</span>
                        </button>
                        <button 
                          className="btn-whatsapp"
                          onClick={() => handleWhatsAppSeller(selectedProduct, seller)}
                        >
                          <Smartphone size={16} />
                          <span>WhatsApp Merchant</span>
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
                {productToEdit ? 'Edit Used Device Details' : 'List Used Gadget for Selling'}
              </h3>

              <form onSubmit={handleProductSubmit} className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Product Name / Model *</label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    required
                    placeholder="e.g. iPhone 13 (Grade A)"
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
                    placeholder="e.g. Apple, Samsung, Xiaomi"
                    value={productForm.brand}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, brand: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gadget Category *</label>
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
                  <label className="form-label">Consumer Selling Price (₹) *</label>
                  <input 
                    type="number" 
                    className="form-input-text" 
                    required
                    placeholder="Listing price in INR"
                    value={productForm.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, price: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Units Available *</label>
                  <input 
                    type="number" 
                    className="form-input-text" 
                    required
                    placeholder="Units in hand"
                    value={productForm.stock}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, stock: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {productForm.category === 'Mobiles' || productForm.category === 'Tablets' ? 'Storage Capacity' : 
                     productForm.category === 'Laptops' ? 'Processor details' : 'Other Spec details'}
                  </label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    placeholder={productForm.category === 'Mobiles' ? "e.g. 128GB" : "e.g. Core i5"}
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
                  <label className="form-label">Warranty / Shop Warranty details</label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    placeholder="e.g. 3 Months Shop Warranty"
                    value={productForm.specVal3}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, specVal3: e.target.value})}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Detailed Device Description *</label>
                  <textarea 
                    className="form-textarea" 
                    required
                    placeholder="Include battery status, scuffs, color, charger details..."
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
                    {productToEdit ? 'Save Changes' : 'Submit Device Listing'}
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
              <h3 className="auth-title">Welcome to MLX Direct</h3>
              <p className="auth-subtitle">Verify your credentials to explore or trade verified used gadgets.</p>
            </div>

            {/* Custom Role Toggles */}
            <div className="auth-role-toggles" style={{ display: 'flex', borderBottom: '1px solid var(--light-border)', marginBottom: '1.25rem' }}>
              <button 
                type="button"
                className={`auth-role-btn ${authRole === 'customer' ? 'active' : ''}`}
                onClick={() => dispatch(setAuthRole('customer'))}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  borderBottom: authRole === 'customer' ? '2px solid var(--primary)' : '2px solid transparent',
                  background: 'none',
                  fontWeight: 600,
                  color: authRole === 'customer' ? 'var(--primary)' : 'var(--text-secondary-light)',
                  cursor: 'pointer'
                }}
              >
                For Customers
              </button>
              <button 
                type="button"
                className={`auth-role-btn ${authRole === 'seller' ? 'active' : ''}`}
                onClick={() => dispatch(setAuthRole('seller'))}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  borderBottom: authRole === 'seller' ? '2px solid var(--primary)' : '2px solid transparent',
                  background: 'none',
                  fontWeight: 600,
                  color: authRole === 'seller' ? 'var(--primary)' : 'var(--text-secondary-light)',
                  cursor: 'pointer'
                }}
              >
                For Shop Owners
              </button>
            </div>

            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => dispatch(setAuthTab('login'))}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => dispatch(setAuthTab('register'))}
              >
                Register Account
              </button>
            </div>

            {authTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    {authRole === 'seller' ? 'Enter Registered Shop Phone Number *' : 'Enter Email / Phone to Sign In *'}
                  </label>
                  <input 
                    type="text" 
                    className="form-input-text" 
                    required
                    placeholder={authRole === 'seller' ? "e.g. 98765 43210 or 9812345678" : "e.g. arjun@gmail.com or enter any demo text"}
                    value={customerEmailInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerEmailInput(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary-light)', backgroundColor: 'var(--light-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <Info size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {authRole === 'seller' ? (
                    <span>Demo shop logins: Enter any mock shop phone, e.g. <strong>9876543210</strong> (Kochi Gadgets) or <strong>9812345678</strong> (Calicut Refurb).</span>
                  ) : (
                    <span>Demo customer logins: <strong>arjun@gmail.com</strong> or <strong>priya@yahoo.com</strong>. Feel free to type anything else to auto-create a user.</span>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {authRole === 'seller' ? 'Login to Store Dashboard' : 'Customer Sign In'}
                </button>
              </form>
            ) : (
              authRole === 'seller' ? (
                /* Seller Shop Registration */
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Shop / Business Name *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      placeholder="e.g. Tech World Dealers"
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
                    <label className="form-label">Shop Mobile *</label>
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
                      <select 
                        className="form-select-box"
                        value={registerForm.city}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegisterForm({...registerForm, city: e.target.value})}
                      >
                        {CITIES.filter(c => c !== "All Cities").map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Main Business Category</label>
                      <select 
                        className="form-select-box"
                        value={registerForm.category}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegisterForm({...registerForm, category: e.target.value})}
                      >
                        <option value="Mobiles & Tablets">Mobiles & Tablets</option>
                        <option value="Laptops & Accessories">Laptops & Accessories</option>
                        <option value="Smart Watches & Audio">Smart Watches & Audio</option>
                        <option value="All Tech Products">All Tech Products</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Shop Physical Address *</label>
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
                    Create Store Account
                  </button>
                </form>
              ) : (
                /* Customer Registration */
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input-text" 
                      required
                      placeholder="e.g. Arjun Nair"
                      value={customerRegisterForm.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerRegisterForm({...customerRegisterForm, name: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-input-text" 
                      required
                      placeholder="e.g. arjun@gmail.com"
                      value={customerRegisterForm.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerRegisterForm({...customerRegisterForm, email: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-input-text" 
                      required
                      placeholder="e.g. +91 94460 55432"
                      value={customerRegisterForm.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerRegisterForm({...customerRegisterForm, phone: e.target.value})}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    Create Customer Account
                  </button>
                </form>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
