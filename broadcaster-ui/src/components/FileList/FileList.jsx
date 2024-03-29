import React,{useState, useEffect} from 'react';
import {List, ListItem, CircularProgress, Divider} from '@mui/material';
import FilesNetwork from '../../network/FilesNetwork';
import FileMene from './Menu/Menu';
import getFileType from '../../utils/getFileType';
import { useMainContext } from '../../context/appContext';

export default function FileList ({type, files, setFiles}){
    const [fetching,setFecthing] = useState(true);
    const {language} = useMainContext();

    useEffect(()=>{
        if(type){
            getUserFiles().then(res=>{
                 setFecthing(false);
            })
        }else{
            getPublicFiles().then(res=>{
                setFecthing(false);
            })
        }
    },[])

    const getUserFiles = async ()=>{
        return FilesNetwork.getUserFiles().then(files=>{
            if(files){
                setFiles(files);
        }
        }).catch(err=>{
            console.error(err);
        })
    }

    const getPublicFiles = async ()=>{
        return FilesNetwork.getPublicFiles().then(files=>{
            if(files){
                setFiles(files);
            }
        }).catch(err=>{
            console.error(err);
        })
    }

    return (
        <>  
        {!fetching ?            
            <div style={{height: "60vh"}}>
                <List sx={{maxHeight: "100%", overflowY: 'auto'}}>
                    {files.map((file, index)=>(
                        <>
                            <ListItem sx={{justifyContent: "space-between"}} id={index}>
                                <div style={{width: '33%'}}>{file.fileName}</div>
                                <div>{getFileType(file.mimeType, language)}</div>
                                <FileMene setFiles={setFiles} file={file} />
                            </ListItem>
                            <Divider />
                        </>
                    ))}
                </List>
            </div> :
             <div 
                style={{width: "100%", 
                display:"flex", 
                justifyContent: "center",
                marginTop: "50%"}}>
                    <CircularProgress color="success" />
                </div>
        }
        </>
    )

}