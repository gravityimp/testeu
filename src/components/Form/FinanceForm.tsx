import { Typography, TextField, Button, Select, MenuItem } from "@mui/material";
import React, { useState, useEffect, FC, memo } from "react";
import apiClient from "../../api/database";
import { Category, Finance, State } from "../../types/types";
import { styles } from './styles';

interface FinanceFormProps {
    finance?: Finance;
    loadFinances: () => void;
    close: () => void;
}

const FinanceForm: FC<FinanceFormProps> = ({ finance, loadFinances, close }) => {

    const [title, setTitle] = useState("");
    const [organization, setOrganization] = useState("");
    const [totalValue, setTotalValue] = useState(0);
    const [addedValue, setAddedValue] = useState(0);

    const [categories, setCategories] = useState<Category[]>([]);
    const [states, setStates] = useState<State[]>([]);

    const [category, setCategory] = useState<string>("");
    const [state, setState] = useState<string>("");

    const [categoryId, setCategoryId] = useState(0);
    const [stateId, setStateId] = useState(0);

    useEffect(() => {
        loadCategories();
        loadStates();
        if (finance) {
            setTitle(finance.title);
            setOrganization(finance.organization);
            setTotalValue(finance.total_value);
            setAddedValue(finance.added_value);
            setCategory(finance.category_name);
            setState(finance.state_name);

            setCategoryId(finance.id_category);
            setStateId(finance.id_state);
        }
    }, []);

    const loadCategories = () => {
        apiClient.get('/sanctum/csrf-cookie').then(() => {
            apiClient.get('api/category').then(({ data }) => {
                setCategories(prev => data);
            });
        });
    };

    const loadStates = () => {
        apiClient.get('/sanctum/csrf-cookie').then(() => {
            apiClient.get('api/state').then(({ data }) => {
                setStates(prev => data);
            });
        });
    };

    const handleSubmit = () => {
        if (category === "" || state === "") {
            alert("Please select a category and state");
            return;
        }
        try {
            apiClient.get('/sanctum/csrf-cookie').then(() => {
                if (finance) {
                    apiClient.put(`api/finances/${finance.id}`, {
                        title,
                        organization,
                        total_value: totalValue,
                        added_value: addedValue,
                        id_category: categoryId,
                        id_state: stateId
                    }).then(() => {
                        loadFinances();
                    });
                }
                else {
                    apiClient.post(`api/finances`, {
                        title,
                        organization,
                        total_value: totalValue,
                        added_value: addedValue,
                        id_category: categoryId,
                        id_state: stateId
                    }).then(() => {
                        loadFinances();
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
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                sx={styles.formInput}
                label="Organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
            />
            <TextField
                sx={styles.formInput}
                label="Total Value"
                type="number"
                value={totalValue}
                onChange={(e) => {
                    if (e.target.value === "") {
                        setTotalValue(1);
                    } else {
                        setTotalValue(parseFloat(e.target.value))
                    }
                }}
            />
            <TextField
                sx={styles.formInput}
                label="Added Value"
                type="number"
                value={addedValue}
                onChange={(e) => {
                    if (e.target.value === "") {
                        setAddedValue(1);
                    } else {
                        setAddedValue(parseFloat(e.target.value))
                    }
                }}
            />
            <Select
                sx={styles.formInput}
                label="Category"
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value)
                    setCategoryId(categories.find(c => c.name === e.target.value)?.id!);
                }}
            >
                {categories.map(_category => (
                    <MenuItem key={_category.id} value={_category.name}>{_category.name}</MenuItem>
                ))}
            </Select>
            <Select
                sx={styles.formInput}
                label="State"
                value={state}
                onChange={(e) => {
                    setState(e.target.value);
                    setStateId(states.find(_state => _state.name === e.target.value)?.id!);
                }}
            >
                {states.map(_state => (
                    <MenuItem key={_state.id} value={_state.name}>{_state.name}</MenuItem>
                ))}
            </Select>
            <Button sx={styles.formButton} variant="contained" color="success" onClick={handleSubmit}>CONFIRM</Button>
        </form>
    );
};

export default memo(FinanceForm);