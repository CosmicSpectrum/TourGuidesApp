import React,{useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMainContext } from '../../../context/appContext';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilesNetwork from '../../../network/FilesNetwork';
import SaveAs from 'file-saver';

export default function FileMenu({file, setFiles}){
  const [anchorEl, setAnchorEl] = useState(null);
  const {user, language} = useMainContext();
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadFile = ()=>{
    FilesNetwork.download(file.uid).then(s3Blob=>{
        SaveAs(s3Blob);
    }).catch(err=>{
        console.error(err);
    })
  }

  const deleteFile = ()=>{
    FilesNetwork.delete(file.uid).then(status =>{
        if(status){
            setFiles(prev=>{
                const index = prev.findIndex(currFile => currFile.uid === file.uid );
                prev.splice(index, 1);
                return prev;
            });
        }
    }).catch(err=>{
        console.error(err);
    })
  }

  return(
    <div>
        <IconButton
         id="file-menu"
         aria-controls={open ? 'basic-menu' : undefined}
         aria-haspopup="true"
         aria-expanded={open ? 'true' : undefined}
         onClick={handleClick}
        >
            <MoreVertIcon />
        </IconButton>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'file-menu',
            }}
        >
            <MenuItem onClick={()=>{handleClose(); downloadFile(file);}}>
                {
                <>
                    <GetAppIcon /> 
                    {language ? "הורדה" : 'Download'}
                </>
                }
            </MenuItem>
            {
                user?._id === file.fileOwner &&
                [
                    <MenuItem onClick={()=>{handleClose(); deleteFile();}}>
                        <>
                            <DeleteIcon />
                            {language ? "מחק קובץ" : 'Delete File'}
                        </>
                    </MenuItem>,
                    <MenuItem onClick={handleClose}>
                        <>
                            <EditIcon />
                            {language ? "ערוך קובץ" : 'Edit File'}
                        </>
                    </MenuItem>
                ].map(item => {
                    return item
                })
            }
        </Menu>
    </div>
  )
}