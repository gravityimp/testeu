import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import apiClient from "../api/database";
import FinanceGrid from "../components/DataGrid/FinanceGrid";
import MapChart from "../components/MapChart";
import { Category, State } from "../types/types";

const GeneralPage = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [states, setStates] = useState<State[]>([]);

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedStates, setSelectedStates] = useState<number[]>([]);

    const getCategories = async () => {
        const response = await apiClient.get('api/category', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        setCategories(response.data);
    };

    const getStates = async () => {
        const response = await apiClient.get('api/state', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        setStates(response.data);
    };

    useEffect(() => {
        getCategories();
        getStates();
    }, []);

    const handleCategoryClick = (category: number) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '16px'}}>
                <MapChart selectedStates={selectedStates} setSelectedStates={setSelectedStates}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ textAlign: 'center' }} >Select Caregories</Typography>
                <Box sx={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    {
                        categories.map(category => {
                            return (
                                <Button
                                    key={category.id}
                                    variant="contained"
                                    color={selectedCategories.includes(category.id) ? 'warning' : 'primary'}
                                    onClick={() => handleCategoryClick(category.id)}
                                    sx={{ margin: '4px' }}
                                >
                                    {category.name}
                                </Button>
                            );
                        })
                    }
                </Box>
            </Box>
            <Box sx={{ width: '90%', marginX: 'auto', marginY: '16px' }}>
                <FinanceGrid admin={false} gridHeight='600px' selectedCategories={selectedCategories} selectedStates={selectedStates} />
            </Box>
        </Box>
    );
};

export default GeneralPage;