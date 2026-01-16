import { MdClose, MdDelete, MdInfo, MdDownload, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useFormattedSize } from "../../hooks/calculateSize";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ErrorPopout } from "../common/ErrorPopout";
import ConfirmModal from "../common/ConfirmModal";

export default function PhotoDetails({ selectedPhoto, closeLightBox, onNextPhoto, onPrevPhoto, currentDb}) {
    const photoData = selectedPhoto.activePhoto || {};
    const formattedSize = useFormattedSize(photoData.size || 0);
    const formattedDate = photoData.date ? photoData.date.replace("T", " ") : "";

    const [ showInfo, setShowInfo ] = useState(false);
    const [ error, setError ] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const openInfoBox = () => setShowInfo(!showInfo);
    
    const downloadPhoto = async () => {
        try {
            const response = await fetch(selectedPhoto.src);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = selectedPhoto.name || 'photo';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };
    
    const deletePhoto = async () => {
        setIsConfirmOpen(false);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/deletePhoto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': localStorage.getItem('csrfToken')
                },
                credentials: 'include',
                body: JSON.stringify({
                    fileName: photoData.name,
                    dbName: currentDb || "photos_general"
                })
            });

            const data = await response.json();

            if (response.ok) {
                closeLightBox(); 
                window.location.reload();
            } else {
                setError(data.error || "Wystąpił błąd podczas usuwania.");
            }
        } catch (error) {
            setError("Błąd połączenia z serwerem.");
        }
    };

    var isVideo;
    if(photoData.type.includes('video')) isVideo = true; 
    const content = (
        <div 
            className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
            onClick={closeLightBox}>
            {error && <ErrorPopout error={error} />}

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Potwierdź usunięcie"
                message={`Czy na pewno chcesz bezpowrotnie usunąć plik ${photoData.name}?`}
                onConfirm={deletePhoto}
                onCancel={() => setIsConfirmOpen(false)}
            />

            {/* Photo Display - Takes remaining space */}
            <div 
                className="grow flex justify-center items-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
                {isVideo ? 
                    <video
                        src={selectedPhoto.src} 
                        alt={selectedPhoto.name} 
                        className="w-full h-auto max-h-full object-contain"
                        controls
                        playsInline
                        />
                    :
                    <img 
                        src={selectedPhoto.src} 
                        alt={selectedPhoto.name} 
                        className="w-full h-auto max-h-full object-contain"/>
                }
            </div>

            {/* Docked Bottom Controls */}
            <div 
                className="shrink-0 bg-black/70 backdrop-blur border-t border-slate-700/50 p-4"
                onClick={(e) => e.stopPropagation()}>
                
                {/* Navigation and Action Buttons */}
                <div className="flex flex-row w-full justify-between items-center gap-2 mb-3">
                    <button 
                        onClick={onPrevPhoto}
                        className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-slate-700/50 rounded"
                        title="Previous photo">
                        <MdNavigateBefore size={40} />
                    </button>
                    
                    <div className="flex flex-row gap-3 grow justify-center flex-wrap">
                        <button 
                            onClick={closeLightBox}
                            className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-slate-700/50 rounded" title="Zamknij">
                            <MdClose size={32} />
                        </button>
                        <button 
                            onClick={openInfoBox}
                            className="text-blue-300 hover:text-blue-400 transition-colors p-2 hover:bg-slate-700/50 rounded" title="Informacje">
                            <MdInfo size={32} />
                        </button>
                        <button 
                            onClick={downloadPhoto}
                            className="text-green-300 hover:text-green-400 transition-colors p-2 hover:bg-slate-700/50 rounded" title="Zgraj">
                            <MdDownload size={32} />
                        </button>
                        <button 
                            onClick={() => setIsConfirmOpen(true)}
                            className="text-red-400 hover:text-red-500 transition-colors p-2 hover:bg-slate-700/50 rounded" title="Usuń">
                            <MdDelete size={32} />
                        </button>
                    </div>
                    
                    <button 
                        onClick={onNextPhoto}
                        className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-slate-700/50 rounded"
                        title="Następne zdjęcie">
                        <MdNavigateNext size={40} />
                    </button>
                </div>

                {/* Info Section */}
                <div className="flex flex-col w-full px-2">
                    <div className="flex justify-between items-center text-white text-sm md:text-base font-semibold bg-black/50 px-3 py-2 rounded-full">
                        <span className="text-purple-300 shrink-0">Nazwa:</span>
                        <span className="truncate ml-2 text-right">{photoData.name}</span>
                    </div>

                    {showInfo && (
                        <>
                            <div className="flex justify-between items-center text-white text-sm md:text-base font-semibold bg-black/50 px-3 py-2 rounded-full mt-2">
                                <span className="text-purple-300 shrink-0">Data:</span>
                                <span className="text-right ml-2">{formattedDate}</span>
                            </div>

                            <div className="flex justify-between items-center text-white text-sm md:text-base font-semibold bg-black/50 px-3 py-2 rounded-full mt-2">
                                <span className="text-purple-300 shrink-0">Rozmiar:</span>
                                <span className="text-right ml-2">{formattedSize}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
    return createPortal(content, document.body);
}