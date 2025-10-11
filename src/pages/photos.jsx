import { useEffect, useState } from "react";
import Input from "../components/photos/input";
import PhotosSelectView from "../components/photos/photosSelectView";
import PhotosSelectSort from "../components/photos/photosSelectSort";
import { MdAddAPhoto } from "react-icons/md";

export default function Photos(){
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/photos`, {
                credentials: 'include',
            });

            if (!res.ok) {
                console.error('Failed to fetch photos:', res.status);
                return;
            }

            const data = await res.json();
            setPhotos(data);
            } catch (err) {
            console.error('Error fetching photos:', err);
            }
        };

        fetchPhotos();
    }, []);


    return(
        <div className="m-2">
            <div className="h-10 p-3 rounded-lg m-2 justify-between items-center flex bg-fuchsia-900/30 dark:bg-slate-800/40">
                <div className="m-2 p-1 flex-3/3">
                    <Input/>
                </div>
                <div className="m-2 p-1 flex-1/3">
                    <PhotosSelectSort/>
                </div>
                <div className="m-2 p-1 flex-1/3">
                    <PhotosSelectView/>
                </div>
                <div className="m-2 p-1">
                    <MdAddAPhoto className="size-8"/>
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