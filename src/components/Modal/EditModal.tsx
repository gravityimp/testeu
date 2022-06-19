import { Modal, Box, Button, Typography, IconButton } from "@mui/material";
import React, { FC } from "react";
import Terms from "../Terms";
import { Close } from '@mui/icons-material';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: any;
}

const EditModal: FC<EditModalProps> = (props) => {

    const { isOpen, onClose, children } = props;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Box sx={{ 
                width: '50%', 
                height: '70%',
                padding: '16px',
                borderRadius: "8px",
                color: 'black',
                backgroundColor: '#fff',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <IconButton sx={{ alignSelf: 'end' }} onClick={onClose}><Close/></IconButton>
                {children}
            </Box>
        </Modal>
    );
};

export default EditModal;