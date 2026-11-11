import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Link, useNavigate } from '@tanstack/react-router'
import { Bell, ChevronsUpDownIcon, LogOutIcon, Settings, ShieldCheck, Sparkles, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import type { AdminUser } from '@/types/user'
import { authApi } from '@/api/auth'

export function NavUser({ user }: { user: AdminUser }) {
    const navigate = useNavigate()
    const { isMobile } = useSidebar()

    const signOut = async () => {
        await authApi.signOut()
        toast.success('Signed out successfully')
        navigate({ to: '/signin' })
    }

    const initials = user.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : 'AU'

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:p-1!"
                            tooltip={user.name}
                        >
                            <Avatar className="size-8 rounded-lg border border-border/60">
                                <AvatarImage src={user.image ?? '/profile.png'} alt={user.name} />
                                <AvatarFallback className="rounded-lg font-semibold text-xs bg-primary/10 text-primary">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="truncate font-semibold text-xs text-foreground flex items-center gap-1.5">
                                    {user.name}
                                    <ShieldCheck className="size-3 text-primary shrink-0" />
                                </span>
                                <span className="truncate text-[10px] text-muted-foreground">{user.email}</span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-3.5 opacity-50 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg shadow-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={6}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm bg-muted/40 rounded-t-lg">
                                <Avatar className="size-9 rounded-lg border border-border/60">
                                    <AvatarImage src={user.image ?? '/profile.png'} alt={user.name} />
                                    <AvatarFallback className="rounded-lg font-semibold text-xs bg-primary/10 text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <div className="flex items-center gap-1">
                                        <span className="truncate font-semibold text-xs">{user.name}</span>
                                        <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-primary/10 text-primary font-bold">
                                            {user.role}
                                        </span>
                                    </div>
                                    <span className="truncate text-[11px] text-muted-foreground">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="/settings">
                                    <Settings className="size-4" />
                                    <span>Store Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="/user-management">
                                    <UserCheck className="size-4" />
                                    <span>Account & Staff</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="/notifications">
                                    <Bell className="size-4" />
                                    <span>Activity Alerts</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => toast.success('StudyBuddy Pro Scholar features are active.')}
                            className="cursor-pointer text-xs text-muted-foreground"
                        >
                            <Sparkles className="size-4 text-amber-500" />
                            <span>StudyBuddy Pro Scholar Pass</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-destructive focus:text-destructive">
                                    <LogOutIcon className="size-4 text-destructive" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sign out of StudyBuddy?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will end your active learning session and be returned to the sign-in screen.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => signOut()}>Sign out</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
