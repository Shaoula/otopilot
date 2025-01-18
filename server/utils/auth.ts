import { betterAuth } from 'better-auth'
import { emailOTP } from "better-auth/plugins"
import { D1Dialect } from '@atinux/kysely-d1'
import { admin } from 'better-auth/plugins'

let _auth: ReturnType<typeof betterAuth>
export function serverAuth() {
    if (!_auth) {
        _auth = betterAuth({
            database: {
                dialect: new D1Dialect({
                    // @ts-ignore
                    database: hubDatabase(),
                }),
                type: 'sqlite',
            },
            secondaryStorage: {
                get: key => hubKV().getItemRaw(`_auth:${key}`),
                set: (key, value, ttl) => {
                    return hubKV().set(`_auth:${key}`, value, { ttl })
                },
                delete: key => hubKV().del(`_auth:${key}`),
            },
            baseURL: getBaseURL(),
            plugins: [
                admin(),
                emailOTP({
                    // disableSignUp: true,
                    async sendVerificationOTP({ email, otp }) {
                        await useResend().emails.send({
                            from: 'OtoPilot <noreply@otopilot.shaoula.com>',
                            to: email,
                            subject: "OtoPilot'a giriş yapmak için doğrulama kodunuz",
                            html: `
                            <!DOCTYPE html>
                            <html>
                                <head>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>OtoPilot Doğrulama Kodu</title>
                                </head>
                                <body style="margin: 0; padding: 20px; background-color: #f9fafb; font-family: Arial, sans-serif;">
                                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <img src="https://otopilot.shaoula.com/logo-dark.png" alt="OtoPilot Logo" style="display: block; margin: 0 auto 30px; max-width: 200px;">
                                        <h1 style="color: #111827; font-size: 24px; margin-bottom: 20px; text-align: center;">Doğrulama Kodunuz</h1>
                                        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 30px; text-align: center;">
                                            OtoPilot'a giriş yapmak için aşağıdaki doğrulama kodunu kullanın:
                                        </p>
                                        <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                                            <p style="color: #111827; font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 8px; margin: 0;">
                                                ${otp}
                                            </p>
                                        </div>
                                        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
                                            Bu kodu kimseyle paylaşmayın. Eğer giriş yapmaya çalışmıyorsanız, bu e-postayı görmezden gelebilirsiniz.
                                        </p>
                                    </div>
                                </body>
                            </html>
                        `,
                        })
                    }
                })],
        })
    }
    return _auth
}

function getBaseURL() {
    let baseURL = process.env.BETTER_AUTH_URL
    if (!baseURL) {
        try {
            baseURL = getRequestURL(useEvent()).origin
        }
        catch (e) { }
    }
    return baseURL
}