export default function PhotosSelectSort(){
    return(
        <select name="sort" className=" text-white rounded-lg px-2 p-1.5 focus:outline-1
            hover:bg-purple-800/80 bg-purple-900/80 focus:bg-purple-800/80 focus:outline-gray-700/80 
            dark:bg-gray-900/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80 dark:focus:outline-zinc-700/80">
            <optgroup>
                <option value="0">Tytuł</option>
                <option value="1">Rozmiar</option>
                <option value="2">Data utworzenia</option>
                <option value="3">Data dodania</option>
                <option value="4">Typ</option>
            </optgroup>
            <optgroup>
                <option value="0">Malejąco</option>
                <option value="1">Rosnąco</option>
            </optgroup>
        </select>
    )
}