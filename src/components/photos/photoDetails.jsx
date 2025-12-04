import { MdClose } from "react-icons/md";
import { useFormattedSize } from "../../hooks/calculateSize";

export default function PhotoDetails({ selectedPhoto, closeLightBox}) {
    const photoData = selectedPhoto.activePhoto || {};
    const formattedSize = useFormattedSize(photoData.size || 0);
    console.log(selectedPhoto);
    return(
        <div 
            className=" fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-s, p-4"
            onClick={closeLightBox}>
            <div 
                className="relative max-w-5xl w-full max-h-screen flex flex-col items-center bg-slate-900/40 rounded-2xl pb-3"
                onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={closeLightBox}
                    className="absolute top-10 z-80 -right-20 text-white hover:text-red-500 transition-colors">
                    <MdClose size={40} />
                </button>
                
                <img 
                    src={selectedPhoto.src} 
                    alt={selectedPhoto.name} 
                    className=" relative w-full max-w-8xl max-h-[120vh] flex flex-col items-center bg-slate-900/40 rounded-2xl pb-3"/>

                <div 
                    className="flex flex-col w-full max-w-5xl min-w-80 mt-6 px-12 sm:px-16 md:px-20"> 

                    <div className="flex justify-between items-center text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full">
                        <span className="text-purple-300">Nazwa:</span>
                        <span>{photoData.name}</span>
                    </div>

                    <div className="flex justify-between items-center text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full mt-2">
                        <span className="text-purple-300">Data:</span>
                        <span>{photoData.date}</span>
                    </div>

                    <div className="flex justify-between items-center text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full mt-2">
                        <span className="text-purple-300">Rozmiar:</span>
                        <span>{formattedSize}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}