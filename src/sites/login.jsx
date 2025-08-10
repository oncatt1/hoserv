import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/auth";

export default function Login(){
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://192.168.8.175:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ login, password })
            });
            if (res.ok){
                await fetchData();
                navigate("/photos");

            } else {
                const err = await res.json();
                console.error("Login failed: ", err);
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };
    const fetchData = async () => {
        const user = await getUser();
    };

    return(
        <div className="flex flex-col justify-center items-center p-20">
            <div className="justify-center items-center flex-col flex m-8 p-15 w-100 
            shadow-2xl bg-purple-900/20 rounded-md">
                <form onSubmit={handleSubmit} method="post" className="justify-center items-center flex-col flex">
                    <span className="font-semibold text-[17px] pb-1">Login</span> 
                    <input type="text" name="login" value={login}
                        onChange={e => setLogin(e.target.value)}
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-lg 
                        focus:outline-1 focus:bg-gray-800 focus:outline-gray-700 w-60"/>

                    <span className="font-semibold text-[17px] pb-1 pt-4">Hasło</span> 
                    <input type="password" name="password" value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-lg 
                        focus:outline-1 focus:bg-gray-800 focus:outline-gray-700 w-60"/>
        
                    <button type="submit" className="rounded-2xl cursor-pointer mt-10
                        bg-purple-900/20 min-h-2 w-50 hover:bg-purple-950/40
                        text-white p-4 shadow-2xl ">Zaloguj się</button>
                </form>
                <a  className="rounded-full cursor-pointer h-2 w-50 transform scale-70 text-center
                text-white p-4 text-shadow-sm" href="https://bit.ly/omatkodochodze">Stwórz konto</a>
            
            </div>
        </div>
    )
}