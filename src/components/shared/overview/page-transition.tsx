import { motion } from 'motion/react'
import { presets } from '@/lib/animation-presets'

interface PageTransitionProps {
    children: React.ReactNode
    className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
    return (
        <motion.div {...presets.page} className={className}>
            {children}
        </motion.div>
    )
}
