export default function Admin(){
    return(
        <div className="p-8">
            <div className="p-2 m-3 flex w-2/3 border-b-2 border-violet-700/20 dark:border-zinc-700/20 mb-10">
                <div className="flex-2/3 text-2xl">
                    Panel administratora
                </div>
            </div>
            <div className="bg-purple-800/20 dark:bg-gray-800/20 p-6 rounded-t-2xl">
                <span className="text-xl border-b-2 border-violet-600/20 dark:border-zinc-600/20">Informacje</span>
                <div>
                    <div className="indent-3">Wykorzystanie dysków: </div>
                </div>
            </div>
            <div className="bg-purple-800/20 dark:bg-gray-800/20 p-6">
                <span className="text-xl border-b-2 border-violet-600/20 dark:border-zinc-600/20">Połączenia</span>
                <div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer">Połącz SSH z serwerem</span></div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer">Połącz z PHPmyAdmin</span></div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer">Wyświetl logi</span></div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer">Zrestartuj serwer</span></div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer">Zamknij serwer</span></div>
                </div>
            </div>
            <div className="bg-purple-800/20 dark:bg-gray-800/20 p-6 rounded-b-2xl  ">
                <span className="text-xl border-b-2 border-violet-600/20 dark:border-zinc-600/20">Ustawienia</span>
                <div>

                </div>
            </div>
        </div>
    )
}