import React, { FC } from 'react';
import { Box, Toolbar, Typography, Button, AppBar } from "@mui/material";
import apiClient from "../api/database";
import { useNavigate } from 'react-router-dom';

interface Props {
    setToken: (token: any) => void;
}

const NavBar: FC<Props> = ({ setToken }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(localStorage.getItem('token'));
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{left: 0, top: 0}}>
                <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, marginX: '4px', cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            General
                        </Typography>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, marginX: '4px', cursor: 'pointer' }}
                            onClick={() => navigate('/admin')}
                        >
                            Admin
                        </Typography>
                    </Box>
                    <Button 
                        color="inherit"
                        onClick={handleLogout}
                    >Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;