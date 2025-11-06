export default function Unauthorized(){
    return(
        <div className="flex flex-col justify-center items-center p-20">
            <div className="flex flex-col justify-center items-center p-10 shadow-2xl rounded-2xl">
                <span className="text-4xl p-2">Błąd 401</span>
                <span className="text-2xl">Brak dostępu</span>
            </div>
        </div>
    )
}