import { Button, TextField, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import apiClient from "../../api/database";
import { Category } from "../../types/types";
import {styles} from './styles';

interface CategoryFormProps {
    category?: Category;
    loadCategories: () => void;
    close: () => void;
}

const CategoryForm: FC<CategoryFormProps> = ({ category, loadCategories, close }) => {

    const [name, setName] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, []);

    const handleSubmit = () => {
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                if (category) {
                    apiClient.put(`api/category/${category.id}`, {
                        name
                    }).then(() => {
                        loadCategories();
                    });
                }
                else {
                    apiClient.post(`api/category`, {
                        name
                    }).then(() => {
                        loadCategories();
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

export default CategoryForm;