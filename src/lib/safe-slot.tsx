import * as React from 'react'
import { Slot } from 'radix-ui'

export function unwrapSingleChild(children: React.ReactNode): React.ReactNode {
    if (Array.isArray(children)) {
        const filtered = children.filter((c) => c !== null && c !== undefined && c !== false && c !== '')
        if (filtered.length === 1) {
            return unwrapSingleChild(filtered[0])
        }
    }
    return children
}

export const SafeSlot = React.forwardRef<HTMLElement, React.ComponentProps<typeof Slot.Root>>(
    function SafeSlot({ children, ...props }, ref) {
        const singleChild = unwrapSingleChild(children)

        // If singleChild is not a valid React element, wrap in span so Radix Slot never throws
        if (!React.isValidElement(singleChild)) {
            return (
                <Slot.Root ref={ref} {...props}>
                    <span>{children}</span>
                </Slot.Root>
            )
        }

        return (
            <Slot.Root ref={ref} {...props}>
                {singleChild}
            </Slot.Root>
        )
    },
)

SafeSlot.displayName = 'SafeSlot'
