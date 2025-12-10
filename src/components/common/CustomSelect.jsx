import { useState, useRef, useEffect } from "react";
import { MdArrowDropDown } from "react-icons/md";

export const CustomSelect = ({
  name,
  value,
  loading = false,
  onChange,
  className = "",
  placeholder = "",
  options = [],
  // Customizable class props
  containerClassName = "",
  buttonClassName = "",
  dropdownClassName = "",
  optionClassName = "",
  optionActiveClassName = "",
  optionHoverClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (optionValue) => {
    // Simulate native onChange event
    const syntheticEvent = {
      target: {
        name,
        value: optionValue,
      },
    };
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative w-60 ${containerClassName}`}>
      {/* Hidden native select for form compatibility */}
      <select name={name} value={value ?? ""} readOnly className="sr-only">
        <option value="">{placeholder}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom button */}
      <button
        type="button"
        disabled={loading}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-2.5
          bg-gray-900 text-lg rounded-lg
          hover:bg-gray-800/40 
          focus:outline-1 focus:bg-gray-800/40 focus:outline-gray-700/40
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${selectedOption ? "text-gray-200" : "text-gray-500"}
          ${buttonClassName}
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <MdArrowDropDown
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && !loading && (
        <div
          className={`
            absolute z-50 w-full mt-1
            bg-gray-900 border border-gray-700/50 rounded-lg
            shadow-lg shadow-black/20
            max-h-60 overflow-auto
            animate-in fade-in-0 zoom-in-95 duration-200
            ${dropdownClassName}
          `}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                px-4 py-2.5 cursor-pointer
                text-gray-300 text-lg
                hover:bg-gray-800 hover:text-white
                transition-colors duration-150
                first:rounded-t-lg last:rounded-b-lg
                ${value === option.value ? "bg-gray-800/60 text-white " + optionActiveClassName : ""}
                ${optionHoverClassName}
                ${optionClassName}
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;