export const FormInput = ({ label, type = "text", value, onchange, name, loading = "", className = ""}) =>
{
    return(
        <div className="flex flex-col w-full">
            <span className="font-semibold text-[17px] pb-1">{label}</span> 
                <input 
                    type={type} 
                    name={name} 
                    value={value}
                    onChange={onchange}
                    disabled={loading}
                    className={`bg-gray-900 text-white hover:bg-gray-800/40 rounded-lg 
                        focus:outline-1 focus:bg-gray-900/40 focus:outline-gray-700 w-60 ${className}`}/>
        </div>
    )
}