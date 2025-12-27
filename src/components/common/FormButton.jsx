export const FormButton = ({type = "submit", loading, className = "", text, loadingText}) => {
    const btnText = loading ? loadingText : text
    return(
        <button 
            type={type} 
            disabled={loading}
            className={`w-60 px-4 py-2.5 mt-10
            bg-gray-900 text-gray-200 text-lg rounded-lg
            hover:bg-gray-800/40 
            focus:outline-1 focus:bg-gray-800/40 focus:outline-gray-700/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            cursor-pointer shadow-lg ${className}`}
            >
                {btnText}
        </button>
    )
}