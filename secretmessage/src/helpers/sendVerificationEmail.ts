import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'verification',
            react:VerificationEmail({username, otp: verifyCode}),
          });

        return{success:true, message: 'email send successfully'}
    } catch (emailError) {
        console.log("error in email verification",emailError);
        return{success:false, message: 'Failed to send email'}
    }
}