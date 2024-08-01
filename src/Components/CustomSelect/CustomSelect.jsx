import { useRef, useState } from "react";
// import './CustomSelect.css'

/**
 * CustomSelect component
 * @param {Object} props - Component props
 * @param {boolean} props.isClearable - If the select can be cleared
 * @param {boolean} props.isSearchable - If the select has a search input
 * @param {boolean} props.isDisabled - If the select is disabled
 * @param {Array} props.options - The options for the select, can be grouped
 * @param {Object|Array} props.value - The currently selected value(s)
 * @param {string} props.placeholder - The placeholder text when no value is selected
 * @param {boolean} props.isGrouped - If the options are grouped
 * @param {boolean} props.isMulti - If multiple selections are allowed
 * @param {Function} props.onChangeHandler - Handler function for value changes
 * @param {Function} props.onMenuOpen - Handler function when the menu is opened
 * @param {Function} props.onSearchHandler - Handler function for search input changes
 */
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
    onSearchHandler
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef(null);

    /**
     * Handle selecting an option
     * @param {Object} option - The selected option
     */
    const handleSelect = (option) => {
        if (isMulti) {
            const newValue = value && Array.isArray(value) && value.includes(option)
                ? value.filter(val => val !== option)
                : [...(value || []), option];
            onChangeHandler(newValue);
        } else {
            onChangeHandler(option);
            setIsOpen(false);
        }
    };

    /**
     * Handle clearing the selected value(s)
     */
    const handleClear = () => {
        onChangeHandler(isMulti ? [] : null);
        setSearchTerm('');
    };

    /**
     * Handle search input change
     * @param {Object} event - The input change event
     */
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (onSearchHandler) {
            onSearchHandler(value);
        }
    };

    // Filter options based on search term
    const filteredOptions = isGrouped
        ? options.map(group => ({
            ...group,
            options: group.options.filter(option =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(group => group.options.length > 0)
        : options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className={`kzui-custom-select ${isDisabled ? 'kzui-custom-select--disabled' : ''}`} ref={selectRef}>
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
                    <span className="kzui-custom-select__single-value">{value.label}</span>
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
                        {isGrouped ? (
                            filteredOptions.map((group, index) => (
                                <li key={index} className="kzui-custom-select__group">
                                    <div className="kzui-custom-select__group-label">{group.label}</div>
                                    <ul className="kzui-custom-select__group-list">
                                        {group.options.map((option, idx) => (
                                            <li
                                                key={idx}
                                                className={`kzui-custom-select__option ${
                                                    value && Array.isArray(value) && value.includes(option)
                                                        ? 'kzui-custom-select__option--selected'
                                                        : ''
                                                }`}
                                                onClick={() => handleSelect(option)}
                                            >
                                                {option.label}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))
                        ) : (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className={`kzui-custom-select__option ${
                                        value && Array.isArray(value) && value.includes(option)
                                            ? 'kzui-custom-select__option--selected'
                                            : ''
                                    }`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.label}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;