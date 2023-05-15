const SearchTerm = ({ value, onChange, styles }) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search by name or id"
        value={value}
        onChange={onChange}
        className={styles.searchInput}
      />
    </div>
  );
}

export default SearchTerm;