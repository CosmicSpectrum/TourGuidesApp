import React,{useState, useEffect} from 'react';
import {List, ListItem, CircularProgress, Divider} from '@mui/material';
import FilesNetwork from '../../network/FilesNetwork';
import PackMenu from './Menu/PackMenu';

export default function PackList ({type, packs, setPacks}){
    const [fetching,setFecthing] = useState(true);

    useEffect(()=>{
        if(type){
            getUserPacks().then(res=>{
                 setFecthing(false);
            })
        }else{
            getPublicPacks().then(res=>{
                setFecthing(false);
            })
        }
    },[])

    const getUserPacks = async ()=>{
        return FilesNetwork.getUserPacks().then(packs=>{
            if(packs){
                setPacks(packs);
        }
        }).catch(err=>{
            console.error(err);
        })
    }

    const getPublicPacks = async ()=>{
        return FilesNetwork.getPublicPacks().then(packs=>{
            if(packs){
                setPacks(packs);
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
                    {packs.map((pack, index)=>(
                        <>
                            <ListItem sx={{justifyContent: "space-between"}} id={index}>
                                {pack.packName}
                                <PackMenu setPacks={setPacks} pack={pack} />
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