import { Box, AppBar, Toolbar, IconButton, Typography, Button, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import apiClient from "../api/database";
import UserGrid from "../components/DataGrid/UserGrid";
import TabPanel from "../components/TabPanel";
import StatesGrid from "../components/DataGrid/StatesGrid";
import CategoryGrid from "../components/DataGrid/CategoryGrid";
import FinanceGrid from "../components/DataGrid/FinanceGrid";

const AdminPage = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224, }}
        >
            <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                sx={{ borderRight: 1, borderColor: 'divider', width: '10%', padding: '8px', 
                    "@media (max-width: 1200px)": { width: '20%' },
                    "@media (max-width: 799px)": { width: '25%' }
                }}
            >
                <Tab label="Finances" {...a11yProps(0)} />
                <Tab label="States" {...a11yProps(1)} />
                <Tab label="Categories" {...a11yProps(2)} />
                <Tab label="Users" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <FinanceGrid admin={true} gridHeight='550px' />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <StatesGrid />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CategoryGrid />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <UserGrid />
            </TabPanel>
        </Box>
    )
};

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default AdminPage;