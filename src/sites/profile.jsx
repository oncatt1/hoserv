import { useNavigate } from "react-router-dom";

import { getUser } from "../../utils/auth";
export default function Profile(){
    const navigate = useNavigate();

    const LogoutUser = async () => {
        const res = await fetch('https://192.168.8.175:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        if (res.ok){
            await fetchData();
            navigate("/");
        }
    }
    
    const fetchData = async () => {
        const user = await getUser();
    };
    return(
        <div className="p-8">
            <div className="p-2 m-3 flex w-2/3 border-b-2 border-violet-700/20 mb-10">
                <div className=" flex-2/3  text-2xl ">
                    [nazwa profilu]
                </div>
                <div onClick={LogoutUser} className="cursor-pointer flex-1/3 text-right text-sm flex flex-col justify-end">
                    Wyloguj się
                </div>
            </div>
            <div className="bg-purple-800/20 p-6 rounded-t-2xl ">
                <span className="text-xl border-b-2 border-violet-600/20">Informacje</span>
                <div className="">
                    <div className="indent-3">Dostęp do: [nazwy tablic]</div><br />
                    <div className="indent-3">Ilość dostępnych zdjęć: </div><br />
                    <div className="indent-3">Wykorzystanie dysków: </div>
                </div>
            </div>
            <div className="bg-purple-800/20 p-6 rounded-b-2xl  ">
                <span className="text-xl border-b-2 border-violet-600/20">Ustawienia</span>
                <div className="">
                    <div className="indent-3">Zmień język:</div><br />
                    <div className="indent-3">Sendfeetback: </div><br />
                    <div className="indent-3">Zmień wygląd: </div><br />
                    <div className="indent-3">Zmień hasło:</div><br />
                    <div className="indent-3">Usuń konto:</div><br />
                    <div className="indent-3">Usuń zdjęcia:</div>
                </div>
            </div>
        </div>
    )
}