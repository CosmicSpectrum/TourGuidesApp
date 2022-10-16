import React, {useState,useEffect} from 'react';
import styled from 'styled-components'
import {Title,Paragraph, inputDesign, ErrorLabel} from '../globalStyles/styles'
import { useMainContext } from '../../context/appContext';
import {TextField ,Button,Checkbox, FormControlLabel,CircularProgress} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FilesNetwork from '../../network/FilesNetwork';

const Wrapper = styled.div(({language})=>({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "90%",
    direction: language ? 'rtl' : 'ltr'
}))

const ButtonWrapper = styled.div(({language})=>({
    display: 'flex',
    justifyContent: "space-evenly",
    width: "100%"
}))

export default function UploadFilePopup({setFileList, setIsShown}){
    const {language, user} = useMainContext();
    const [fileInfo, setFileInfo] = useState({
        file: null,
        fileName: null,
        isPublic: false,
        fileOwner: user._id
    })
    const [readyToUpload, setReadyToUpload] = useState(false);
    const [uploadError, setUplaodError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        if(fileInfo.file && fileInfo.fileName){
            setReadyToUpload(true);
        }
    },[fileInfo])

    const UploadFile = ()=>{
        setIsLoading(true);
        FilesNetwork.upload(FormatFormData(fileInfo)).then(res=>{
            setIsLoading(false);
            if(res){
                setFileList(prev => ([...prev, {...fileInfo, uid: res}]))
                setIsShown(false);
            }
        }).catch(err=>{
            setIsLoading(false)
            setUplaodError(true);
        });
    }

    return (
        <Wrapper language={language}>
            <Title fontSize='3vmax' >
                {language ? 'העלאת קובץ' : 'Upload A File'}
            </Title>
            <Paragraph marginTop='0' >
                {language ? 'בחר קובץ להעלאה ממכשירך' : 'Pick a file to upload'}
            </Paragraph>
            <TextField 
                sx={inputDesign}
                id={'fileName'}
                onChange={(e)=>{
                    setFileInfo(prev=>{
                        return {...prev, fileName: e.target.value}
                    })
                }}
                autoComplete={'off'}
                variant="standard"
                label={language ? 'הכנס שם קובץ' : 'Insert file name'}
                color='success'
            />
            <ButtonWrapper>
                <Button variant="outlined" color='success' component="label" startIcon={<FileUploadIcon />}>
                    <input hidden type='file' onChange={(e=>{
                        if(e.target.files.length > 0){
                            setFileInfo(prev=>{
                                return {...prev, file: e.target.files[0]}
                            })
                        }
                    })} />
                    {language ? 'העלאה' : 'Upload'}
                </Button>
                <FormControlLabel 
                    control={<Checkbox color='success' onChange={e=> setFileInfo(prev=> ({...prev, isPublic: e.target.checked}))} />}
                    label={language ? 'קובץ פומבי?' : 'Public file?'}
                />
            </ButtonWrapper>
            <Button 
                variant='contained' 
                color="success" 
                sx={{marginTop: '5%'}}
                disabled={!readyToUpload}
                onClick={()=> !isLoading && UploadFile()}
            >
                {
                    isLoading ? <CircularProgress size={"3.5vmax"} sx={{color: 'white'}} />  :
                        language ? "שלח קובץ" : 'Send File'
                }
            </Button>
           {uploadError && 
                <ErrorLabel>
                    {
                        language ? 'קרתה תקלה בהעלאת הקובץ, נסו שנית מאוחר יותר.' 
                            : 'Something went wrong, try again later.'
                    }
                </ErrorLabel>
            }
        </Wrapper>
    )
}

const FormatFormData = (fileInfo)=>{
    const formData = new FormData();
    formData.append('file', fileInfo.file);
    formData.append('fileName', fileInfo.fileName);
    formData.append('isPublic', fileInfo.isPublic);
    formData.append('fileOwner', fileInfo.fileOwner);
    return formData
}