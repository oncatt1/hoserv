import { useLogin } from "../hooks/useLogin";
import { LoginForm } from "../components/auth/LoginForm";
import { Card } from "../components/card";
import { ErrorPopout } from "../components/common/ErrorPopout";

export default function Login(){
    const { login, loading, error } = useLogin();

    return(
        <Card>
            <LoginForm
                onSubmit={login}
                loading={loading}
                error={error}
            />
            <ErrorPopout error={error} />
        </Card>
    )
}