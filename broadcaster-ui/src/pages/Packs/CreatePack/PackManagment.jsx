import React, {useRef, useEffect, useState} from 'react';
import { FetchingWrapper,PageWrapper } from '../PackList/styles';
import {Card, Title, inputDesign, Paragraph} from '../../../components/globalStyles/styles';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../../../context/appContext';
import { CircularProgress, TextField, Button} from '@mui/material';
import { Add, Upload } from '@mui/icons-material';
import PopupBase from '../../../components/PopupBase/PopupBase';
import SelectFilesPopup from '../../../components/SelectFilePopup/SelectFilePopup';
import styled from 'styled-components';


const FormWrapper = styled.div(({language})=>({
    display: 'flex',
    flexDirection: "column",
    alignItems: "center",
    direction: language ? 'rtl' : 'ltr'
}));

const ListWrapper = styled.div({
    display: 'flex',
    flexDirection: "column",
    width: "90%",
    height: "55vmax",
    alignItems: "center"
})

export default function PackManagment(){
    const {language, user, getUser} = useMainContext();
    const params = useRef(new URLSearchParams(window.location.search));
    const Navigate = useNavigate(); 
    const [isFetching,setFecthing] = useState(true);
    const [isFilled, setIsFilled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [pack, setPack] = useState({
        packName: null,
        packItems: [],
        isPublic: false
    })

    useEffect(()=>{
        if(!user && Cookie.get("auth-token")){
            getUser();
        } else if(!Cookie.get("auth-token")){
            Navigate('/');
        }else if(user){
            setFecthing(false);
        }
    },[user,Navigate,getUser])

    useEffect(()=>{window.onbeforeunload = ()=>{return 'test'}})

    useEffect(()=>{
        if(pack.packName && pack.packItems.length > 0){
            setIsFilled(true);
        }
    },[isFilled, setIsFilled])

    const getTitle = ()=>{
        if(params.current.get('edit')){
            return language ? 'עריכת מארז' : 'Edit Pack';
        }else if(params.current.get('disabled')){
            return language ? 'צפייה במארז' : 'View Pack';
        }else{
            return language ? 'יצירת מארז' : 'Create Pack';
        }
    }

    return (
        <PageWrapper>
        {!isFetching ? 
            <Card height="85vmax" width="95%">
                <Title fontSize={'4vmax'}>
                    {getTitle()}
                </Title>
                <FormWrapper language={language}>
                    <TextField 
                        sx={{...inputDesign, width: '90%'}}
                        id={'packName'}
                        onChange={(e)=>{
                            setPack(prev=>{
                                return {...prev, packName: e.target.value}
                            })
                        }}
                        autoComplete={'off'}
                        variant="standard"
                        label={language ? 'הכנס שם מארז' : 'Insert pack name'}
                        color='success'
                    />
                    <ListWrapper>
                        <Button 
                            variant='contained' 
                            color="success" 
                            startIcon={<Add />}
                            sx={{width: "100%"}}
                            onClick={()=> setShowPopup(true)}
                        >
                            {language ? 'הוסף קובץ' : 'Add A File'}
                        </Button>
                        {pack.packItems.length > 0 ?
                            <></> 
                        :
                            <Paragraph marginTop="40%" fontSize="2.5vmax">
                                לא נוספו קבצים
                            </Paragraph>
                        }
                    </ListWrapper>
                    <Button
                        variant='contained'
                        color='success'
                        disabled={!isFilled}
                        sx={{width: "90%"}}
                        startIcon={<Upload />}
                    >
                        {language ? 'צור מארז' : "Create Pack"}
                    </Button>
                </FormWrapper>
            </Card>
        :
            <FetchingWrapper>
                <CircularProgress 
                color='success'
                size={50}
                />
            </FetchingWrapper>
        }
        {
            showPopup && 
            <PopupBase height={'80%'} width="90%" setShown={setShowPopup}>
                <SelectFilesPopup setPack={setPack} />
            </PopupBase>
        }
        </PageWrapper>
    )
}