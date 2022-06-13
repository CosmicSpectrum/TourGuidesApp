import styled from "styled-components";

export const CardWrapper = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10%"
})

export const FormWrapper = styled.div(({marginTop}) => ({
    marginTop
}))