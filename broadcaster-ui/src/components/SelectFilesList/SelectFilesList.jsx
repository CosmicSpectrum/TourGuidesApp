import React,{useState, useEffect} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { CircularProgress } from '@mui/material';
import FilesNetwork from '../../network/FilesNetwork';
import { FetchingWrapper } from '../../pages/CreateRoom/styles';
import getFileType from '../../utils/getFileType';
import { useMainContext } from '../../context/appContext';

export default function SelectFilesList({ selectedFiles, setSelectedFiles,files,setFiles, showCheckbox}){
    const [isFetching, setIsFetching] = useState(true);
    const {language} = useMainContext();

    useEffect(()=>{
        if(showCheckbox){
            Promise.all([FilesNetwork.getUserFiles(), FilesNetwork.getPublicFiles()]).then(res=>{
                arrayFilter(res[0], res[1])
                const filtered = [...res[0], ...res[1]];
                setFiles(filtered);
                setIsFetching(false);
            })
        }else{
            setIsFetching(false)
        }
    },[])

    const arrayFilter = (res1, res2)=>{
        for(let i = 0; i < res2.length; i++){
            for(let j = 0; j< res1.length; j++){
                if(res2[i]?._id === res1[j]?._id){
                    res2?.splice(i, 1);
                }
            }
        }
    }

    const handleToggle = (value) => () => {
        const currentIndex = selectedFiles.findIndex(currFile => value._id === currFile._id);
        const newChecked = [...selectedFiles];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

        setSelectedFiles(newChecked);
      };

    return (
        <div style={{height: '45vmax', width: '100%'}}>
            {!isFetching ? 
                <List sx={{overflowY: 'auto', height: '95%'}}>
                    {
                        files.map(file=>(
                            <ListItem
                            id={file._id}
                            disablePadding
                            >
                                <ListItemButton role={undefined} onClick={showCheckbox && handleToggle(file)} dense>
                                    {showCheckbox &&  
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={selectedFiles.findIndex(currFile => file._id === currFile._id) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                color='success'
                                            />
                                        </ListItemIcon>
                                    }
                                    <ListItemText primary={file.fileName} secondary={getFileType(file.mimeType, language)} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List> :
                <FetchingWrapper>
                    <CircularProgress 
                        color='success'
                        size={50}
                    />
                </FetchingWrapper>
            }
        </div>
    )
}