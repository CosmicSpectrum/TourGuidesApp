import React, {useRef, useEffect, useState} from 'react';
import { FetchingWrapper,PageWrapper } from '../PackList/styles';
import {Card, Title, inputDesign, Paragraph, ErrorLabel} from '../../../components/globalStyles/styles';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../../../context/appContext';
import { CircularProgress, TextField, Button, FormControlLabel,Checkbox} from '@mui/material';
import { Add, Upload } from '@mui/icons-material';
import PopupBase from '../../../components/PopupBase/PopupBase';
import SelectFilesPopup from '../../../components/SelectFilePopup/SelectFilePopup';
import SelectFilesList from '../../../components/SelectFilesList/SelectFilesList';
import styled from 'styled-components';
import FilesNetwork from '../../../network/FilesNetwork';



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
});

const ButtonsWrapper = styled.div({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
})

export default function PackManagment(){
    const {language, user, getUser} = useMainContext();
    const params = useRef(new URLSearchParams(window.location.search));
    const Navigate = useNavigate(); 
    const [isFetching,setFecthing] = useState(true);
    const [isFilled, setIsFilled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isDisabled] = useState(params.current.get('disabled') ? true : false);
    const [isEdit, setIsEdit] = useState(params.current.get('edit') ? true : false);
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

    useEffect(()=>{window.onbeforeunload = ()=>{return 'test'}},[])

    useEffect(()=>{
        if(pack.packName && pack.packItems.length > 0){
            setIsFilled(true);
        }else{
            setIsFilled(false);
        }
    },[setIsFilled, pack])

    useEffect(()=>{
        setFecthing(true);
        if(isDisabled || isEdit){
            getPack().then(res=>{
                setFecthing(false);
            })
        }else{
            setFecthing(false)
        }
    },[isDisabled, isEdit])

    const getTitle = ()=>{
        if(params.current.get('edit')){
            return language ? 'ערוך מארז' : 'Edit Pack';
        }else if(params.current.get('disabled')){
            return language ? 'צפה במארז' : 'View Pack';
        }else{
            return language ? 'צור מארז' : 'Create Pack';
        }
    }
    
    const createPack = ()=>{
        setIsLoading(true);
        FilesNetwork.createPack(pack).then(res=>{
            if(res){
                Navigate('/packs');
            }else{
                setShowError(true);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.error(err);
        })
    }

    const updatePack = ()=>{
        setIsLoading(true);
        FilesNetwork.updatePack(pack).then(res=>{
            if(res){
                Navigate('/packs')
            }
        }).catch(err=>{
            console.error(err);
            setIsLoading(false);
            setShowError(true);
        })
    }

    const getPack = async ()=>{
        FilesNetwork.getPackById(params.current.get('packid')).then(currPack=>{
            if(currPack){
                setPack(currPack);
            }
        });
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
                        {...(isDisabled || isEdit) && {focused: true}}
                        value={pack.packName}
                        autoComplete={'off'}
                        variant="standard"
                        label={language ? 'שם מארז' : 'Pack name'}
                        color='success'
                        inputProps={
                            { readOnly: isDisabled }
                        }
                    />
                    <ListWrapper>
                        <ButtonsWrapper>
                            <Button 
                                variant='contained' 
                                color="success" 
                                startIcon={<Add />}
                                sx={{width: "50%"}}
                                onClick={()=> setShowPopup(true)}
                                disabled={isDisabled}
                            >
                                {language ? 'הוסף קבצים' : 'Add Files'}
                            </Button>
                            <FormControlLabel 
                                control={<Checkbox 
                                            color='success' 
                                            onChange={e=> setPack(prev=> ({...prev, isPublic: e.target.checked}))}
                                            checked={pack.isPublic && 'checked' }
                                            disabled={isDisabled}
                                        />}
                                label={language ? 'מארז ציבורי?' : 'Public pack?'}
                            />
                        </ButtonsWrapper>
                        {pack.packItems.length > 0 ?
                            <SelectFilesList 
                                files={pack.packItems}
                            />
                        :
                            <Paragraph marginTop="40%" fontSize="2.5vmax">
                                לא נוספו קבצים
                            </Paragraph>
                        }
                    </ListWrapper>
                   {!isDisabled && <Button
                        variant='contained'
                        color='success'
                        disabled={!isFilled}
                        sx={{width: "90%"}}
                        onClick={()=>{isEdit ? updatePack() : createPack()}}
                        startIcon={<Upload />}
                    >
                       {isLoading ? <CircularProgress size={"3.5vmax"} sx={{color: 'white'}} /> : getTitle()}
                    </Button>}
                    {showError && 
                        <ErrorLabel>{language ? `קרתה תקלה ${isEdit ? 'בעריכת': 'ביצירת'} המארז, נסו שנית מאוחר יותר`
                            : 'Something went wrong, try again later' }</ErrorLabel>}
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
                <SelectFilesPopup 
                    setPack={setPack} 
                    setShowPopup={setShowPopup} 
                    pack={pack}
                />
            </PopupBase>
        }
        </PageWrapper>
    )
}