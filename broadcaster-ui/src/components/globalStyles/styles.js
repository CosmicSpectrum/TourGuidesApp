import styled from "styled-components";

export const Title = styled.p(({fontSize,marginBottom})=>({
    fontSize,
    textAlign: "center",
    color: "#2e7d32",
    marginBottom
}))

export const Card = styled.div(({width,minHeight})=>({
    height: "fit-content",
    minHeight: minHeight ? minHeight : "87vh",
    boxShadow: "1px 2px 14px 4px rgba(0,0,0,0.30)",
    borderRadius: '1rem',
    width
}))

export const Label = styled.p(({marginTop})=>({
    textDecoration: "underline",
    color: "#cacccf",
    marginTop
}))

export const ErrorLabel = styled.label(({marginTop})=>({
    color: "red", 
    marginTop
}))

export const Paragraph = styled.p(({fontSize,textAlign,textColor, marginTop, marginRight,direction, marginLeft})=>({
    fontSize,
    color: !textColor ? '#2e7d32' : textColor,
    textAlign,
    marginTop,
    marginRight,
    marginLeft,
    direction
}))

export const inputDesign = {
    width: "70%",
    marginBottom: "2vmax"
}