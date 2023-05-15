const Dropdown = ({ value, onChange, options }) => {
  return (
    <div>
    <h2 style={{ display: 'inline', fontSize: '16px'}}>Sort by: </h2>
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;