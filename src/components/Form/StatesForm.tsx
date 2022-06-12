import { Button, TextField, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import apiClient from "../../api/database";
import { State } from "../../types/types";
import { styles } from './styles';

interface StatesFormProps {
    state?: State;
    loadStates: () => void;
    close: () => void;
}

const StatesForm: FC<StatesFormProps> = ({ state, loadStates, close }) => {

    const [name, setName] = useState("");

    useEffect(() => {
        if (state) {
            setName(state.name);
        }
    }, []);

    const handleSubmit = () => {
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                if (state) {
                    apiClient.put(`api/state/${state.id}`, {
                        name
                    }).then(() => {
                        loadStates();
                    });
                }
                else {
                    apiClient.post(`api/state`, {
                        name
                    }).then(() => {
                        loadStates();
                    });
                }
                close();
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
            <Button sx={styles.formButton} variant="contained" color="success" onClick={handleSubmit}>CONFIRM</Button>
        </form>
    );
};

export default StatesForm;