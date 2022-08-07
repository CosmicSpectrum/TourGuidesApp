import React, {useState} from 'react'
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useMainContext } from '../../../context/appContext';
import List from "@mui/material/List"
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LanguageIcon from '@mui/icons-material/Language';
import {Image} from '../style'
import imageSrc from '../../../media/greenLogo.png';
import Cookie from 'js-cookie'
import { Divider } from '@mui/material';




export default ()=>{
    const {language, user, setLanguage} = useMainContext();
    const [anchor, setAnchor] = useState(language ? "left": "right");
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const LIST_TITLES_HE = [
    ...(user) ? ['העלאת עזרים'] : [],
    ...(user) ? ['חבילות עזרי הדרכה'] : [],
    'English'];
    const LIST_TITLES_EN = [
        ...(user) ? ['Upload Guide Helpers'] : [],
         ...(user) ?['Guide Packs'] : [],
          'עברית'];
    
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
      };

    const menuIcon = (index)=>{
        switch(index){
            case 0:
                if(getTitles().length === 1){
                    return <LanguageIcon />
                }
                return <FileUploadIcon />
            case 1: 
                return <Inventory2Icon />
            default:
                return <LanguageIcon />
        }
    }

    const getTitles = ()=>{
        return language ? LIST_TITLES_HE : LIST_TITLES_EN;
    }

      const list = (anchor)=>{
        return(
            <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            className="font"
          >
            <List>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <Image src={imageSrc} />
            </div>
            <Divider />
            {getTitles().map((text, index) => (
              <ListItem className='font' key={text} disablePadding 
                onClick={
                    ()=>{
                        if(index === 2 || getTitles().length === 1) 
                        {
                            Cookie.set("language", !language, {expires: 99999}); 
                            setLanguage(!language); 
                        }}}>
                <ListItemButton>
                  <ListItemIcon>
                    {menuIcon(index)}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
            <div style={{position: 'fixed', bottom: 0, width: '100%'}}>
                <Divider />
                <label style={{...(language) ? {marginRight: '5px'} : {marginLeft: "5px"}}}>
                    {language ? 
                        'פותח על ידי - הראל דגן 2022' : 
                        'Developed by - Harel Dagan 2022'}
                </label>
            </div>
          </List>
          </Box>
        )
      }

      return(
        <>
            <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={toggleDrawer(anchor, true)}
                >
                    <MenuIcon />
            </IconButton>
            <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
        >
            {list(anchor)}
        </Drawer>
        </>
      )
}