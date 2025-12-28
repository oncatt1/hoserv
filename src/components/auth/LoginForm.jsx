import { useState } from "react";
import { FormInput } from "../common/FormInput";
import { FormButton } from "../common/FormButton";

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
                type="text"
                name="login"
                value={credentials.login}
                loading={loading}
                onChange={handleChange}
            />
            <FormInput
                label="Hasło"
                type="password"
                name="password"
                value={credentials.password}
                loading={loading}
                onChange={handleChange}
            />
            <FormButton 
                loading={loading}
                text="Zaloguj się"
                loadingText="Logowanie..."
            />
        </form>
    );
};