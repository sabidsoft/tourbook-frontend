import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import FormInput from "../../components/forms/ui/formInput/FormInput";
import FormErrorMessage from "../../components/forms/ui/formErrorMessage/FormErrorMessage";
import FormSubmitButton from "../../components/forms/ui/formSubmitButton/FormSubmitButton";
import { inputStyle } from "../../assets/styles/inputStyle";
import { InitialState } from "./types";
import { Link, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/features/api/userApi/userApi";
import Loader from "../../components/common/loader/Loader";

// initialState
const initialState: InitialState = {
    password: "",
    confirmPassword: "",
};

export default function ResetPassword() {
    const [formData, setFormData] = useState(initialState);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchParams] = useSearchParams();
    const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();

    const resetPasswordToken = searchParams.get("resetPasswordToken") as string;
    const userId = searchParams.get("userId") as string;

    const { password, confirmPassword } = formData;

    // handling input elements values
    const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // handling form submit
    const onFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setErrorMessage("");

        if (!password)
            return setErrorMessage("Password is required.");

        if (password.length < 6)
            return setErrorMessage("Password should be at least 6 characters long.");

        if (password.length > 40)
            return setErrorMessage("Password is too long.");

        if (!confirmPassword)
            return setErrorMessage("Confirm password is required.");

        if (password !== confirmPassword)
            return setErrorMessage("Password and confirm password didn't match.");

        resetPassword({ password, resetPasswordToken, userId });
    };

    useEffect(() => {
        if (isSuccess) {
            setIsPasswordReset(true);
        }

        if (error) {
            if ("status" in error) {
                const errMsgJSONString = 'error' in error ? error.error : JSON.stringify(error.data);
                const errMsgJSObj = JSON.parse(errMsgJSONString);
                setErrorMessage(errMsgJSObj.message);
            }
        }
    }, [isSuccess, error])

    if (isLoading)
        return <Loader />;

    return (
        <div className="mt-24 pb-8">
            <div className="w-[90%] sm:w-[570px] mx-auto py-5 px-6 shadow-md rounded-lg">
                <div className="flex flex-col justify-center items-center mb-8">
                    <h2 className="font-medium text-2xl text-[#6B6F70]">
                        {isPasswordReset ? "Password Reset Successful" : "Reset Password"}
                    </h2>
                </div>
                {
                    !isPasswordReset &&
                    <form onSubmit={onFormSubmit}>
                        <FormInput
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            className={inputStyle}
                            onChange={onInputChange}
                        />

                        <FormInput
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            className={inputStyle}
                            onChange={onInputChange}
                        />

                        {errorMessage && <FormErrorMessage message={errorMessage} />}
                        <FormSubmitButton value="Reset Password" />
                    </form>
                }

                {
                    isPasswordReset &&
                    <p className="mb-2 -mt-4 text-[#6B6F70] text-center">
                        Your password have updated.
                        &nbsp;
                        <Link
                            to="/signin"
                            className="inline-block text-[#4761A7] hover:underline"
                        >
                            Click here to login.
                        </Link>
                    </p>
                }
            </div>
        </div>
    )
}