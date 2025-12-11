import { act, useEffect, useMemo, useState } from "react";
import { MdAddAPhoto, MdClose } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import { PhotoShow } from "../components/photos/photoShow";
import PhotoDetails from "../components/photos/photoDetails";
import { useFetchPost } from "../hooks/useFetchPost";
import Loading from "../components/loading";
import { ErrorPopout } from "../components/common/ErrorPopout";
import CustomSelect from "../components/common/CustomSelect";
import FormInput from "../components/common/FormInput";
import { useDebounce } from "../hooks/useDebounce";

export default function Photos(){
    // --- State and Handlers ---
    const [inputValue, setInputValue] = useState('');
    const [type, setType] = useState('0');
    const [order, setOrder] = useState('0');
    const [size, setSize] = useState('0');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    
    const debouncedSearchTerm = useDebounce(inputValue, 1000);

    const handleInputChange = (e) => setInputValue(e.target.value);
    const handleSortChange = (e) => setType(e.target.value);
    const handleOrderChange = (e) => setOrder(e.target.value);
    const handleSizeChange = (e) => setSize(e.target.value);
    
    // --- URL and API Setup ---
    const [searchParams] = useSearchParams();
    const currentFolder = searchParams.get("folder") || "";
    const currentDb = searchParams.get("db") || "photos_general";

    const searchUrl = `${import.meta.env.VITE_API_URL}/search`;
    const generalUrl = `${import.meta.env.VITE_API_URL}/photos`;

    // 1. Logic for Search Fetch (Only runs if search term exists)
    const searchOptions = useMemo(() => {
        // Only return options if we have a debounced search term
        return debouncedSearchTerm 
            ? { folder: currentFolder, db: currentDb, search: debouncedSearchTerm }
            : null;
    }, [currentDb, currentFolder, debouncedSearchTerm]);

    // Use a different endpoint/logic for searching
    const { 
        data: searchData, 
        loading: searchLoading, 
        error: searchError 
    } = useFetchPost(searchUrl, searchOptions);


    // 2. Logic for General Fetch (Only runs if NO search term exists)
    const generalOptions = useMemo(() => {
        // Only return options if there is NO debounced search term
        return !debouncedSearchTerm
            ? { folder: currentFolder, db: currentDb } 
            : null;
    }, [currentDb, currentFolder, debouncedSearchTerm]);

    // Use the general endpoint/logic for displaying the folder contents
    const { 
        data: generalData, 
        loading: generalLoading, 
        error: generalError 
    } = useFetchPost(generalUrl, generalOptions);


    // 3. Determine Final Data and Status based on search status
    let photos, loading, error;
    
    if (debouncedSearchTerm) {
        // If searching, use search results and status
        photos = searchData;
        loading = searchLoading;
        error = searchError;
    } else {
        // If not searching, use general folder contents and status
        photos = generalData;
        loading = generalLoading;
        error = generalError;
    }
    
    const finalPhotos = photos || [];
            
    if (loading) return <Loading />;
    <ErrorPopout error={error} />

    const onPhotoClick = (src, name) => {
        const activePhoto = fetchedPhotos.find(p => p.name === name);
        setSelectedPhoto({ src, name, activePhoto});
    };

    const closeLightBox = () => {
        setSelectedPhoto(null);
    };
    const optionsType = [
        { value: "0", label: "Tytuł" },
        { value: "1", label: "Rozmiar" },
        { value: "2", label: "Data utworzenia" },
        { value: "3", label: "Data dodania" },
        { value: "4", label: "Typ" }
    ];
    const optionsOrder = [
        { value: "0", label: "Malejąco" },
        { value: "1", label: "Rosnąco" },
    ];
    const optionsSize = [
        { value: "0", label: "Średnie ikony" },
        { value: "1", label: "Duże ikony" },
        { value: "2", label: "Szczegóły" },
    ]

    return(
        <div className="m-2">
            <div className="h-10 p-8 rounded-lg m-2 justify-between items-center flex bg-fuchsia-900/30 dark:bg-slate-700/60">
                <div className="m-2 p-1 flex-5/6">
                    <FormInput
                        type="text" 
                        name="search" 
                        placeholder="Wyszukaj zdjęcia" 
                        onChange={handleInputChange} 
                        value={inputValue} 
                        className="w-170" 
                    />
                </div>
                <div className="m-2 p-1 flex-1/6"> {/* type select */}
                    <CustomSelect 
                        name="type" 
                        value={type}
                        onChange={handleSortChange}
                        options = {optionsType}
                    />
                </div>
                <div className="m-2 p-1 flex-1/6"> {/* order select */}
                    <CustomSelect 
                        name="order"  
                        value={order}
                        onChange={handleOrderChange}
                        options={optionsOrder}
                    />
                </div>
                <div className="m-2 p-1 flex-1/6"> {/* view size select*/}
                    <CustomSelect 
                        name="view" 
                        value={size}
                        onChange={handleSizeChange}
                        options={optionsSize}
                    />
                </div>
                <div className="m-2 p-1">
                    <Link to="/add"><MdAddAPhoto className="size-8"/></Link>
                </div>
            </div>
            <div>
                {photos?.map(photo => {
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