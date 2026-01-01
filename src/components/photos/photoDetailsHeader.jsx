export const PhotoDetailsHeader = () => {
    return (
        <div className="flex items-center justify-between w-full p-4 mt-2 text-gray-500 border-b border-gray-600 text-sm bg-slate-700/20 rounded-xl">
            <div className="grow flex justify-between items-center min-w-0">
                <span className="pr-4 basis-[62.5%] shrink-0 border-r-gray-600/40 border-r-2 mr-5 truncate">Tytuł</span>
                <span className="basis-[12.5%] shrink-0 border-r-gray-600/40 border-r-2 mr-5 text-center">Data</span>
                <span className="basis-[12.5%] shrink-0 border-r-gray-600/40 border-r-2 mr-5 text-center">Typ</span>
                <span className="basis-[12.5%] shrink-0 text-center">Size</span>
            </div>
        </div>
    );
};