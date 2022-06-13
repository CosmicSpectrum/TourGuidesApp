import styled from "styled-components";

export const Title = styled.p(({fontSize})=>({
    fontSize,
    textAlign: "center",
    color: "#00aa45"
}))

export const Card = styled.div(({width, height})=>({
    width,
    height,
    boxShadow: "1px 2px 14px 4px rgba(0,0,0,0.30)",
    borderRadius: '1rem'
}))