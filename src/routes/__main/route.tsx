import { AppSidebar, SiteHeader } from '@/components/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { motionTokens } from '@/lib/motionTokens'
import { authApi, MOCK_ADMIN } from '@/api/auth'

export const Route = createFileRoute('/__main')({
    beforeLoad: () => {
        const session = authApi.getSessionSync()
        return { user: session?.user || MOCK_ADMIN }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { user } = Route.useRouteContext()
    const pathname = useRouterState({ select: (s) => s.location.pathname })

    return (
        <div className="[--header-height:calc(--spacing(14))] flex min-h-screen flex-col bg-background">
            <SidebarProvider className="flex flex-col min-h-screen">
                <TooltipProvider>
                    <SiteHeader />
                    <div className="flex flex-1 min-h-0">
                        <AppSidebar user={user} />
                        <SidebarInset className="min-w-0 flex-1 overflow-x-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={pathname}
                                    className="flex flex-1 flex-col gap-4 p-4 sm:p-6 min-w-0 w-full"
                                    initial={{ opacity: 0, scale: 0.99 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.99 }}
                                    transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                                >
                                    <Outlet />
                                </motion.div>
                            </AnimatePresence>
                        </SidebarInset>
                    </div>
                </TooltipProvider>
            </SidebarProvider>
        </div>
    )
}
