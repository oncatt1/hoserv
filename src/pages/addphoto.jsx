import { Card } from "../components/card";
import { AddForm } from "../components/photosadd/AddForm";
import { ErrorPopout } from "../components/common/ErrorPopout";
import { useLogin } from "../hooks/useLogin";
export default function AddPhoto(){
    
    const { add, loading, error} = useLogin();
    return (
        <Card>
            <AddForm
                onSubmit={add}
                loading={loading}
                error={error}
            />
            <ErrorPopout error={error} />
        </Card>
    )
}