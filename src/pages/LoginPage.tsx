import { Box, Typography, FormControl, TextField, InputAdornment, Button } from "@mui/material";
import axios from "axios";
import React, { FC, useState } from "react";
import { AccountCircle, Lock } from '@mui/icons-material';
import apiClient from "../api/database";
import { User } from '../types/types';
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";

const styles = {
    signin_container: {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signin_form: {
        width: '900px',
        height: '500px',
        display: 'flex',
        borderRadius: '10px',
        boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%);'
    },
    right: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3bb19b',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        textAlign: 'center',
    },
    right_h1: {
        marginTop: 0,
        color: 'white',
        fontSize: '35px',
        alignSelf: 'center',
    },
    left: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        textAlign: 'center',
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
    },
    form_container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form_container_h1: {
        textAlign: 'center',
        fontSize: '40px',
        marginTop: '0',
        alignSelf: 'start',
    },
    input: {
        width: '370px',
        margin: '10px 0',
        fontSize: '14px',
    },
};

interface Props {
    setToken: (token: any) => void;
}

const LoginPage: FC<Props> = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.post('api/login', {
                    email,
                    password
                }).then(res => {
                    localStorage.setItem('token', res?.data?.access_token);
                    setToken(localStorage.getItem('token'));
                    navigate('/');
                    enqueueSnackbar(`Logged in!`, { variant: 'success' });
                }).catch(err => {
                    enqueueSnackbar(`${err.response.data.message}`, { variant: 'error' });
                    return;
                });
            });
        } catch (error) {
            console.log(error);
        }

        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.get('api/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    const _data: User[] = res.data;
                    let id = 0;
                    id = _data.find(u => u.email === email)?.id!;
                    localStorage.setItem('user', id ? id.toString() : "0");
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box sx={styles.signin_container}>
            <Box sx={styles.signin_form}>
                <Box sx={styles.left}>
                    <form>
                        <Typography sx={styles.form_container_h1}>Sign In</Typography>
                        <FormControl sx={styles.form_container}>
                            <TextField
                                type='email'
                                label="Email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={styles.input}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
                                }}
                            />
                            <TextField
                                type='password'
                                label="Password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={styles.input}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                                }}
                            />
                            <Button
                                type='submit'
                                variant='contained'
                                color='success'
                                sx={{ width: '60%' }}
                                onClick={(e) => {
                                    handleLogin(e);
                                }}
                            >
                                Sign In
                            </Button>
                        </FormControl>
                    </form>
                </Box>
                <Box sx={styles.right}>
                    <Typography sx={styles.right_h1}>Don't have an account?</Typography>
                    <Button
                        sx={{ width: '180px', my: '10px' }}
                        variant='contained'
                        onClick={() => navigate('/register')}
                    >
                        Sign Up
                    </Button>
                    {/* </Link> */}

                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;