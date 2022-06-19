
import { Button, TextField, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import apiClient from "../../api/database";
import { User } from "../../types/types";
import { styles } from './styles';

interface UserFormProps {
    user: User;
    loadUsers: () => void;
    close: () => void;
}

const UserForm: FC<UserFormProps> = ({ user, loadUsers, close }) => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    useEffect(() => {
        setName(user.name);
    }, []);

    const handleSubmit = () => {
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                apiClient.put(`api/user/${user.id}`, {
                    name,
                    password,
                    password_confirmation: passwordConfirm
                }).then(() => {
                    loadUsers();
                    close();
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            overflowY: 'auto',
            backgroundColor: '#fff',
            paddingTop: '16px',
        }}>
            <TextField
                sx={styles.formInput}
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                sx={styles.formInput}
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                sx={styles.formInput}
                label="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <Button sx={styles.formButton} variant="contained" color="success" onClick={handleSubmit}>CONFIRM</Button>
        </form>
    );
};

export default UserForm;