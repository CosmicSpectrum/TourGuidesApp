import React, {useState, useEffect} from 'react';
import { useMainContext } from '../../../context/appContext';
import {TabContext,TabList,TabPanel} from "@mui/lab";
import {Tab, Box, CircularProgress} from '@mui/material';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FetchingWrapper,PageWrapper } from './styles';
import {Card} from '../../../components/globalStyles/styles';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PackList from '../../../components/PackList/PackList';

export default function Packs(){
    const {user, getUser, language} = useMainContext();
    const [value, setValue] = useState('1');
    const [fetching, setFecthing] = useState(true);
    const [packs, setPacks] = useState([]);
    const Navigate = useNavigate()

    useEffect(()=>{
        if(!user && Cookie.get("auth-token")){
            getUser();
        } else if(!Cookie.get("auth-token")){
            Navigate('/');
        }else if(user){
            setFecthing(false);
        }
    },[user,Navigate,getUser])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <PageWrapper>
            <Card height="85vmax" width="95%">
                {!fetching ? <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: "flex", justifyContent: "center" }}>
                        <TabList    
                            sx={{
                            "& button:hover": { background: "transparent" },
                            "& button.Mui-selected": {color:"#2e7d32" },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#2e7d32"
                                },
                            width: "100%"
                            
                        }} onChange={handleChange}>
                            <Tab sx={{width: "50%"}} label={language ? "המארזים שלך" : "Your Packs"} value="1" />
                            <Tab sx={{width: "50%"}} label={language ? "מארזים ציבוריים" : "Public Packs"} value="2" />
                        </TabList>
                        </Box>
                        <TabPanel value="1">
                            <PackList packs={packs} setPacks={setPacks} type={true} />
                            <IconButton
                                size="large"
                                edge="start"
                                color="success"
                                aria-label="addFile"
                                onClick={()=>{Navigate('/packManagment')}}
                                sx={{
                                    position: 'fixed',
                                 ...(!language) && {"right": '5%'},
                                ...(language) && {"right": '5%'} , 
                                bottom: "6%" }}
                            >
                                <AddCircleIcon sx={{fontSize: "2.5rem"}} />
                            </IconButton>
                        </TabPanel>
                        <TabPanel value="2">
                            <PackList packs={packs} setPacks={setPacks} />
                        </TabPanel>
                    </TabContext>
                    : 
                        <FetchingWrapper>
                            <CircularProgress 
                            color='success'
                            size={50}
                            />
                        </FetchingWrapper>
                    }
            </Card>
        </PageWrapper>
    )
}