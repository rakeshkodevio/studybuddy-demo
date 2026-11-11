import { Store } from 'lucide-react'
import { toast } from 'sonner'
import * as z from 'zod'
import { useAppForm } from '@/components/shared/forms/form-context'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const generalSchema = z.object({
    storeName: z.string().min(1, 'Enter the store name'),
    storeUrl: z.url('Enter a valid store URL'),
    supportEmail: z.email('Enter a valid support email'),
    currency: z.enum(['USD', 'GBP', 'EUR']),
    lowStockThreshold: z.number().min(1, 'Threshold must be at least 1'),
    orderNotifications: z.boolean(),
})

export function GeneralTab() {
    const form = useAppForm({
        defaultValues: {
            storeName: 'AZ Sports',
            storeUrl: 'https://azsports.com',
            supportEmail: 'support@azsports.com',
            currency: 'USD' as 'USD' | 'GBP' | 'EUR',
            lowStockThreshold: 10,
            orderNotifications: true,
        },
        validators: { onChange: generalSchema },
        onSubmit: async () => {
            toast.success('AZ Sports store settings saved')
        },
    })

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                form.handleSubmit()
            }}
            className="flex h-full flex-col gap-5"
        >
            <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Store className="size-5" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-foreground">Store Settings</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">Configure the AZ Sports storefront and operational defaults.</p>
                </div>
            </div>

            <Separator />

            <div className="grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
                <form.AppField name="storeName">
                    {(field) => <field.FormInput label="Store Name" placeholder="Enter store name" />}
                </form.AppField>
                <form.AppField name="storeUrl">
                    {(field) => <field.FormInput type="url" label="Store URL" placeholder="https://azsports.com" />}
                </form.AppField>
                <form.AppField name="supportEmail">
                    {(field) => <field.FormInput type="email" label="Support Email" placeholder="support@azsports.com" />}
                </form.AppField>
                <form.AppField name="currency">
                    {(field) => (
                        <field.FormSelect
                            label="Default Currency"
                            options={[
                                { label: 'US Dollar (USD)', value: 'USD' },
                                { label: 'British Pound (GBP)', value: 'GBP' },
                                { label: 'Euro (EUR)', value: 'EUR' },
                            ]}
                        />
                    )}
                </form.AppField>
                <form.AppField name="lowStockThreshold">
                    {(field) => <field.FormInput type="number" label="Low Stock Threshold" placeholder="10" />}
                </form.AppField>
                <div className="flex items-end pb-1">
                    <form.AppField name="orderNotifications">
                        {(field) => (
                            <field.FormSwitch
                                label="Order Notifications"
                                description="Notify administrators about new orders and fulfillment updates."
                            />
                        )}
                    </form.AppField>
                </div>
            </div>

            <div className="mt-2">
                <form.AppForm>
                    <Button type="submit" disabled={form.state.isSubmitting} className="w-full sm:w-64">
                        Save Store Settings
                    </Button>
                </form.AppForm>
            </div>
        </form>
    )
}
