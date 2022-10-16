import React, {useState} from 'react';
import { Title} from '../globalStyles/styles';
import { TextField, Button } from '@mui/material';
import { useMainContext } from '../../context/appContext';
import SelectFilesList from '../SelectFilesList/SelectFilesList';
import styled from 'styled-components';

const FormWrapper = styled.div(({language})=>({
    display: 'flex',
    alignItems: "center",
    flexDirection: "column",
    direction: language ? 'rtl' : 'ltr'
}))

export default function SelectFilesPopup({setPack, setShowPopup, pack}){
    const {language} = useMainContext();
    const [selectedFiles, setSelectedFiles] = useState(pack.packItems);
    const [searchResults, setSearchResults] = useState([])
    const [files, setFiles] = useState([]);


    const updatePackItems = ()=>{
        setPack(prev=>{
            return {...prev, packItems: selectedFiles};
        });
        setShowPopup(false)
    }

    const searchFile = (e)=>{
        setSearchResults(files.filter(file=> file.fileName.includes(e.target.value)))
    }

    return (
        <>
            <Title fontSize="3vmax">
                {language ? 'בחר קבצים' : 'Pick Files'}
            </Title>
            <FormWrapper language={language} >
                <TextField
                    sx={{width: "90%"}}
                    id={'searchFile'}
                    onChange={searchFile}
                    autoComplete={'off'}
                    variant="standard"
                    label={language ? 'חפש קובץ' : 'Search a file'}
                    color='success'
                />
                <SelectFilesList 
                    setSelectedFiles={setSelectedFiles} 
                    selectedFiles={selectedFiles}
                    files={searchResults.length > 0 ? searchResults : files}
                    setFiles={setFiles}
                    showCheckbox={true}
                />
                <Button
                    variant='contained'
                    color="success"
                    sx={{width: "90%"}}
                    onClick={()=>updatePackItems()}
                >
                    {language ? 'בחר קבצים' : 'Choose Files'}
                </Button>
            </FormWrapper>
        </>
    )
}