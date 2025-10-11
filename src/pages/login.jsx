import { useLogin } from "../hooks/useLogin";
import { LoginForm } from "../components/auth/LoginForm";
import { AuthCard } from "../components/auth/AuthCard";
import { ErrorPopout } from "../components/common/ErrorPopout";

export default function Login(){
    const { login, loading, error } = useLogin();

    return(
        <AuthCard>
            <LoginForm
                onSubmit={login}
                loading={loading}
                error={error}
            />
            <ErrorPopout error={error} />
        </AuthCard>
    )
}