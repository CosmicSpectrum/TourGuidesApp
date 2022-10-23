import React from "react";
import {Button, CircularProgress} from '@mui/material';

export default function ButtonComponent({isLoading = false, onClick, title = "", color, marginTop, disabled}){
    return (<Button 
        sx={{marginTop: marginTop ? marginTop : "7%", padding: `1vmax ${isLoading ? "4.7vmax" : "4vmax"} 1vmax ${isLoading ? "4.7vmax" : "4vmax"}`}} 
        onClick={onClick} variant="contained" 
        color={!color ? "success" : color} disabled={isLoading || disabled}>
            {isLoading ? 
            <CircularProgress size={"3.5vmax"} color="success" /> : title}
        </Button>)
}