import { Card } from "../components/card";
import { ErrorPopout } from "../components/common/ErrorPopout";
import { useState } from "react";
import { useAddFolder } from "../hooks/useFolderAdd";
import { AddFolderForm } from "../components/photosadd/AddFolderForm";

export default function AddFolder(){
    const { add, loading, error } = useAddFolder();
    return (
        <Card>
            <AddFolderForm
                onSubmit={add}
                loading={loading}
                error={error}
            />
            <ErrorPopout error={error} />
        </Card>
    )
}