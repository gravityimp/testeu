import React from 'react';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { MenuItem, Button } from '@mui/material';

interface CustomToolbarProps {
    exportJSON: () => void;
    exportXML: () => void;
}

function CustomToolbar({exportJSON, exportXML}: CustomToolbarProps) {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <Button onClick={exportJSON}>Export JSON</Button>
            <Button onClick={exportXML}>Export XML</Button>
        </GridToolbarContainer>
    );
}

export default CustomToolbar;