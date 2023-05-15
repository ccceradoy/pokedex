const SearchTerm = ({ value, onChange }) => {
  return (
    <div>
      <input
        id="input"
        type="text"
        placeholder="Search for Name or ID"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchTerm;