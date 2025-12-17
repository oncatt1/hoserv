export const PhotoDetailsHeader = () => {
    return (
        <div className="flex items-center justify-between w-full p-4 mt-2 text-gray-500 border-b border-gray-600 text-sm bg-slate-700/50 rounded-xl">
            <div className="flex-grow flex justify-between items-center min-w-0">
                <span className="pr-4 flex-15/24 border-r-gray-600/40 border-r-2 mr-5">
                    Tytuł
                </span>
                <span className="flex-shrink-0 flex-3/24 border-r-gray-600/40 border-r-2 mr-5">
                    Data utworzenia
                </span>
                <span className="flex-shrink-0 flex-3/24 border-r-gray-600/40 border-r-2 mr-5">
                    Typ
                </span>
                <span className="ml-4 flex-shrink-0 flex-3/24 border-r-gray-600/40 border-r-2 mr-5">
                    Size
                </span>
            </div>
        </div>
    );
};