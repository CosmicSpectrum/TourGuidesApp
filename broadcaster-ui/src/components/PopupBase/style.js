import styled from 'styled-components';

export const PopupOverlay = styled.div({
    height: "100%",
    width: '100%',
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute", 
    top: 0,
    zIndex: "3000",
    display: "flex",
    justifyContent: 'center',
    alignItems: "center"
});

export const PopupBody = styled.div(({lagnuage, height,width})=>({
    height,
    width,
    borderRadius: "15px",
    backgroundColor: "white",
    border: "2px solid #2e7d32",
    direction: lagnuage ? 'rtl' : 'ltr'
}))