import { useAppForm } from '@/components/shared/forms/form-context'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { authApi } from '@/api/auth'
import { EyeOff, UserPlus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/__auth/signup')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    const signupSchema = z
        .object({
            name: z
                .string()
                .min(2, 'Name must be at least 2 characters')
                .max(64, 'Name must be at most 64 characters'),
            email: z.string().email('Please enter a valid email address'),
            password: z
                .string()
                .min(8, 'Password must be at least 8 characters')
                .max(32, 'Password must be at most 32 characters'),
            confirmPassword: z.string().min(1, 'Please confirm your password'),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ['confirmPassword'],
        })

    const signUp = useMutation({
        mutationFn: async (payload: { name: string; email: string; password: string }) => {
            return authApi.signUp(payload.name, payload.email, payload.password)
        },
        onSuccess: (_data, variables) => {
            toast.success('Account created! Verification code sent to your email.')
            navigate({
                to: '/verification',
                search: { user: variables.email, type: 'signup' },
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create account. Please try again.')
        },
    })

    const form = useAppForm({
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
        validators: { onChange: signupSchema },
        onSubmit: async ({ value }) => {
            await signUp.mutateAsync({
                name: value.name,
                email: value.email,
                password: value.password,
            })
        },
    })

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
                    <Sparkles className="size-3.5" />
                    <span>Join 140,000+ Active Learners</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Get access to authentic Question Bank, Live Model Tests & AI Doubt Solver.
                </p>
            </div>

            <form
                className="flex flex-col gap-4"
                autoComplete="off"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <form.AppField name="name">
                    {(field) => (
                        <field.FormInput
                            label="Full Name"
                            placeholder="e.g. Tanvir Ahmed"
                        />
                    )}
                </form.AppField>

                <form.AppField name="email">
                    {(field) => (
                        <field.FormInput
                            type="email"
                            label="Email Address"
                            placeholder="e.g. name@example.com"
                        />
                    )}
                </form.AppField>

                <form.AppField name="password">
                    {(field) => (
                        <field.FormInput
                            type="password"
                            label="Password (min 8 characters)"
                            placeholder="Create a strong password"
                            iconRight={
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Toggle password visibility"
                                >
                                    <EyeOff className="w-4 h-4" />
                                </Button>
                            }
                        />
                    )}
                </form.AppField>

                <form.AppField name="confirmPassword">
                    {(field) => (
                        <field.FormInput
                            type="password"
                            label="Confirm Password"
                            placeholder="Repeat your password"
                            iconRight={
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Toggle confirm password visibility"
                                >
                                    <EyeOff className="w-4 h-4" />
                                </Button>
                            }
                        />
                    )}
                </form.AppField>

                <div className="pt-2">
                    <form.AppForm>
                        <form.FormSubmit
                            label={signUp.isPending ? 'Creating Account...' : 'Sign Up'}
                            className="w-full h-12 text-base font-semibold rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-md border-none"
                        />
                    </form.AppForm>
                </div>
            </form>

            <div className="text-center text-sm text-muted-foreground mt-2">
                Already have an account?{' '}
                <Link to="/signin" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                    Sign In
                </Link>
            </div>
        </div>
    )
}
