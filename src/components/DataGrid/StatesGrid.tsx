import { IconButton, Box, SpeedDial, SpeedDialAction, Button } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import apiClient from "../../api/database";
import { State } from "../../types/types";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Close, Edit, Add } from '@mui/icons-material';
import EditModal from "../Modal/EditModal";
import StatesForm from "../Form/StatesForm";
import { handleExportJSON, handleExportXML } from "../../api/export";
import CustomToolbar from "../CustomGridToolbar";


const StatesGrid = () => {

    const [states, setStates] = useState<State[]>([]);
    const [modalOpen, setModalOpen] = useState("");
    const [selectedState, setSelectedState] = useState<State>({id: 0, name: ""});

    const loadStates = () => {
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.get('api/state', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    setStates(res.data);
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadStates();
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
                    setSelectedState(params.row);
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
                            apiClient.delete(`api/state/${params.row.id}`).then(res => {
                                loadStates();
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

    const handleCreate = (name: string) => {
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.post('api/state', { name }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    console.log(res.data);
                    loadStates();
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const exportJSON = () => {
        handleExportJSON("states", states)
    };

    const exportXML = () => {
        handleExportXML("states", states)
    }

    const Tbar = () => {
        return <CustomToolbar exportJSON={exportJSON} exportXML={exportXML}/>;
    };

    return (
        <Box sx={{ overflowY: 'none' }}>
            <Box sx={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateX(-50%)' }}>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 999 }}
                    icon={<Add />}
                    onClick={() => setModalOpen("create")}
                />
            </Box>
            <Box sx={{ marginBottom: '4px' }}>
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
                                    const c: State = {
                                        id: 0,
                                        name: dataImport[i].name ? dataImport[i].name : "noname"
                                    }
                                    try {
                                        apiClient.get('/sanctum/csrf-cookie').then(() => {
                                            apiClient.post('api/state', c).then(res => {
                                                loadStates();
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
            <div style={{ height: '600px', width: '100%' }}>
                <DataGrid 
                    rows={states} 
                    columns={columns}
                    components={{
                        Toolbar: Tbar
                    }}
                />
            </div>
            <EditModal isOpen={modalOpen != ""} onClose={() => setModalOpen("")}>
                {
                    modalOpen == "edit"
                        ? <StatesForm state={selectedState} close={() => setModalOpen("")} loadStates={loadStates} />
                        : <StatesForm loadStates={loadStates} close={() => setModalOpen("")}/>
                }
            </EditModal>
        </Box>
    );
};

export default memo(StatesGrid);