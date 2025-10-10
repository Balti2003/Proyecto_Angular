import { LoginResponse } from "@/app/models/auth.model";

export const AuthAdapter = (loginData: LoginResponse) => ({
    accesToken: loginData.accesToken,
    refreshToken: loginData.refreshToken
});