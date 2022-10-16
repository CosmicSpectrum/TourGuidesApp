import React, {useRef} from 'react';
import { Title, Paragraph} from '../globalStyles/styles';
import { TextField } from '@mui/material';
import { useMainContext } from '../../context/appContext';
import styled from 'styled-components';

const FormWrapper = styled.div(({language})=>({
    display: 'flex',
    alignItems: "center",
    flexDirection: "column"
}))

export default function SelectFilesPopup({setPack}){
    const {language} = useMainContext();

    return (
        <>
            <Title fontSize="3vmax">
                {language ? 'בחר קבצים' : 'Pick Files'}
            </Title>
            <FormWrapper language={language} >
                <TextField 
                    id={'searchFile'}
                    onChange={(e)=>{
                       
                    }}
                    autoComplete={'off'}
                    variant="standard"
                    label={language ? 'חפש קובץ' : 'Search a file'}
                    color='success'
                />
            </FormWrapper>
        </>
    )
}