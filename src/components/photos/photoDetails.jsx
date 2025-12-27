import { MdClose, MdDelete, MdInfo } from "react-icons/md";
import { useFormattedSize } from "../../hooks/calculateSize";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function PhotoDetails({ selectedPhoto, closeLightBox}) {
    const photoData = selectedPhoto.activePhoto || {};
    const formattedSize = useFormattedSize(photoData.size || 0);
    const formattedDate = photoData.date.replace("T", " ");

    const [ showInfo, setShowInfo ] = useState(false);
    const [ imgSize, setImgSize ] = useState("w-4xl");
    const openInfoBox = () => { 
        setShowInfo(!showInfo);
        if(!showInfo) setImgSize("w-4xl");
        else setImgSize("w-5xl");
    };
    const deletePhoto = () => {
        // add
    }
    var isVideo;
    console.log(photoData)
    if(photoData.type.includes('video')) isVideo = true; 
    const content = (
        <div 
            className=" fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-s p-4"
            onClick={closeLightBox}>
            <div 
                className="relative w-5x  flex flex-col items-center bg-slate-900/40 rounded-2xl pb-3 m-6"
                onClick={(e) => e.stopPropagation()}>
                
                {isVideo ? 
            
                    <video
                        src={selectedPhoto.src} 
                        alt={selectedPhoto.name} 
                        className={`relative w-full max-h-[140vh] flex flex-col items-center bg-slate-900/40 rounded-2xl pb-3 ${imgSize}`}
                        controls
                        playsInline
                        />
                    :
                <img 
                        src={selectedPhoto.src} 
                        alt={selectedPhoto.name} 
                        className={`object-contain ${imgSize}`}/>
            }
                <div className="flex flex-row w-full max-w-5xl min-w-80 mt-3 px-12 sm:px-16 md:px-20">
                    <div className="flex-4/6">
                        <button 
                            onClick={closeLightBox}
                            className="text-gray-600 hover:text-gray-700 transition-colors">
                            <MdClose size={40} /> {/*close photo */}
                        </button>
                        <button 
                            onClick={openInfoBox}
                            className="text-blue-300 hover:text-blue-400 transition-colors">
                            <MdInfo size={40} /> {/* info about photo */}
                        </button>
                    </div>
                    <div className="flex-2/6 text-right">
                        <button 
                            onClick={deletePhoto}
                            className="text-red-800 hover:text-red-900 transition-colors">
                            <MdDelete size={40} /> {/* delete photo */}
                        </button>
                    </div>
                </div>
                <div 
                    className="flex flex-col w-full max-w-5xl min-w-80 mt-3 px-12 sm:px-16 md:px-20"> 
                        
                    <div className="flex justify-between items-center text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full">
                        <span className="text-purple-300">Nazwa:</span>
                        <span>{photoData.name}</span>
                    </div>

                    {showInfo && (
                        <>
                            <div className="flex justify-between items-center text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full mt-2">
                                <span className="text-purple-300">Data:</span>
                                <span>{formattedDate}</span>
                            </div>

                            <div className="flex justify-between items-center text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full mt-2">
                                <span className="text-purple-300">Rozmiar:</span>
                                <span>{formattedSize}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
    return createPortal(content, document.body);
}