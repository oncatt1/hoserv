import { useLogin } from "../hooks/useLogin";
import { LoginForm } from "../components/auth/LoginForm";
import { AuthCard } from "../components/auth/AuthCard";

export default function Login(){
    const { login, loading, error } = useLogin();

    return(
        <AuthCard>
            <LoginForm
                onSubmit={login}
                loading={loading}
                error={error}
            />
        </AuthCard>
    )
}