import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { SlidersHorizontal, User, ShieldCheck, FileText, FileSignature } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GeneralTab } from '@/components/features/settings/general-tab'
import { ProfileTab } from '@/components/features/settings/profile-tab'
import { SecurityTab } from '@/components/features/settings/security-tab'
import { StaticContentTab } from '@/components/features/settings/static-content-tab'
import { staticContentApi } from '@/api/settings'
import { authApi } from '@/api/auth'

export const Route = createFileRoute('/__main/settings')({
    component: RouteComponent,
})

const TABS = [
    { id: 'general', label: 'General', icon: SlidersHorizontal },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: FileText },
    { id: 'terms-and-conditions', label: 'Terms & Conditions', icon: FileSignature },
] as const

type TabId = (typeof TABS)[number]['id']

function RouteComponent() {
    const [activeTab, setActiveTab] = useState<TabId>('general')
    const { user } = Route.useRouteContext()
    const queryClient = useQueryClient()

    // ── Profile mutations ───────────────────────────────────────────────
    const updateProfile = useMutation({
        mutationFn: async (data: { name: string; image: string }) => {
            return authApi.updateUser({ name: data.name, image: data.image })
        },
        onSuccess: () => toast.success('Profile updated successfully'),
        onError: (error: Error) => toast.error(error.message || 'Failed to update profile'),
    })

    // ── Security mutations ──────────────────────────────────────────────
    const changePassword = useMutation({
        mutationFn: async (data: { currentPassword: string; newPassword: string; revokeOtherSessions: boolean }) => {
            return authApi.changePassword(data.currentPassword, data.newPassword)
        },
        onSuccess: (data) => toast.success(data.message || 'Password changed successfully'),
        onError: (error: Error) => toast.error(error.message || 'Failed to change password'),
    })

    // ── Static content queries & mutations ──────────────────────────────
    const privacyPolicyQuery = useQuery({
        queryKey: ['static-content', 'privacy-policy'],
        queryFn: () => staticContentApi.get('privacy-policy'),
    })

    const termsQuery = useQuery({
        queryKey: ['static-content', 'terms-and-conditions'],
        queryFn: () => staticContentApi.get('terms-and-conditions'),
    })

    const updateStaticContent = useMutation({
        mutationFn: ({ slug, title, content }: { slug: string; title: string; content: string }) =>
            staticContentApi.update(slug, { slug, title, content }),
        onSuccess: () => {
            toast.success('Content updated successfully')
            queryClient.invalidateQueries({ queryKey: ['static-content'] })
        },
        onError: () => toast.error('Failed to update content'),
    })

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-5">
                {/* Left Sidebar Tabs */}
                <nav className="flex flex-row md:flex-col gap-2 bg-card border rounded-xl p-3 h-fit overflow-x-auto">
                    {TABS.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <Button
                                key={tab.id}
                                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                                onClick={() => setActiveTab(tab.id)}
                                className={`justify-start gap-3 h-11 ${activeTab === tab.id ? 'bg-muted/50' : ''}`}
                            >
                                <Icon className="size-4" />
                                {tab.label}
                            </Button>
                        )
                    })}
                </nav>

                {/* Right Content Area */}
                <div className="border rounded-xl bg-card p-6 min-h-[500px]">
                    {activeTab === 'general' && <GeneralTab />}
                    {activeTab === 'profile' && (
                        <ProfileTab user={user} onUpdateProfile={updateProfile.mutateAsync} isUpdating={updateProfile.isPending} />
                    )}
                    {activeTab === 'security' && (
                        <SecurityTab onChangePassword={changePassword.mutateAsync} isChanging={changePassword.isPending} />
                    )}
                    {activeTab === 'privacy-policy' && (
                        <StaticContentTab
                            slug="privacy-policy"
                            title="Privacy Policy"
                            description="Manage the application's privacy policy."
                            data={privacyPolicyQuery.data}
                            isLoading={privacyPolicyQuery.isLoading}
                            error={privacyPolicyQuery.error}
                            onUpdate={(content) =>
                                updateStaticContent.mutate({
                                    slug: 'privacy-policy',
                                    title: 'Privacy Policy',
                                    content,
                                })
                            }
                            isUpdating={updateStaticContent.isPending}
                        />
                    )}
                    {activeTab === 'terms-and-conditions' && (
                        <StaticContentTab
                            slug="terms-and-conditions"
                            title="Terms & Conditions"
                            description="Manage the application's terms and conditions."
                            data={termsQuery.data}
                            isLoading={termsQuery.isLoading}
                            error={termsQuery.error}
                            onUpdate={(content) =>
                                updateStaticContent.mutate({
                                    slug: 'terms-and-conditions',
                                    title: 'Terms & Conditions',
                                    content,
                                })
                            }
                            isUpdating={updateStaticContent.isPending}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
