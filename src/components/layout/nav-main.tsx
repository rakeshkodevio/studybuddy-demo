import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { hasRoutePermission } from '@/lib/permission'
import type { AdminUser } from '@/types/user'
import { Link, useRouterState } from '@tanstack/react-router'
import {
    BarChart3,
    BookOpen,
    CalendarCheck,
    ChevronRight,
    CreditCard,
    FileCheck,
    GraduationCap,
    LayoutDashboard,
    Settings,
    Tag,
    UsersRound,
    Bell,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface SubNavItem {
    title: string
    url: string
    icon?: LucideIcon
}

interface NavItem {
    title: string
    url: string
    icon: LucideIcon
    items?: SubNavItem[]
}

interface NavSection {
    label: string
    items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
    {
        label: 'প্রস্তুতি ও প্র্যাকটিস (Learning)',
        items: [
            {
                title: 'StudyBuddy Hub',
                url: '/',
                icon: LayoutDashboard,
            },
            {
                title: 'Question Bank',
                url: '/products',
                icon: BookOpen,
                items: [
                    {
                        title: 'All MCQs & Chapters',
                        url: '/products',
                        icon: BookOpen,
                    },
                    {
                        title: 'Subjects & Streams',
                        url: '/categories',
                        icon: GraduationCap,
                    },
                    {
                        title: 'Exam Routines',
                        url: '/inventory',
                        icon: CalendarCheck,
                    },
                ],
            },
        ],
    },
    {
        label: 'পরীক্ষা ও ফলাফল (Exams)',
        items: [
            {
                title: 'Exam Submissions',
                url: '/orders',
                icon: FileCheck,
                items: [
                    {
                        title: 'Live Scorecards',
                        url: '/orders',
                        icon: FileCheck,
                    },
                    {
                        title: 'Learners & Ranks',
                        url: '/user-management',
                        icon: UsersRound,
                    },
                    {
                        title: 'Diagnostic Reports',
                        url: '/reports',
                        icon: BarChart3,
                    },
                ],
            },
        ],
    },
    {
        label: 'প্যাকেজ ও সেটিংস (Management)',
        items: [
            {
                title: 'Store & Pass',
                url: '/dynamic-pricing',
                icon: Tag,
                items: [
                    {
                        title: 'Model Test Packages',
                        url: '/dynamic-pricing',
                        icon: Tag,
                    },
                    {
                        title: 'bKash / MFS Payments',
                        url: '/payments',
                        icon: CreditCard,
                    },
                    {
                        title: 'Exam Alerts',
                        url: '/notifications',
                        icon: Bell,
                    },
                    {
                        title: 'Academic Settings',
                        url: '/settings',
                        icon: Settings,
                    },
                ],
            },
        ],
    },
]

export function NavMain({ user }: { user: AdminUser }) {
    const pathname = useRouterState({ select: (s) => s.location.pathname })
    const { setOpenMobile } = useSidebar()

    return (
        <>
            {NAV_SECTIONS.map((section) => {
                const visibleItems = section.items
                    .map((item) => {
                        if (!item.items) {
                            return hasRoutePermission(user, item.url) ? item : null
                        }

                        const visibleSubItems = item.items.filter((sub) => hasRoutePermission(user, sub.url))
                        if (visibleSubItems.length === 0) return null

                        return {
                            ...item,
                            items: visibleSubItems,
                        }
                    })
                    .filter((item): item is NavItem => item !== null)

                if (visibleItems.length === 0) return null

                return (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {visibleItems.map((item) => {
                                const Icon = item.icon
                                const hasSubItems = Boolean(item.items?.length)
                                const isItemActive =
                                    item.url === '/'
                                        ? pathname === '/'
                                        : pathname === item.url || (hasSubItems && pathname.startsWith(item.url))

                                const isGroupOpen = hasSubItems && item.items?.some((sub) =>
                                    sub.url === '/' ? pathname === '/' : pathname.startsWith(sub.url),
                                )

                                if (!hasSubItems) {
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isItemActive}
                                                tooltip={item.title}
                                                onClick={() => setOpenMobile(false)}
                                            >
                                                <Link to={item.url}>
                                                    <Icon className="size-4 shrink-0" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                }

                                return (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={isGroupOpen || isItemActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                isActive={pathname === item.url}
                                            >
                                                <Link to={item.url} onClick={() => setOpenMobile(false)}>
                                                    <Icon className="size-4 shrink-0" />
                                                    <span className="font-medium">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>

                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuAction
                                                    className="transition-transform duration-200 data-[state=open]:rotate-90"
                                                    aria-label={`Toggle ${item.title}`}
                                                >
                                                    <ChevronRight className="size-4" />
                                                    <span className="sr-only">Toggle</span>
                                                </SidebarMenuAction>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items?.map((subItem) => {
                                                        const isSubActive =
                                                            subItem.url === '/'
                                                                ? pathname === '/'
                                                                : pathname === subItem.url || pathname.startsWith(`${subItem.url}/`)
                                                        const SubIcon = subItem.icon

                                                        return (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                                                    <Link
                                                                        to={subItem.url}
                                                                        onClick={() => setOpenMobile(false)}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        {SubIcon && (
                                                                            <SubIcon className="size-3.5 shrink-0 opacity-70" />
                                                                        )}
                                                                        <span>{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        )
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                )
            })}
        </>
    )
}
