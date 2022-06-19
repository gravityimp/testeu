import { IconButton, Box, SpeedDial, Button } from "@mui/material";
import React, { memo, useEffect, useState, FC } from "react";
import apiClient from "../../api/database";
import { Finance } from "../../types/types";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Close, Edit, Add } from '@mui/icons-material';
import FinanceForm from "../Form/FinanceForm";
import EditModal from "../Modal/EditModal";
import { handleExportAllJSON, handleExportAllXML, handleExportJSON, handleExportXML } from "../../api/export";
import CustomToolbar from "../CustomGridToolbar";
import { XMLParser } from "fast-xml-parser";
import { useSnackbar } from "notistack";

interface FinanceGridProps {
    admin: boolean;
    gridHeight?: string;
    selectedStates?: number[];
    selectedCategories?: number[];
}

const FinanceGrid: FC<FinanceGridProps> = ({ admin, gridHeight, selectedCategories, selectedStates }) => {

    const [finances, setFinances] = useState<Finance[]>([]);
    const [page, setPage] = useState(0);
    const [maxPages, setMaxPages] = useState(1);

    const [modalOpen, setModalOpen] = useState("");
    const [selectedFinance, setSelectedFinance] = useState<Finance>({
        id: 0,
        title: "",
        organization: "",
        total_value: 0,
        added_value: 0,
        category_name: "",
        state_name: "",
        id_category: 0,
        id_state: 0,
    });

    const {enqueueSnackbar} = useSnackbar();

    const loadFinances = () => {
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.get(`api/finances/?page=${page + 1}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    setFinances(res.data.data);
                    setMaxPages(res.data.total);
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadFinances();
    }, [page]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 75 },
        {
            field: "edit",
            headerName: "EDIT",
            sortable: false,
            width: 75,
            hide: !admin,
            disableColumnMenu: true,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation();
                    setSelectedFinance(params.row);
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
            hide: !admin,
            disableColumnMenu: true,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation();
                    try {
                        apiClient.get('/sanctum/csrf-cookie').then(() => {
                            apiClient.delete(`api/finances/${params.row.id}`).then(res => {
                                loadFinances();
                                enqueueSnackbar(`Deleted finance [${params.row.id}]`, { variant: 'success' });
                            });
                        });
                    } catch (error) {
                        console.log(error);
                    }
                };

                return <IconButton color="error" onClick={onClick}><Close /></IconButton>;
            }
        },
        { field: 'title', headerName: 'TITLE', width: 300 },
        { field: 'organization', headerName: 'ORGANIZATION', width: 300 },
        { field: 'total_value', headerName: 'TOTAL', width: 150 },
        { field: 'added_value', headerName: 'EU FINANCES', width: 150 },
        {
            field: 'state',
            headerName: 'STATE',
            width: 150,
            filterable: admin,
            renderCell: (params: any) => {
                return params.row.state_name;
            }
        },
        {
            field: 'category',
            headerName: 'CATEGORY',
            width: 150,
            filterable: admin,
            renderCell: (params: any) => {
                return params.row.category_name;
            }
        }
    ];

    const filteredFinances = finances.filter((finance) => {
        if (!admin) {
            if (selectedStates && selectedStates.length === 0 && selectedCategories && selectedCategories.length === 0) {
                return true;
            }
            else if (
                selectedStates &&
                selectedStates.length > 0 &&
                selectedStates?.includes(finance.id_state) &&
                selectedCategories &&
                selectedCategories.length === 0
            ) {
                return true;
            }
            else if (
                selectedCategories &&
                selectedCategories.length > 0 &&
                selectedCategories?.includes(finance.id_category) &&
                selectedStates &&
                selectedStates.length === 0
            ) {
                return true;
            }
            else if (
                selectedCategories &&
                selectedCategories.length > 0 &&
                selectedCategories?.includes(finance.id_category) &&
                selectedStates &&
                selectedStates.length > 0 &&
                selectedStates?.includes(finance.id_state)
            ) {
                return true;
            }
            return false;
        }
        return true;
    });

    const exportJSON = () => {
        handleExportJSON("finances", filteredFinances);
        enqueueSnackbar(`EXPORTED FINANCES JSON PAGE ${page}!`, { variant: 'success' });
    };

    const exportXML = () => {
        handleExportXML("finances", filteredFinances);
        enqueueSnackbar(`EXPORTED FINANCES XML PAGE ${page}!`, { variant: 'success' });
    };

    const exportAllFinancesJSON = () => {
        handleExportAllJSON("all-finances");
        enqueueSnackbar(`EXPORTED FINANCES JSON!`, { variant: 'success' });
    };

    const exportAllFinancesXML = () => {
        handleExportAllXML("all-finances");
        enqueueSnackbar(`EXPORTED FINANCES XML!`, { variant: 'success' });
    };

    const Tbar = () => {
        return ( 
            <CustomToolbar 
                exportJSON={exportJSON} 
                exportXML={exportXML} 
                allFinancesJSON={exportAllFinancesJSON}
                allFinancesXML={exportAllFinancesXML}
            /> );
    };

    return (
        <Box>
            {
                admin && (
                    <Box sx={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateX(-50%)' }}>
                        <SpeedDial
                            ariaLabel="SpeedDial basic example"
                            sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 999 }}
                            icon={<Add />}
                            onClick={() => setModalOpen("create")}
                        />
                    </Box>
                )
            }
            {
                admin && (
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
                                                const f: Finance = {
                                                    id: 0,
                                                    title: dataImport[i].title ? dataImport[i].title : "noname",
                                                    organization: dataImport[i].organization ? dataImport[i].organization : "noorg",
                                                    total_value: dataImport[i].total_value ? dataImport[i].total_value : 0,
                                                    added_value: dataImport[i].added_value ? dataImport[i].added_value : 0,
                                                    id_state: dataImport[i].id_state ? dataImport[i].id_state : 0,
                                                    id_category: dataImport[i].id_category ? dataImport[i].id_category : 0,
                                                    state_name: dataImport[i].state_name ? dataImport[i].state_name : "nostate",
                                                    category_name: dataImport[i].category_name ? dataImport[i].category_name : "nocategory"
                                                }
                                                try {
                                                    apiClient.get('/sanctum/csrf-cookie').then(() => {
                                                        apiClient.post('api/finances', f).then(res => {
                                                            loadFinances();
                                                            enqueueSnackbar(`IMPORTED JSON!`, { variant: 'success' });
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
                                                const f: Finance = {
                                                    id: 0,
                                                    title: xml[i].title ? xml[i].title : "noname",
                                                    organization: xml[i].organization ? xml[i].organization : "noorg",
                                                    total_value: xml[i].total_value ? xml[i].total_value : 0,
                                                    added_value: xml[i].added_value ? xml[i].added_value : 0,
                                                    id_state: xml[i].id_state ? xml[i].id_state : 0,
                                                    id_category: xml[i].id_category ? xml[i].id_category : 0,
                                                    state_name: xml[i].state_name ? xml[i].state_name : "nostate",
                                                    category_name: xml[i].category_name ? xml[i].category_name : "nocategory",
                                                }
                                                try {
                                                    apiClient.get('/sanctum/csrf-cookie').then(() => {
                                                        apiClient.post('api/finances', f).then(res => {
                                                            loadFinances();
                                                            enqueueSnackbar(`IMPORTED XML!`, { variant: 'success' });
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
                )
            }
            <div style={{ height: `${'600px' && gridHeight}`, width: '100%' }}>
                <DataGrid
                    rows={filteredFinances}
                    rowCount={maxPages}
                    rowsPerPageOptions={[9]}
                    pagination
                    page={page}
                    pageSize={10}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                        console.log("NEW PAGE", newPage)
                        setPage(newPage ? newPage : 0)
                    }}
                    columns={columns}
                    components={{
                        Toolbar: Tbar
                    }}
                />
            </div>
            <EditModal isOpen={modalOpen !== ""} onClose={() => setModalOpen("")}>
                {
                    modalOpen === "edit"
                        ? <FinanceForm finance={selectedFinance} close={() => setModalOpen("")} loadFinances={loadFinances} />
                        : <FinanceForm loadFinances={loadFinances} close={() => setModalOpen("")} />
                }
            </EditModal>
        </Box>
    );
};

export default memo(FinanceGrid);