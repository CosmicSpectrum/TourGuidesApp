import React,{useState, useEffect} from 'react';
import {List, ListItem, CircularProgress, IconButton, Divider} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilesNetwork from '../../network/FilesNetwork';

export default ({type})=>{
    const [fetching,setFecthing] = useState(true);
    const [files, setFiles] = useState([]);

    useEffect(()=>{
       getUserFiles().then(res=>{
            setFecthing(false);
       })
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

    return (
        <>  
        {!fetching ?            
            <div style={{height: "60vh"}}>
                <List sx={{maxHeight: "100%", overflowY: 'auto'}}>
                    {files.map((file, index)=>(
                        <>
                            <ListItem sx={{justifyContent: "space-between"}} id={index}>
                                {file.fileName}
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
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