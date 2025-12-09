export const SelectFolder = ({label, name, value, loading, onChange, className, data }) => {
  
    const tables = data?.tableNames || [];
    
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
                <option value="" disabled hidden>
                    Wybierz folder
                </option>
                {tables.map((table, index) => (
                    <option key={index} value={table.folder}>{table.folder}</option>
                ))}
            </select>
        </div>
    )
}