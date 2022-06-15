import React, {useState,useEffect} from "react";
import {Card} from '../../components/globalStyles/styles';
import {CardWrapper, FormWrapper} from './styles'
import ValidateOtp from "../../components/ValidateOtp/ValidateOtp";
import CreateNewPassword from "../../components/CreateNewPassword/CreateNewPassword";


export default function ResetPassword(){
    const [otpValidated, setOtpValidated] = useState(false);

    useEffect(()=>{
        if(sessionStorage.getItem('otp')){
            setOtpValidated(true);
        }
    }, [])

    return (
    <>
        <CardWrapper>
            <Card height="55vmax" width="95%">
                <FormWrapper marginTop={otpValidated ? "10%" : "18%"}>
                    {!otpValidated ? 
                        <ValidateOtp setValidateOtp={setOtpValidated} /> :
                        <CreateNewPassword />
                    }
                </FormWrapper>
            </Card>
        </CardWrapper>
    </>)
}