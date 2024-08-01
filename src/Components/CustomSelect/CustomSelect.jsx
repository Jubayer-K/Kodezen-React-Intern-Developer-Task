import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./CustomSelect.css"; // Ensure this is imported

const CustomSelect = ({
  isClearable,
  isSearchable,
  isDisabled,
  options,
  value,
  placeholder,
  isGrouped,
  isMulti,
  onChangeHandler,
  onMenuOpen,
  onSearchHandler,
}) => {
  // State variables to manage dropdown state and search term
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);

  // Effect to call onMenuOpen when the menu opens
  useEffect(() => {
    if (isOpen && onMenuOpen) {
      onMenuOpen();
    }
  }, [isOpen, onMenuOpen]);

  // Effect to handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handler for selecting an option
  const handleSelect = (option) => {
    if (isMulti) {
      const newValue =
        value && Array.isArray(value) && value.includes(option)
          ? value.filter((val) => val !== option)
          : [...(value || []), option];
      onChangeHandler(newValue);
    } else {
      onChangeHandler(option);
      setIsOpen(false);
    }
  };

  // Handler for clearing the selection
  const handleClear = () => {
    onChangeHandler(isMulti ? [] : null);
    setSearchTerm("");
  };

  // Handler for search input changes
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (onSearchHandler) {
      onSearchHandler(value);
    }
  };

  // Filtered options based on the search term
  const filteredOptions = isGrouped
    ? options
        .map((group) => ({
          ...group,
          options: group.options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((group) => group.options.length > 0)
    : options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div
      className={`kzui-custom-select ${
        isDisabled ? "kzui-custom-select--disabled" : ""
      }`}
      ref={selectRef}
    >
      <h2 className="kzui-component-title"
      >
        Custom Select Component
      </h2>
      <div
        className="kzui-custom-select__input"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
      >
        {isMulti && value && value.length > 0 ? (
          <div className="kzui-custom-select__multi-values">
            {value.map((val, index) => (
              <span key={index} className="kzui-custom-select__multi-value">
                {val.label}
                {isClearable && (
                  <span
                    className="kzui-custom-select__clear-single"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(val);
                    }}
                  >
                    &times;
                  </span>
                )}
              </span>
            ))}
          </div>
        ) : value ? (
          <span className="kzui-custom-select__single-value">
            {value.label}
          </span>
        ) : (
          <span className="kzui-custom-select__placeholder">{placeholder}</span>
        )}
        {isClearable && value && (
          <span className="kzui-custom-select__clear-all" onClick={handleClear}>
            &times;
          </span>
        )}
      </div>

      {isOpen && (
        <div className="kzui-custom-select__menu">
          {isSearchable && (
            <input
              type="text"
              className="kzui-custom-select__search-input"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
            />
          )}

          <ul className="kzui-custom-select__list">
            {isGrouped
              ? filteredOptions.map((group, index) => (
                  <li key={index} className="kzui-custom-select__group">
                    <div className="kzui-custom-select__group-label">
                      {group.label}
                    </div>
                    <ul className="kzui-custom-select__group-list">
                      {group.options.map((option, idx) => (
                        <li
                          key={idx}
                          className={`kzui-custom-select__option ${
                            value &&
                            Array.isArray(value) &&
                            value.includes(option)
                              ? "kzui-custom-select__option--selected"
                              : ""
                          }`}
                          onClick={() => handleSelect(option)}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              : filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    className={`kzui-custom-select__option ${
                      value && Array.isArray(value) && value.includes(option)
                        ? "kzui-custom-select__option--selected"
                        : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </li>
                ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// PropTypes validation for props
CustomSelect.propTypes = {
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
          })
        ),
      }),
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      }),
    ])
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })
    ),
  ]),
  placeholder: PropTypes.string,
  isGrouped: PropTypes.bool,
  isMulti: PropTypes.bool,
  onChangeHandler: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func,
  onSearchHandler: PropTypes.func,
};

// Default props for the component
CustomSelect.defaultProps = {
  isClearable: false,
  isSearchable: false,
  isDisabled: false,
  value: null,
  placeholder: "Select...",
  isGrouped: false,
  isMulti: false,
  onMenuOpen: () => {},
  onSearchHandler: () => {},
};

export default CustomSelect;
