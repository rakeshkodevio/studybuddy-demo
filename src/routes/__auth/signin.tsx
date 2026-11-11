import { useAppForm } from '@/components/shared/forms/form-context'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { authApi } from '@/api/auth'
import { EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/__auth/signin')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    const signinSchema = z.object({
        email: z.string().email('Please enter a valid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    })

    const signIn = useMutation({
        mutationFn: async (payload: { email: string; password: string }) => {
            return authApi.signIn(payload.email, payload.password)
        },
        onSuccess: async (session) => {
            toast.success(`Welcome back, ${session.user.name || 'Scholar'}!`)
            navigate({ to: '/' })
        },
        onError: (error: Error, variables) => {
            if (error.message.toLowerCase().includes('verify your email')) {
                toast.error(error.message, {
                    action: {
                        label: 'Verify Now',
                        onClick: () =>
                            navigate({
                                to: '/verification',
                                search: { user: variables.email, type: 'signup' },
                            }),
                    },
                    duration: 8000,
                })
            } else {
                toast.error(error.message || 'Invalid email or password')
            }
        },
    })

    const form = useAppForm({
        defaultValues: { email: '', password: '' },
        validators: { onChange: signinSchema },
        onSubmit: async ({ value }) => {
            await signIn.mutateAsync({
                email: value.email,
                password: value.password,
            })
        },
    })

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>StudyBuddy Learning Platform</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Sign In to StudyBuddy</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Access your question banks, live model tests & study streaks.
                </p>
            </div>

            <form
                className="flex flex-col gap-5"
                autoComplete="off"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <form.AppField name="email">
                    {(field) => <field.FormInput type="email" label="Email Address" placeholder="Enter your email" />}
                </form.AppField>

                <form.AppField name="password">
                    {(field) => (
                        <field.FormInput
                            type="password"
                            label="Password"
                            iconRight={
                                <Button type="button" variant="ghost" size="icon" aria-label="Toggle password visibility">
                                    <EyeOff className="w-4 h-4" />
                                </Button>
                            }
                            placeholder="Enter your password"
                        />
                    )}
                </form.AppField>

                <div className="flex items-center justify-between py-1">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="rounded-sm border-muted-foreground/30 text-emerald-700 focus:ring-emerald-700 bg-transparent"
                        />
                        Remember me
                    </label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <div className="flex flex-col gap-2.5">
                    <form.AppForm>
                        <form.FormSubmit
                            label={signIn.isPending ? 'Signing In...' : 'Sign In'}
                            className="w-full h-12 text-base font-semibold rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-md border-none"
                        />
                    </form.AppForm>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            form.setFieldValue('email', 'rakesh.kodevio@gmail.com')
                            form.setFieldValue('password', 'StudyBuddy2026!')
                            toast.info('Demo credentials filled! Click Sign In or submit.', {
                                description: 'Email: rakesh.kodevio@gmail.com',
                            })
                        }}
                        className="w-full h-10 text-xs font-medium rounded-full border-dashed border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    >
                        ⚡ Fill StudyBuddy Demo Credentials
                    </Button>
                </div>
            </form>

            <div className="text-center text-sm text-muted-foreground mt-2">
                Don't have an account yet?{' '}
                <Link to="/signup" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                    Create an Account
                </Link>
            </div>
        </div>
    )
}

