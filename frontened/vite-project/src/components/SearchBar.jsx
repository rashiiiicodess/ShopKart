const SearchBar = ({ search, setSearch, category, setCategory, sort, setSort }) => {
  return (
    <div style={styles.container}>
      {/* Search Input Field */}
      <div style={styles.inputWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        {search && (
          <button 
            onClick={() => setSearch('')} 
            style={styles.clearBtn}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      <div style={styles.selectWrapper}>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          style={styles.select}
        >
          <option value="All" style={styles.option}>All Categories</option>
          <option value="Electronics" style={styles.option}>Electronics</option>
          <option value="Fashion" style={styles.option}>Fashion</option>
          <option value="Books" style={styles.option}>Books</option>
          <option value="Home" style={styles.option}>Home</option>
        </select>
      </div>

      {/* Sort Dropdown */}
      <div style={styles.selectWrapper}>
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)} 
          style={styles.select}
        >
          <option value="" style={styles.option}>Sort By</option>
          <option value="price_asc" style={styles.option}>Price: Low to High</option>
          <option value="price_desc" style={styles.option}>Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  inputWrapper: {
    position: 'relative',
    flex: '2',
    minWidth: '240px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '0.9rem',
    color: '#64748b',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.65rem 2.25rem 0.65rem 2.25rem',
    fontSize: '0.925rem',
    backgroundColor: '#0f172a', // Deep slate background matching the main page
    color: '#f8fafc',
    border: '1px solid #334155',
    borderRadius: '10px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '0.85rem',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '50%',
  },
  selectWrapper: {
    flex: '1',
    minWidth: '160px',
  },
  select: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    fontSize: '0.925rem',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    border: '1px solid #334155',
    borderRadius: '10px',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  option: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
  },
};

export default SearchBar;