export const PhotoShow = ({ id, src, alt = '', label = '', onClick, className = '' }) => {
    return (
        <div
            className="flex flex-col items-center p-4 m-2 shadow-2xl bg-purple-900/20 dark:bg-slate-800/20 rounded-md"
            onClick={typeof onClick === 'function' ? onClick : undefined}
            role={typeof onClick === 'function' ? 'button' : undefined}
        >
            <div>
                <img src={src} alt={alt} className={`block ${className} object-contain`} />
            </div>
            <div>
                <span className="font-semibold text-[17px]">{label}</span>
            </div>
        </div>
    );
};