import { MdPlayCircle } from "react-icons/md";
import { useFormattedSize } from "../../hooks/calculateSize";

export const PhotoShow = ({ 
    src, 
    alt = '', 
    photo = '', 
    onClick, 
    className = '', 
    detailed = false,
}) => {
    const formattedSize = useFormattedSize(photo.size || 0);
    const formattedDate = photo.date.replace("T", " ");
    var isVideo, videoBg;
    if(photo.type.includes('video')) {
        isVideo = true; 
        videoBg = "bg-slate-700/10!";
    }
    
    let containerClasses = `p-4 m-2 mr-4 shadow-2xl bg-slate-700/20 rounded-xl ${videoBg}`;

    if (detailed) {
        containerClasses += " flex items-center justify-between w-full cursor-pointer";
    } else {
        containerClasses += " flex flex-col items-center cursor-pointer";
    }
    return (
        <div
            className={containerClasses}
            onClick={typeof onClick === 'function' ? onClick : undefined}
            role={typeof onClick === 'function' ? 'button' : undefined}
        >
            {detailed ? (
                <>
                    <div className="flex-grow flex justify-between items-center min-w-0">
                        <span className="font-semibold text-[17px] truncate pr-4 flex-15/24 mr-5">
                            {photo.name}
                        </span>
                        <span className="text-sm text-gray-400 flex-shrink-0 flex-3/24 mr-">
                            {formattedDate || 'N/A'}
                        </span>
                        <span className="text-sm text-gray-400 ml-4 flex-shrink-0 flex-3/24 mr-5">
                            {photo.type || 'N/A'}
                        </span>
                        <span className="text-sm text-gray-400 ml-4 flex-shrink-0 flex-3/24 mr-5">
                            {formattedSize || 'N/A'}
                        </span>
                    </div>
                </>

            ) : (
                <>
                   <div className={`flex-grow flex items-center justify-center w-full h-32 ${videoBg}`}> 
                     {isVideo ? 
                        <>
                            <video
                                src={src} 
                                alt={alt} 
                                className="block w-full h-full object-cover rounded-lg"
                                type="video/mp4"
                                muted
                                playsInline
                            />
                            <div className="z-30 fixed text-gray-900/80 scale-300"><MdPlayCircle/></div>
                        </>
                    :
                        <img 
                            src={src} 
                            alt={alt} 
                            className="block w-full h-full object-cover rounded-lg" 
                        />
                     }
                    </div>

                    <div className="w-full text-center mt-2 px-1 flex-shrink-0"> 
                        <span className="font-semibold text-[17px] truncate block">
                            {photo.name}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};