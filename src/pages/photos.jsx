import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PhotoShow } from "../components/photos/photoShow";
import PhotoDetails from "../components/photos/photoDetails";
import { useFetchPost } from "../hooks/useFetchPost";
import Loading from "../components/loading";
import { ErrorPopout } from "../components/common/ErrorPopout";
import { useDebounce } from "../hooks/useDebounce";
import PhotoSelectBar from "../components/photos/photoSelectBar";
import { PhotoDetailsHeader } from "../components/photos/photoDetailsHeader";
export default function Photos(){
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const [searchParams] = useSearchParams();
    const currentFolder = searchParams.get("folder") || "";
    const currentDb = searchParams.get("db") || "photos_general";

    const searchUrl = `${import.meta.env.VITE_API_URL}/search`;
    const generalUrl = `${import.meta.env.VITE_API_URL}/photos`;

    // We'll use a state for inputValue that gets managed by PhotoSelectBar
    const [inputValue, setInputValue] = useState('');
    const debouncedSearchTerm = useDebounce(inputValue || '', 1000);

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
            
    const onPhotoClick = (src, name) => {
        const activePhoto = finalPhotos.find(p => p.name === name);
        setSelectedPhoto({ src, name, activePhoto});
    };

    const closeLightBox = () => {
        setSelectedPhoto(null);
    };
    
    const onNextPhoto = () => {
        if (!selectedPhoto) return;
        const currentIndex = sortedPhotos.findIndex(p => p.name === selectedPhoto.name);
        if (currentIndex < sortedPhotos.length - 1) {
            const nextPhoto = sortedPhotos[currentIndex + 1];
            const src = `${import.meta.env.VITE_PHOTO_URL}/photos/${nextPhoto.user_id}/${nextPhoto.folder}/${nextPhoto.name}`;
            onPhotoClick(src, nextPhoto.name);
        }
    };
    
    const onPrevPhoto = () => {
        if (!selectedPhoto) return;
        const currentIndex = sortedPhotos.findIndex(p => p.name === selectedPhoto.name);
        if (currentIndex > 0) {
            const prevPhoto = sortedPhotos[currentIndex - 1];
            const src = `${import.meta.env.VITE_PHOTO_URL}/photos/${prevPhoto.user_id}/${prevPhoto.folder}/${prevPhoto.name}`;
            onPhotoClick(src, prevPhoto.name);
        }
    };

    // Now call PhotoSelectBar with the final photos data
    const { barJsx, sortedPhotos, size } = PhotoSelectBar({ finalPhotos, inputValue, setInputValue});
    if (loading) return <Loading />;
    <ErrorPopout error={error} />

    const getPhotoClass = (sizeValue) => {
        switch (sizeValue) {
            case "0": // medium: 5 columns
                return {
                    photo: "w-52",
                    grid: "grid grid-cols-5 gap-4",
                    detailed: false
                };
            case "1": // big: 3 columns
                return {
                    photo: "w-80",
                    grid: "grid grid-cols-3 gap-6",
                    detailed: false
                };
            case "2": // detailed
                return {
                    photo: "w-full flex-row items-center justify-between",
                    grid: "flex flex-col space-y-2",
                    detailed: true
                };
            default:
                return {
                    photo: "w-52",
                    grid: "grid grid-cols-5 gap-4",
                    detailed: false
                };
        }
    };
    const { photo: photoClass, grid: gridClass, detailed: gridDetailed } = getPhotoClass(size);
    
    return(
        <div className="m-5 opacity-0 animate-fadeIn">
            <div className="sticky bg-slate-800 p-2 rounded-2xl top-5 z-50">
                { barJsx }
                {gridDetailed && <PhotoDetailsHeader />}
            </div>
            <div className={gridClass}>
                {sortedPhotos?.map(photo => {
                    const src = `${import.meta.env.VITE_PHOTO_URL}/photos/${photo.user_id}/${photo.folder}/${photo.name}`;
                
                    return (
                        <PhotoShow
                        key={photo.id}
                        src={src}
                        alt="Brak zdjęcia"
                        className={photoClass}
                        photo={photo}
                        onClick={() => onPhotoClick(src, photo.name)}
                        detailed={gridDetailed}
                        />
                    );
                })}
            </div>
            {selectedPhoto && (<PhotoDetails 
                    selectedPhoto={selectedPhoto} 
                    closeLightBox={closeLightBox}
                    onNextPhoto={onNextPhoto}
                    onPrevPhoto={onPrevPhoto}
                />)}
        </div>
    )
}