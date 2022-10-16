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
import AddIcon from '@mui/icons-material/Add';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';




export default function AppDrawer(){
    const {language, user, setLanguage} = useMainContext();
    const [anchor, setAnchor] = useState(language ? "left": "right");
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const Navigate = useNavigate();

    const LOGED_IN_TITLES_HE = [
    ...(window.location.pathname !== '/files') ? ['העלאת עזרים'] : ['יצירת חדר'],
    ...(window.location.pathname !== '/packs') ? ['מארזי עזרי הדרכה'] : ['יצירת חדר'],
    'English'];
    const LOGED_IN_TITLES_EN = [
        ...(window.location.pathname !== '/files') ? ['Upload Guide Helpers'] : ["Create Room"],
        ...(window.location.pathname !== '/packs') ? ['Guide Packs'] : ['Create Room'],
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
                return window.location.pathname === "/files" ? <AddIcon /> : <FileUploadIcon />
            case 1: 
                return window.location.pathname === '/packs' ? <AddIcon /> : <Inventory2Icon />
            default:
                return <LanguageIcon />
        }
    }

    const navigation = (text)=>{
      if(window.onbeforeunload){
        window.onbeforeunload = null;
      }

      switch(text){
        case 'יצירת חדר':
          return '/createRoom';
        case 'Create Room':
          return '/createRoom';
        case 'העלאת עזרים':
          return '/files';
        case 'Upload Guide Helpers':
          return '/files';
        case 'מארזי עזרי הדרכה':
          return '/packs';
        case 'Guide Packs':
          return '/packs'
        default:
          break;
      }
    }

    const getTitles = ()=>{
        if(user){
          return language ? LOGED_IN_TITLES_HE : LOGED_IN_TITLES_EN;
        }else{
          return language ? ['English'] : ['עברית']
        }
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
                        }else{
                          Navigate(navigation(text));
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