import exportFromJSON from "export-from-json";
import { Finance } from "../types/types";
import apiClient from "./database";

export const handleExportJSON = (name: string = "data", data: any[]) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${name}.json`;

    link.click();
};

export const handleExportXML = (name: string = "data", data: any[], fields: any[] = []) => {
    const fileName = name;
    const exportType = 'xml';
    exportFromJSON({ data, fileName, fields, exportType })
}

export const handleExportAllJSON = async (name: string = "data") => {

    let data: Finance[] = [];
    try {
        await apiClient.get('/sanctum/csrf-cookie').then(() => {
            apiClient.get(`api/financesNoPagination`, {
                headers: {
                    'Authentication': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                console.log("JSON: ", res.data);
                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                    JSON.stringify(res.data)
                )}`;
                const link = document.createElement("a");
                link.href = jsonString;
                link.download = `${name}.json`;

                link.click();
            });
        });
    } catch (error) {
        console.log(error);
    }
}

export const handleExportAllXML = async (name: string = "data", fields: any[] = []) => {

    try {
        await apiClient.get('/sanctum/csrf-cookie').then(() => {
            apiClient.get(`api/financesNoPagination`, {
                headers: {
                    'Authentication': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                const data = res.data;
                console.log("XML: ", data);
                const fileName = name;
                const exportType = 'xml';
                exportFromJSON({ data, fileName, fields, exportType })
            });
        });
    } catch (error) {
        console.log(error);
    }
}