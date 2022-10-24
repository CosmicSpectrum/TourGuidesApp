import styled from "styled-components";

export const RoomWrapper = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "5%"
})

export const MicButtonWrappers = styled.div({
    display: 'flex',
    width: "100%",
    justifyContent: "space-around"
})

export const StreamAudio = styled.audio({});

export const EndButtonWrapper = styled.div({
    display: 'flex',
    justifyContent: "center",
    marginTop: "40%"
})

export const DescriptionWrapper = styled.div({
    overflowY: 'auto',
    maxHeight: "30%",
    margin: '0 auto',
    width: "95%",
    direction: "ltr"
})

export const FilesViewWrapper = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
})