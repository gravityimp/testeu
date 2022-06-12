import exportFromJSON from "export-from-json";

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
    exportFromJSON({data, fileName, fields, exportType})
}