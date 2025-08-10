import { useEffect, useState } from "react";

export default function Photos(){
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
    fetch('https://192.168.8.175:3000/api/photos')
      .then(res => res.json())
      .then(data => setPhotos(data));
    }, []);

    return(
        <div className="m-2">
            <div className="h-10 p-3 rounded-lg bg-fuchsia-900/30 m-2 justify-between items-center flex">
                <div className="m-2 p-1 border-r-2 border-purple-800/20">
                    <input type="text" name="search" 
                    className="bg-purple-900/80 text-white hover:bg-purple-800/80 rounded-lg px-2 p-1
                    focus:outline-1 focus:bg-purple-800/80 focus:outline-gray-700/80 w-80" 
                    placeholder="Wyszukaj zdjęcia"/>
                </div>
                <div className="m-2 p-1 border-r-2 border-purple-800/20">
                    <select name="sort" className="bg-purple-900/80 text-white hover:bg-purple-800/80 rounded-lg px-2 p-1.5
                    focus:outline-1 focus:bg-purple-800/80 focus:outline-gray-700/80 ">
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
                </div>
                <div className="m-2 p-1 border-r-2 border-purple-800/20">
                    <select name="view" className="bg-purple-900/80 text-white hover:bg-purple-800/80 rounded-lg px-2 p-1.5 
                    focus:outline-1 focus:bg-purple-800/80 focus:outline-gray-700/80">
                        <option value="0">Średnie ikony</option>
                        <option value="1">Duże ikony</option>
                        <option value="2">Szczegóły</option>
                    </select>
                </div>
                <div className="m-2 p-1 ">
                    Dodaj zdjęcia
                </div>
            </div>
            <div>
                
                {photos.map(photo => (
                    <div key={photo.id}>
                        <img src={photo.filename} alt={photo.photoname} />
                        <div>       
                            {photo.photoname}
                        </div>
                    </div>
                ))}
                {/* <img src="hoserv_photos\wioso.webp" alt="" />
                <img src="hoserv_photos\wioso.webp" alt="" />
                <img src="hoserv_photos\wioso.webp" alt="" />
                <img src="hoserv_photos\wioso.webp" alt="" />
                <img src="hoserv_photos\wioso.webp" alt="" />
                <img src="hoserv_photos\wioso.webp" alt="" />
                <img src="hoserv_photos\wioso.webp" alt="" />
                <img src="hoserv_photos\wioso.webp" alt="" />
                <img src="hoserv_photos\wioso.webp" alt="" /> */}
            </div>
        </div>
    )
}