export default function PhotosSelectView(){
    return(
        <select name="view" className="text-white rounded-lg px-2 p-1.5 focus:outline-1
            hover:bg-purple-800/80 bg-purple-900/80 focus:bg-purple-800/80 focus:outline-gray-700/80 
            dark:bg-gray-900/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80 dark:focus:outline-zinc-700/80">
                <option value="0">Średnie ikony</option>
                <option value="1">Duże ikony</option>
                <option value="2">Szczegóły</option>
        </select>
    )
}