import { Modal, Box, Button } from "@mui/material";
import React, { FC } from "react";
import Terms from "../Terms";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    acceptTerms: () => void;
}

const TermsModal: FC<TermsModalProps> = ({ isOpen, onClose, acceptTerms }) => {

    const handleClick = () => {
        acceptTerms();
        onClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Box sx={{ 
                width: '50%', 
                height: '500px',
                padding: '16px',
                overflow: "hidden",
                overflowY: "scroll",
                borderRadius: "8px",
                color: 'white',
                backgroundColor: '#222',
                textAlign: 'center',
            }}>
                <Terms />
                <Button variant="contained" sx={{ my: '8px' }} onClick={handleClick}>ACCEPT TERMS</Button>
            </Box>
        </Modal>
    );
};

export default TermsModal;
