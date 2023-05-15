
const Dropdown = ({ value, onChange, options }) => {
  return (
    <>
      <h2>Sort by: </h2>
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Dropdown;