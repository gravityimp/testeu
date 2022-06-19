import { IconButton, Box, SpeedDial } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import apiClient from "../../api/database";
import { User } from "../../types/types";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Close, Edit, Add } from '@mui/icons-material';
import EditModal from "../Modal/EditModal";
import UserForm from "../Form/UserForm";
import { handleExportJSON, handleExportXML } from "../../api/export";
import CustomToolbar from "../CustomGridToolbar";
import { useSnackbar } from "notistack";


const UserGrid = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>({
        id: 0,
        name: "",
        email: "",
    });

    const { enqueueSnackbar } = useSnackbar();

    const loadUsers = () => {
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.get('api/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    setUsers(res.data);
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 75 },
        { field: 'name', headerName: 'NAME', width: 150 },
        { field: 'email', headerName: 'EMAIL', width: 200 },
        {
            field: 'created_at',
            headerName: 'CREATED AT',
            width: 175,
            renderCell: (params: any) => {
                return new Date(params.row.created_at).toLocaleString();
            }
        },
        {
            field: 'updated_at',
            headerName: 'UPDATED AT',
            width: 175,
            renderCell: (params) => {
                return new Date(params.row.updated_at).toLocaleString();
            }
        },
        {
            field: "edit",
            headerName: "EDIT",
            sortable: false,
            width: 75,
            disableColumnMenu: true,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation();
                    setSelectedUser(params.row);
                    setModalOpen(true);
                };

                return <IconButton disabled={params.row.id !== parseInt(localStorage.getItem('user')!)} color="primary" onClick={onClick}><Edit /></IconButton>;
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
                            apiClient.delete(`api/user/${params.row.id}`).then(res => {
                                loadUsers();
                                enqueueSnackbar(`DELETED USER [${params.row.name} ID: ${params.row.id}]!`, { variant: 'success' });
                            });
                        });
                    } catch (error) {
                        console.log(error);
                    }
                };

                return <IconButton disabled={params.row.id === parseInt(localStorage.getItem('user')!)} color="error" onClick={onClick}><Close /></IconButton>;
            }
        },
    ];

    const exportJSON = () => {
        handleExportJSON("users", users);
        enqueueSnackbar(`EXPORTED USERS JSON!`, { variant: 'success' });
    };

    const exportXML = () => {
        handleExportXML("users", users);
        enqueueSnackbar(`EXPORTED USERS XML!`, { variant: 'success' });
    }

    const Tbar = () => {
        return <CustomToolbar exportJSON={exportJSON} exportXML={exportXML}/>;
    };

    return (
        <Box>
            <div style={{ height: '600px', width: '100%' }}>
                <DataGrid 
                    rows={users} 
                    columns={columns}
                    components={{
                        Toolbar: Tbar
                    }}
                />
            </div>
            <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <UserForm user={selectedUser} close={() => setModalOpen(false)} loadUsers={loadUsers} />
            </EditModal>
        </Box>
    );
};

export default memo(UserGrid);