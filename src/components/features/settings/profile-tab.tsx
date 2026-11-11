import { useAppForm } from '@/components/shared/forms/form-context'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Camera } from 'lucide-react'
import * as z from 'zod'

const profileSchema = z.object({
    image: z.string(),
    name: z.string().min(2, 'Enter your full name'),
    email: z.email('Enter a valid email address'),
})

interface ProfileTabProps {
    user: {
        image: string
        name: string
        email: string
    }
    onUpdateProfile: (data: { name: string; image: string }) => Promise<unknown>
    isUpdating: boolean
}

export function ProfileTab({ user, onUpdateProfile, isUpdating }: ProfileTabProps) {
    const form = useAppForm({
        defaultValues: {
            image: user.image,
            name: user.name,
            email: user.email,
        },
        validators: { onChange: profileSchema },
        onSubmit: async ({ value }) => {
            await onUpdateProfile({
                name: value.name,
                image: value.image,
            })
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-5"
        >
            <div className="flex items-center gap-2 -ml-2">
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Go back">
                    <ArrowLeft className="size-4" />
                </Button>
                <h3 className="text-xl font-semibold text-foreground">Profile</h3>
            </div>

            <Separator />

            {/* Avatar Upload */}
            <div className="flex justify-center my-4">
                <div className="relative group cursor-pointer inline-block">
                    <form.AppField name="image">{(field) => <field.FormAvatar folder="owner" />}</form.AppField>
                    <div className="absolute inset-0 bg-foreground/40 rounded-full flex items-center justify-center pointer-events-none">
                        <Camera className="size-5 text-primary-foreground" />
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
                <form.AppField name="name">
                    {(field) => (
                        <div className="relative">
                            <field.FormInput label="Full Name" placeholder="Enter your name" />
                        </div>
                    )}
                </form.AppField>

                <form.AppField name="email">
                    {(field) => (
                        <div className="relative">
                            <field.FormInput type="email" label="Email Address" placeholder="Enter your email" readOnly />
                        </div>
                    )}
                </form.AppField>
            </div>

            {/* Save Button */}
            <div className="mt-4">
                <form.AppForm>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={form.state.isSubmitting || isUpdating}
                        className="w-full sm:w-[350px]"
                    >
                        Save
                    </Button>
                </form.AppForm>
            </div>
        </form>
    )
}
