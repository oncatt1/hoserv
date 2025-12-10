import { useRef } from "react";

export const FormInput = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  name, 
  placeholder = "",
  loading = false, 
  className = "",
  containerClassName = "",
  labelClassName = "",
}) => {
  const fileRef = useRef(null);

  // Base input styles matching CustomSelect
  const baseInputStyles = `
    w-full px-4 py-2.5
    bg-gray-900 text-gray-200 text-lg rounded-lg
    hover:bg-gray-800/40 
    focus:outline-1 focus:bg-gray-800/40 focus:outline-gray-700/40
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
    placeholder:text-gray-500
  `;

  // File input type
  if (type === "file") {
    const fileName = value && typeof value === "object" && value.name 
      ? value.name 
      : null;

    return (
      <div className={`flex flex-col w-full ${containerClassName}`}>
        {label && (
          <span className={`font-semibold text-[17px] pb-1 ${labelClassName}`}>
            {label}
          </span>
        )}
        
        <div
          onClick={() => !loading && fileRef.current?.click()}
          className={`
            w-60 px-4 py-2.5
            bg-gray-900 text-lg rounded-lg
            hover:bg-gray-800/40 
            focus:outline-1 focus:bg-gray-800/40 focus:outline-gray-700/40
            disabled:opacity-50
            transition-colors duration-200
            cursor-pointer
            flex items-center justify-between
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
          `}
        >
          <span className={`truncate ${fileName ? "text-gray-200" : "text-gray-500"}`}>
            {fileName ?? "Wybierz plik..."}
          </span>
          
          {/* Upload icon */}
          <svg
            className="w-5 h-5 ml-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </div>

        <input
          ref={fileRef}
          type="file"
          name={name}
          onChange={onChange}
          disabled={loading}
          className="hidden"
        />
      </div>
    );
  }

  // Textarea type
  if (type === "textarea") {
    return (
      <div className={`flex flex-col w-full ${containerClassName}`}>
        {label && (
          <span className={`font-semibold text-[17px] pb-1 ${labelClassName}`}>
            {label}
          </span>
        )}
        <textarea
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={loading}
          placeholder={placeholder}
          rows={4}
          className={`
            ${baseInputStyles}
            w-60 resize-none
            ${className}
          `}
        />
      </div>
    );
  }

  // Default input (text, email, password, number, etc.)
  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
          <span className={`font-semibold text-[17px] pb-1 ${labelClassName}`}>
            {label}
          </span>
        )}
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={loading}
        placeholder={placeholder}
        className={`
          ${baseInputStyles}
          w-60
          ${className}
        `}
      />
    </div>
  );
};

export default FormInput;