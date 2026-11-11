import * as React from 'react'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AdminUser } from '@/types/user'
import { Check, ChevronsUpDown, GraduationCap, Plus } from 'lucide-react'
import { toast } from 'sonner'

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: AdminUser }) {
    const [selectedStream, setSelectedStream] = React.useState('HSC 2026 - Science')

    const streams = [
        { name: 'HSC 2026 - Science', type: 'NCTB Board Syllabus', active: true },
        { name: 'BUET & Engineering', type: 'Admission Blitz 2026', active: false },
        { name: 'Medical Admission', type: 'Biology & Chem Prep', active: false },
        { name: 'BCS Preliminary', type: 'Public Service Exam', active: false },
    ]

    return (
        <Sidebar
            collapsible="icon"
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader className="border-b border-sidebar-border/40 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    tooltip={selectedStream}
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
                                        <GraduationCap className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-semibold text-foreground text-xs">{selectedStream}</span>
                                        <span className="truncate text-[10px] text-muted-foreground font-medium">
                                            Academic Target
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-3.5 opacity-50 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 rounded-lg shadow-lg" align="start" side="bottom" sideOffset={4}>
                                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    Switch Academic Stream
                                </DropdownMenuLabel>
                                {streams.map((stream) => (
                                    <DropdownMenuItem
                                        key={stream.name}
                                        onClick={() => {
                                            setSelectedStream(stream.name)
                                            toast.success(`Active stream switched to ${stream.name}`)
                                        }}
                                        className="gap-2.5 py-2 cursor-pointer"
                                    >
                                        <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-muted text-foreground">
                                            <GraduationCap className="size-3.5" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold">{stream.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{stream.type}</span>
                                        </div>
                                        {selectedStream === stream.name && (
                                            <Check className="ml-auto size-4 text-primary" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => toast.info('Custom target stream creator')}
                                    className="gap-2.5 py-1.5 cursor-pointer text-muted-foreground"
                                >
                                    <Plus className="size-4" />
                                    <span className="text-xs">Add target exam / subject</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain user={user} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/40">
                <NavUser user={user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
