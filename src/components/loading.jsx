export default function Loading(){
    return(
        <div className="flex flex-col justify-center items-center p-20 opacity-0 animate-fadeInLong">
            <div className="flex flex-col justify-center items-center p-10 shadow-2xl rounded-2xl">
                <span className="text-4xl p-2">Ładowanie zawartości strony</span>
                <span className="text-2xl">Proszę poczekać</span>
            </div>
        </div>
    )
}