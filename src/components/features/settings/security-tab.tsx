import { useAppForm } from '@/components/shared/forms/form-context'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import * as z from 'zod'

const securitySchema = z.object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Re-enter your new password'),
})

interface SecurityTabProps {
    onChangePassword: (data: { currentPassword: string; newPassword: string; revokeOtherSessions: boolean }) => Promise<unknown>
    isChanging: boolean
}

export function SecurityTab({ onChangePassword, isChanging }: SecurityTabProps) {
    const [twoFactor, setTwoFactor] = useState(false)

    const form = useAppForm({
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
        validators: { onChange: securitySchema },
        onSubmit: async ({ value }) => {
            await onChangePassword({
                currentPassword: value.currentPassword,
                newPassword: value.newPassword,
                revokeOtherSessions: true,
            })
            form.reset()
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
            <div>
                <h3 className="text-xl font-semibold text-foreground">Security</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Manage your password and security settings.</p>
            </div>

            <Separator />

            {/* Change Password */}
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 max-w-md">
                    <form.AppField name="currentPassword">
                        {(field) => <field.FormInput type="password" label="Current Password" placeholder="Enter your current password" />}
                    </form.AppField>

                    <form.AppField name="newPassword">
                        {(field) => <field.FormInput type="password" label="New Password" placeholder="Create a new password" />}
                    </form.AppField>

                    <form.AppField name="confirmPassword">
                        {(field) => <field.FormInput type="password" label="Confirm Password" placeholder="Re-enter your new password" />}
                    </form.AppField>
                </div>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-success" />
                        Two-Factor Authentication
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-6">Add an extra layer of security to your account.</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
            <div className="mt-4">
                <form.AppForm>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={form.state.isSubmitting || isChanging}
                        className="w-full sm:w-[250px]"
                    >
                        Save Changes
                    </Button>
                </form.AppForm>
            </div>
        </form>
    )
}
