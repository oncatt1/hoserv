import { useState } from "react";
import { FormInput } from "../common/FormInput";

export const LoginForm = ({ onSubmit, loading, error}) => {
    const [ credentials, setCredentials] = useState({
        login: '',
        password: ''
    });

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(credentials);
    }

    return(
        <form onSubmit={handleSubmit} method="post" className="justify-center items-center flex-col flex">
            <FormInput  
                label="Login"
                name="login"
                value={credentials.login}
                onchange={handleChange}
            />
            <FormInput
                label="Hasło"
                type="password"
                name="password"
                value={credentials.password}
                onchange={handleChange}
            />
            <button type="submit" 
                disabled={loading}
                className="rounded-2xl cursor-pointer mt-10
                        bg-purple-900/20 min-h-2 w-50 hover:bg-purple-950/40
                        dark:bg-gray-900/20 dark:hover:bg-gray-800/20
                        text-white p-4 shadow-2xl">
                {loading ? "Logowanie..." : "Zaloguj się"}
            </button>
        </form>
    );
};