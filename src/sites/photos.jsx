import { useEffect, useState } from "react";

export default function Photos(){
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
    fetch('http://192.168.8.175:3000/api/photos')
      .then(res => res.json())
      .then(data => setPhotos(data));
    }, []);

    return(
        <div className="m-2">
            <div className="h-10 p-3 border-[2px] rounded-lg border-fuchsia-900 m-2 justify-between items-center flex">
                <div className="m-2 p-1 border-r-2 border-purple-800/20">
                    <input type="text" name="search" 
                    className="bg-gray-900/80 text-white hover:bg-gray-800/80 rounded-lg px-2
                    focus:outline-1 focus:bg-gray-800/80 focus:outline-gray-700/80 w-80" 
                    placeholder="Wyszukaj zdjęcia"/>
                </div>
                <div className="m-2 p-1 border-r-2 border-purple-800/20">
                    <select name="sort">
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
                    <select name="view">
                        <option value="0">Średnie ikony</option>
                        <option value="1">Duże ikony</option>
                        <option value="2">Szczegóły</option>
                    </select>
                </div>
                <div className="m-2 p-1 border-r-2 border-purple-800/20">
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