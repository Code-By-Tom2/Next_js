import {z} from 'zod'

export const UsernameValidation = z
    .string()
    .min(5, "must be atleast 5 characters")
    .max(20, "must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"must not contain special characters")

export const signUpSchema = z.object({
    username: UsernameValidation,
    email: z.string().email({message: 'invalid email'}),
    password: z.string().min(8, {message: "must be atleast 8 characters"})
})    