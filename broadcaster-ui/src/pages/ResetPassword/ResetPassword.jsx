import React, {useState} from "react";
import {Card} from '../../components/globalStyles/styles';
import {CardWrapper, FormWrapper} from './styles'
import ValidateOtp from "../../components/ValidateOtp/ValidateOtp";
import CreateNewPassword from "../../components/CreateNewPassword/CreateNewPassword";


export default function ResetPassword(){
    const [isLoading, setIsLoading] = useState(false);
    const [otpValidated, setOtpValidated] = useState(true);

    return (
    <>
        <CardWrapper>
            <Card height="55vmax" width="95%">
                <FormWrapper marginTop={otpValidated ? "10%" : "18%"}>
                    {!otpValidated ? 
                        <ValidateOtp isLoading={isLoading} /> :
                        <CreateNewPassword isLoading={isLoading} />
                    }
                </FormWrapper>
            </Card>
        </CardWrapper>
    </>)
}