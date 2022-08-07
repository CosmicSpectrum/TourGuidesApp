import styled from "styled-components";

export const BarWrapper = styled.div({
    width: "100%",
    height: "10vmax",
    backgroundColor: "#2e7d32",
    position: "sticky",
})

export const UserLabelCenterWrapper = styled.div({
    position: 'absolute',
    margin: '0',
    top: "50%",
    right: '5px',
    transform: "translateY(-50%)"
})

export const LogoutCenterWrapper = styled.div(({language})=>({
    position: 'absolute',
    margin: '0',
    top: "50%",
    [language ? "left" : "right"]: '20px',
    transform: "translateY(-50%)"
}))

export const LanguageWrapper = styled.div(({language}) => ({
    position: 'absolute',
    margin: '0',
    top: "50%",
    [language ? "right" : "left"]: '30px',
    transform: "translateY(-50%)"
}))

export const LogoWrapper = styled.div({
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1
})

export const Image = styled.img({
    height: '9vmax'
})