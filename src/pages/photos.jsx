import { act, useEffect, useMemo, useState } from "react";
import { Input }from "../components/photos/input";
import { MdAddAPhoto, MdClose } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import { PhotoShow } from "../components/photos/photoShow";
import { useFormattedSize } from "../hooks/calculateSize";
import PhotoDetails from "../components/photos/photoDetails";
import { useFetchPost } from "../hooks/useFetchPost";
import Loading from "../components/loading";
import { ErrorPopout } from "../components/common/ErrorPopout";

export default function Photos(){
    const [inputValue, setInputValue] = useState('');
    const [type, setType] = useState('0');
    const [order, setOrder] = useState('0');
    const [size, setSize] = useState('0');
    
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleInputChange = (e) => setInputValue(e.target.value);
    const handleSortChange = (e) => setType(e.target.value);
    const handleOrderChange = (e) => setOrder(e.target.value);
    const handleSizeChange = (e) => setSize(e.target.value);
    
    const url = `${import.meta.env.VITE_API_URL}/photos`;
    // napraw kurwa to bo perm problmes
    const [searchParams] = useSearchParams();
    const currentFolder = searchParams.get("folder") || "";
    const currentDb = searchParams.get("db") || "photos_general";

    const photoOptions = useMemo(() => ({ folder: currentFolder, db: currentDb}), [currentDb, currentFolder]);
    const { data: fetchedPhotos, loading, error } = useFetchPost(url, photoOptions);
    if (loading) return <Loading />;
    <ErrorPopout error={error} />

    const onPhotoClick = (src, name) => {
        const activePhoto = fetchedPhotos.find(p => p.name === name);
        setSelectedPhoto({ src, name, activePhoto});
    };

    const closeLightBox = () => {
        setSelectedPhoto(null);
    };
    return(
        <div className="m-2">
            <div className="h-10 p-6 rounded-lg m-2 justify-between items-center flex bg-fuchsia-900/30 dark:bg-slate-700/60">
                <div className="m-2 p-1 flex-5/6">
                    <Input type="text" name="search" placeholder="Wyszukaj zdjęcia" onChange={handleInputChange} value={inputValue} className="w-170" />
                </div>
                <div className="m-2 p-1 flex-1/6"> {/* type select */}
                    <select name="type" className=" text-white rounded-lg px-2 p-1.5 focus:outline-1
                        hover:bg-purple-800/80 bg-purple-900/80 focus:bg-purple-800/80 focus:outline-gray-700/80 
                        dark:bg-gray-900/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80 dark:focus:outline-zinc-700/80"
                        value={type}
                        onChange={handleSortChange}>
                            <option value="0">Tytuł</option>
                            <option value="1">Rozmiar</option>
                            <option value="2">Data utworzenia</option>
                            <option value="3">Data dodania</option>
                            <option value="4">Typ</option>
                    </select>
                </div>
                <div className="m-2 p-1 flex-1/6"> {/* order select */}
                    <select name="order" className=" text-white rounded-lg px-2 p-1.5 focus:outline-1
                        hover:bg-purple-800/80 bg-purple-900/80 focus:bg-purple-800/80 focus:outline-gray-700/80 
                        dark:bg-gray-900/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80 dark:focus:outline-zinc-700/80"   
                        value={order}
                        onChange={handleOrderChange}>
                            <option value="0">Malejąco</option>
                            <option value="1">Rosnąco</option>
                    </select>
                </div>
                <div className="m-2 p-1 flex-1/6"> {/* view size select*/}
                    <select name="view" className="text-white rounded-lg px-2 p-1.5 focus:outline-1
                        hover:bg-purple-800/80 bg-purple-900/80 focus:bg-purple-800/80 focus:outline-gray-700/80 
                        dark:bg-gray-900/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80 dark:focus:outline-zinc-700/80"
                        value={size}
                        onChange={handleSizeChange}>
                            <option value="0">Średnie ikony</option>
                            <option value="1">Duże ikony</option>
                            <option value="2">Szczegóły</option>
                    </select>
                </div>
                <div className="m-2 p-1">
                    <Link to="/add"><MdAddAPhoto className="size-8"/></Link>
                </div>
            </div>
            <div>
                {fetchedPhotos?.map(photo => {
                    const src = `http://192.168.1.10:3000/photos/${photo.user_id}/${photo.folder}/${photo.name}`;

                    return (
                        <PhotoShow
                        key={photo.id}
                        src={src}
                        alt="dupa"
                        className="w-52"
                        label={photo.name}
                        onClick={() => onPhotoClick(src, photo.name)}
                        />
                    );
                })}
            </div>
            {selectedPhoto && (<PhotoDetails 
                    selectedPhoto={selectedPhoto} 
                    closeLightBox={closeLightBox} 
                />)}
        </div>
    )
}