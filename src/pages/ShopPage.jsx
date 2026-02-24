import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { IoGrid, IoList, IoFunnel, IoClose } from "react-icons/io5";
import products from "../data/products";
import { filterProducts, sortProducts } from "../utils/filterProducts";
import ProductCard from "../components/product/ProductCard";
import "./ShopPage.css";

const CATEGORIES = ["headphones", "keyboards", "monitors", "mice", "accessories"];
const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Most Popular" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

const PAGE_SIZE = 8;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("default");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState(() => ({
    search:     searchParams.get("search") || "",
    categories: searchParams.get("category") ? [searchParams.get("category")] : [],
    minPrice:   0,
    maxPrice:   200000,
    minRating:  0,
    inStock:    false,
  }));

  useEffect(() => {
    const search = searchParams.get("search");
    const cat    = searchParams.get("category");
    if (search || cat) {
      setFilters((f) => ({
        ...f,
        search: search || f.search,
        categories: cat ? [cat] : f.categories,
      }));
    }
  }, []);

  const toggleCategory = (cat) => {
    setFilters((f) => {
      const cats = f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat];
      return { ...f, categories: cats };
    });
    setPage(1);
  };

  const setRating = (rating) => {
    setFilters((f) => ({ ...f, minRating: f.minRating === rating ? 0 : rating }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: "", categories: [], minPrice: 0, maxPrice: 200000, minRating: 0, inStock: false });
    setSortBy("default");
    setPage(1);
    setSearchParams({});
  };

  const filtered  = useMemo(() => filterProducts(products, filters), [filters]);
  const sorted    = useMemo(() => sortProducts(filtered, sortBy), [filtered, sortBy]);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page]
  );

  const activeFilterCount =
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.maxPrice < 2000 ? 1 : 0);

  return (
    <div className="shop-page page-wrapper">
      <div className="container">
        <div className="shop-header">
          <div>
            <h1 className="shop-title">
              {filters.search ? `Results for "${filters.search}"` : "All Products"}
            </h1>
            <p className="shop-count">{sorted.length} products found</p>
          </div>
          <div className="shop-controls">
            <button
              className={`filter-toggle-btn ${activeFilterCount > 0 ? "active" : ""}`}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <IoFunnel size={18} />
              Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </button>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="shop-layout">
          <aside className={`filter-sidebar ${filtersOpen ? "open" : ""}`}>
            <div className="filter-sidebar__header">
              <h3>Filters</h3>
              <div className="filter-sidebar__actions">
                {activeFilterCount > 0 && (
                  <button className="clear-btn" onClick={clearFilters}>Clear all</button>
                )}
                <button className="filter-close-btn" onClick={() => setFiltersOpen(false)}>
                  <IoClose size={20} />
                </button>
              </div>
            </div>

            <div className="filter-group">
              <h4 className="filter-group__title">Search</h4>
              <input
                type="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
                className="filter-search"
              />
            </div>

            <div className="filter-group">
              <h4 className="filter-group__title">Category</h4>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filter-check">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className="check-box" />
                  <span className="check-label">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  <span className="check-count">
                    {products.filter((p) => p.category === cat).length}
                  </span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4 className="filter-group__title">Max Price: ${filters.maxPrice}</h4>
              <input
                type="range"
                min={0}
                max={200000}
                step={1000}
                value={filters.maxPrice}
                onChange={(e) => { setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) })); setPage(1); }}
                className="price-range"
              />
              <div className="price-labels">
                <span>₹0</span>
                <span>₹2,00,000</span>
              </div>
            </div>

            <div className="filter-group">
              <h4 className="filter-group__title">Min Rating</h4>
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  className={`rating-filter-btn ${filters.minRating === r ? "active" : ""}`}
                  onClick={() => setRating(r)}
                >
                  {"*".repeat(r)} & Up
                </button>
              ))}
            </div>

            <div className="filter-group">
              <label className="filter-toggle">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => { setFilters((f) => ({ ...f, inStock: e.target.checked })); setPage(1); }}
                />
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          <div className="shop-products">
            {paginated.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="grid-auto">
                {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${page === p ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {filtersOpen && <div className="filter-overlay" onClick={() => setFiltersOpen(false)} />}
    </div>
  );
};

export default ShopPage;
