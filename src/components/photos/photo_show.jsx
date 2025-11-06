export const PhotoShow = ({ key, src, label, onclick = "", className = ""}) =>
{
    return(
        <div key={key} className="flex flex-col  items-center p-15 m-2 w-30 h-30
                shadow-2xl bg-purple-900/20 dark:bg-slate-800/20 rounded-md">
                <div>
                    <img 
                    src={src} 
                    onClick={onclick}
                    className={` ${className}`}/>
                </div>
                <div className="">
                    <span className="font-semibold text-[17px] bottom-32">{label}</span>
                </div> 
        </div>
    )
}