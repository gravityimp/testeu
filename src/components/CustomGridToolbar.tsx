import React from 'react';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { MenuItem, Button, Menu, MenuList } from '@mui/material';

interface CustomToolbarProps {
    exportJSON: () => void;
    exportXML: () => void;
    allFinancesJSON?: () => void;
    allFinancesXML?: () => void;
}

function CustomToolbar({exportJSON, exportXML, allFinancesJSON, allFinancesXML}: CustomToolbarProps) {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <Button onClick={exportJSON}>Export JSON</Button>
            <Button onClick={exportXML}>Export XML</Button>
            {
                allFinancesJSON && <Button onClick={allFinancesJSON}>Export All JSON</Button>
            }
            {
                allFinancesXML && <Button onClick={allFinancesXML}>Export All XML</Button>
            }
        </GridToolbarContainer>
    );
}

export default CustomToolbar;