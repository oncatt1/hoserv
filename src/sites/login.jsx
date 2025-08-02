import { useEffect } from "react";

export default function Login(){
    useEffect(() => {
        fetch('http://192.168.8.175:3000/api/photos')
          .then(res => res.json())
          .then(data => setPhotos(data));
    }, []);

    return(
        <div className="flex flex-col justify-center items-center p-20">
            <div className="justify-center items-center flex-col flex m-8 p-15 w-100 
            shadow-2xl bg-purple-900/20 rounded-md">
                <form action="" method="post"></form>
                <span className="font-semibold text-[17px] pb-1">Login</span> <input type="text" name="login" 
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-lg 
                focus:outline-1 focus:bg-gray-800 focus:outline-gray-700 w-60"/>

                <span className="font-semibold text-[17px] pb-1 pt-4">Hasło</span> <input type="password" name="password"  
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-lg 
                focus:outline-1 focus:bg-gray-800 focus:outline-gray-700 w-60"/>
    
                <button className="rounded-2xl cursor-pointer mt-10
                bg-purple-900/20 min-h-2 w-50 hover:bg-purple-950/40
                text-white p-4 shadow-2xl ">Zaloguj się</button>

                <a  className="rounded-full cursor-pointer h-2 w-50 transform scale-70 text-center
                text-white p-4 text-shadow-sm" href="https://bit.ly/omatkodochodze">Stwórz konto</a>
            </div>
        </div>
    )
}