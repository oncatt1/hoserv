import { Card } from "../components/card";
import { AddForm } from "../components/photosadd/AddForm";
import { ErrorPopout } from "../components/common/ErrorPopout";
import { useAdd } from "../hooks/useAdd";
import { useState } from "react";
export default function AddPhoto(){
    
    const { add, loading, error } = useAdd();
    const [formError, setFormError] = useState(null);

    return (
        <Card>
            <AddForm
                onSubmit={add}
                loading={loading}
                error={error}
                onError={setFormError}
            />
            <ErrorPopout error={error || formError} />
        </Card>
    )
}