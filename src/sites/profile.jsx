import Sidebar from "../components/sidebar";

export default function Profile(){
    return(
        <div className="p-8">
            <div className="p-2 m-3 flex w-2/3 border-b-2 border-violet-700/20 mb-10">
                <div className=" flex-2/3  text-2xl ">
                    [nazwa profilu]
                </div>
                <div className="flex-1/3 text-right text-sm flex flex-col justify-end">
                    Wyloguj się
                </div>
            </div>
            
            <div className="bg-purple-800/20 p-3 rounded-2xl h-30 ">
                <span className="text-xl ">Ustawienia</span>
                <div className="indent-3">
                    Zmień wygląd: 

                </div>
            </div>
        </div>
    )
}