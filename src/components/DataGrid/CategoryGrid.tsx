import { IconButton, Box, SpeedDial, Button, Input } from "@mui/material";
import React, { useEffect, useState, memo } from "react";
import apiClient from "../../api/database";
import { Category } from "../../types/types";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Close, Edit, Add } from '@mui/icons-material';
import CategoryForm from "../Form/CategoryForm";
import EditModal from "../Modal/EditModal";
import { handleExportJSON, handleExportXML } from "../../api/export";
import CustomToolbar from "../CustomGridToolbar";
import { XMLParser } from "fast-xml-parser";
import { useSnackbar } from "notistack";

const CategoryGrid = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [modalOpen, setModalOpen] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category>({ id: 0, name: "" });

    const { enqueueSnackbar } = useSnackbar();

    const loadCategories = () => {
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.get('api/category', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    setCategories(res.data);
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 75 },
        { field: 'name', headerName: 'NAME', width: 200 },
        {
            field: "edit",
            headerName: "EDIT",
            sortable: false,
            width: 75,
            disableColumnMenu: true,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation();
                    setSelectedCategory(params.row);
                    setModalOpen("edit");
                };

                return <IconButton color="primary" onClick={onClick}><Edit /></IconButton>;
            }
        },
        {
            field: "delete",
            headerName: "DELETE",
            sortable: false,
            width: 100,
            disableColumnMenu: true,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation();
                    try {
                        apiClient.get('/sanctum/csrf-cookie').then(() => {
                            apiClient.delete(`api/category/${params.row.id}`).then(res => {
                                loadCategories();
                                enqueueSnackbar(`Deleted category [${params.row.id}]`, { variant: 'success' });
                            });
                        });
                    } catch (error) {
                        console.log(error);
                    }
                };

                return <IconButton color="error" onClick={onClick}><Close /></IconButton>;
            }
        },
    ];

    const exportJSON = () => {
        handleExportJSON("categories", categories);
        enqueueSnackbar(`EXPORTED CATEGORIES JSON!`, { variant: 'success' });
    };

    const exportXML = () => {
        handleExportXML("categories", categories);
        enqueueSnackbar(`EXPORTED CATEGORIES XML`, { variant: 'success' });
    }

    const Tbar = () => {
        return <CustomToolbar exportJSON={exportJSON} exportXML={exportXML}/>;
    };

    return (
        <Box>
            <Box sx={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateX(-50%)' }}>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 99 }}
                    icon={<Add />}
                    onClick={() => setModalOpen("create")}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '4px' }}>
                <Box sx={{ marginX: '4px' }}>
                    <label htmlFor="contained-button-file">
                        <input
                            id="contained-button-file"
                            accept="application/JSON"
                            style={{ display: 'none' }}
                            type="file"
                            onChange={(e: any) => {
                                const fileReader = new FileReader();
                                fileReader.readAsText(e.target.files[0], "UTF-8");
                                fileReader.onload = e => {
                                    const dataImport = JSON.parse(`${e.target?.result}`);
                                    for (let i = 0; i < dataImport.length; i++) {
                                        const c: Category = {
                                            id: 0,
                                            name: dataImport[i].name ? dataImport[i].name : "noname"
                                        }
                                        try {
                                            apiClient.get('/sanctum/csrf-cookie').then(() => {
                                                apiClient.post('api/category', c).then(res => {
                                                    loadCategories();
                                                    enqueueSnackbar(`Loaded JSON!`, { variant: 'success' });
                                                });
                                            });
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }
                                };
                            }}
                        />
                        <Button variant="contained" component="span">IMPORT JSON</Button>
                    </label>
                </Box>
                <Box sx={{ marginX: '4px' }}>
                    <label htmlFor="contained-button-xml">
                        <input
                            id="contained-button-xml"
                            accept="application/XML"
                            style={{ display: 'none' }}
                            type="file"
                            onChange={(e: any) => {
                                const fileReader = new FileReader();
                                fileReader.readAsText(e.target.files[0], "UTF-8");
                                fileReader.onload = ev => {
                                    let parser = new XMLParser();
                                    let xml = parser.parse(`${ev.target?.result}`).base.element;
                                    for (let i = 0; i < xml.length; i++) {
                                        const c: Category = {
                                            id: 0,
                                            name: xml[i].name ? xml[i].name : "noname"
                                        }
                                        try {
                                            apiClient.get('/sanctum/csrf-cookie').then(() => {
                                                apiClient.post('api/category', c).then(res => {
                                                    loadCategories();
                                                    enqueueSnackbar(`Loaded XML!`, { variant: 'success' });
                                                });
                                            });
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }
                                };
                            }}
                        />
                        <Button variant="contained" component="span">IMPORT XML</Button>
                    </label>
                </Box>
            </Box>
            <div style={{ height: '500px', width: '100%' }}>
                <DataGrid
                    rows={categories}
                    columns={columns}
                    components={{
                        Toolbar: Tbar
                    }}
                />
            </div>
            <EditModal isOpen={modalOpen != ""} onClose={() => setModalOpen("")}>
                {
                    modalOpen == "edit"
                        ? <CategoryForm category={selectedCategory} close={() => setModalOpen("")} loadCategories={loadCategories} />
                        : <CategoryForm loadCategories={loadCategories} close={() => setModalOpen("")} />
                }
            </EditModal>
        </Box>
    );
};

export default memo(CategoryGrid);