import { Box, Typography, Button, FormControl, TextField, InputAdornment, FormGroup, Checkbox } from "@mui/material";
import React, { FC, useState } from "react";
import { AccountCircle, Lock } from '@mui/icons-material';
import TermsModal from "../components/Modal/TermsModal";
import axios from 'axios';
import apiClient from "../api/database";
import { User } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const styles = {
    signup_container: {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signup_form: {
        width: '900px',
        height: '600px',
        display: 'flex',
        borderRadius: '10px',
        boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%);'
    },
    left: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3bb19b',
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
        textAlign: 'center',
    },
    left_h1: {
        marginTop: 0,
        color: 'white',
        fontSize: '35px',
        alignSelf: 'center',
    },
    right: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
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

const RegisterPage: FC<Props> = ({ setToken }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [checkedTerms, setCheckedTerms] = useState(false);
    const [termsModal, setTermsModal] = useState(false);

    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const nameValidation = () => {
        if (name.length < 3) {
            return 'Name must be at least 3 characters long';
        }
        return 'Looking Good';
    };

    const emailValidation = () => {
        if (email.length < 1) {
            return `Email is required`;
        }
        if (email.length < 3) {
            return `Email must be at least 3 characters`;
        }
        if (!email.includes('@')) {
            return 'Email is invalid';
        }
        return 'Looking Good';
    };

    const passwordValidation = () => {
        if (password.length < 1) {
            return `Password is required`;
        }
        if (password.length < 3) {
            return `Password must contain at least 3 characters [a-Z, 0-9, _]`;
        }
        return 'Looking Good';
    };

    const passwordConfirmValidation = () => {
        if (passwordConfirm !== password) {
            return `Password confirmation must match password`;
        }
        return 'Looking Good';
    };

    const sucessValidation = () => {
        if (
            nameValidation() === 'Looking Good' &&
            emailValidation() === 'Looking Good' &&
            passwordValidation() === 'Looking Good' &&
            passwordConfirmValidation() === 'Looking Good' &&
            checkedTerms
        ) {
            return true;
        }
        return false;
    };

    const handleRegister = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.post('api/register', {
                    name,
                    email,
                    password,
                    password_confirmation: password,
                }).then(res => {
                    localStorage.setItem('token', res?.data?.access_token);
                    setToken(localStorage.getItem('token'));
                    apiClient.get('api/user', {
                        headers: {
                            Authorization: `Bearer ${res?.data?.access_token}`,
                        },
                    }).then(res => {
                        const _data: User[] = res.data;
                        let id = 0;
                        id = _data.find(u => u.email === email)?.id!;
                        localStorage.setItem('user', id.toString());
                        enqueueSnackbar(`Registered! `, { variant: 'success' });
                    });
                }).catch(err => {
                    console.log(err);
                });
            });
        } catch (error) {
            console.log(error);
        }
        navigate('/');
    };

    return (
        <Box sx={styles.signup_container}>
            <Box sx={styles.signup_form}>
                <Box sx={styles.left}>
                    <Typography sx={styles.left_h1}>Already have an account?</Typography>
                    <Button
                        sx={{ width: '180px', my: '10px' }}
                        variant='contained'
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </Button>
                </Box>
                <Box sx={styles.right}>
                    <form>
                        <Typography sx={styles.form_container_h1}>Create new account</Typography>
                        <FormControl sx={styles.form_container}>
                            <TextField
                                type='text'
                                label="Name"
                                fullWidth
                                error={nameValidation() !== 'Looking Good'}
                                helperText={nameValidation()}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={styles.input}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
                                }}
                                FormHelperTextProps={{
                                    style: {
                                        color: emailValidation() === 'Looking Good' ? 'green' : 'red',
                                    }
                                }}
                            />
                            <TextField
                                type='email'
                                label="Email"
                                fullWidth
                                error={emailValidation() !== 'Looking Good'}
                                helperText={emailValidation()}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={styles.input}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
                                }}
                                FormHelperTextProps={{
                                    style: {
                                        color: emailValidation() === 'Looking Good' ? 'green' : 'red',
                                    }
                                }}
                            />
                            <TextField
                                type='password'
                                label="Password"
                                fullWidth
                                error={passwordValidation() !== 'Looking Good'}
                                helperText={passwordValidation()}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={styles.input}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                                }}
                                FormHelperTextProps={{
                                    style: {
                                        color: passwordValidation() === 'Looking Good' ? 'green' : 'red',
                                    }
                                }}
                            />
                            <TextField
                                type='password'
                                label="Confirm Password"
                                fullWidth
                                error={passwordConfirmValidation() !== 'Looking Good'}
                                helperText={passwordConfirmValidation()}
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                sx={styles.input}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                                }}
                                FormHelperTextProps={{
                                    style: {
                                        color: passwordConfirmValidation() === 'Looking Good' ? 'green' : 'red',
                                    }
                                }}
                            />
                            <FormGroup sx={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Checkbox
                                    color='success'
                                    checked={checkedTerms}
                                    onChange={(e) => setCheckedTerms(e.target.checked)}
                                />
                                <Typography
                                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => { setTermsModal(true) }}
                                >
                                    I agree to the terms of service and privacy policy
                                </Typography>
                            </FormGroup>
                            <Button
                                type='submit'
                                disabled={!sucessValidation()}
                                sx={{ width: '80%', mt: '16px' }}
                                variant='contained'
                                color='success'
                                onClick={handleRegister}
                            >
                                Sign Up
                            </Button>
                        </FormControl>
                    </form>
                </Box>
            </Box>
            <TermsModal isOpen={termsModal} onClose={() => setTermsModal(false)} acceptTerms={() => setCheckedTerms(true)} />
        </Box>
    );
};

export default RegisterPage;