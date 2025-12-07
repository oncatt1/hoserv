export const FormSelect = ({label, name, value, loading, onChange, count, className, data }) => {
    const optionsArray = Array.from({ length: count }, (_, i) => i + 1);

    return(
        <div className="flex flex-col w-full">
            <span className="font-semibold text-[17px] pb-1">{label}</span>
            <select 
                name={name} 
                value={value ?? ""}
                disabled={loading}
                onChange={onChange}
                className={`bg-gray-900 text-gray-400 text-lg hover:bg-gray-800/40 rounded-lg 
                        focus:outline-1 focus:bg-gray-800/40 focus:outline-gray-700/40 w-60${className}`}
            >
                
                {optionsArray.map((number) => (
                    <option value="">dddd</option>
                ))}
            </select>
        </div>
    )
}