import React,{useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMainContext } from '../../../context/appContext';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import FilesNetwork from '../../../network/FilesNetwork';
import { useNavigate } from 'react-router-dom';

export default function PackMenu({pack, setPacks}){
  const [anchorEl, setAnchorEl] = useState(null);
  const {user, language} = useMainContext();
  const open = Boolean(anchorEl);
  const Navigation = useNavigate();
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const deletePack = (pack) => {
    FilesNetwork.deletePack(pack._id).then(res=>{
        if(res){
            setPacks(prev=>{
                return prev.filter(currPack => currPack._id !== pack._id);
            })
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
            <MenuItem onClick={()=>{handleClose(); Navigation(`/packManagment?disabled=true&packid=${pack._id}`)}}>
                {
                <>
                    <VisibilityIcon /> 
                    {language ? "צפה במארז" : 'View Pack'}
                </>
                }
            </MenuItem>
            {
                user?._id === pack.packOwner &&
                [
                    <MenuItem onClick={()=>{handleClose(); Navigation(`/packManagment?edit=true&packid=${pack._id}`)}}>
                        <>
                            <EditIcon />
                            {language ? "ערוך מארז" : 'Edit Pack'}
                        </>
                    </MenuItem>,
                    <MenuItem onClick={()=>{handleClose(); deletePack(pack);}}>
                    <>
                        <DeleteIcon />
                        {language ? "מחק מארז" : 'Delete Pack'}
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