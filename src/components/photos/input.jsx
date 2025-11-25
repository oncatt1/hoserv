export const Input = ({type, name, className = "", placeholder = "", onChange, value}) =>{
    return(
        <input 
            type={type} 
            name={name} 
            className={` text-white  rounded-lg px-2 p-1 focus:outline-1 w-150
            bg-purple-900/80 hover:bg-purple-800/80 focus:bg-purple-800/80 focus:outline-gray-700/80 
            dark:bg-gray-900/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80 dark:focus:outline-zinc-700/80 ${className}`}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            />
    )
}