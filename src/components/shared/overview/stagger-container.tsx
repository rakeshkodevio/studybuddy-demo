import { motion } from 'motion/react'
import { presets } from '@/lib/animation-presets'

interface StaggerContainerProps {
    children: React.ReactNode
    className?: string
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
    return (
        <motion.div {...presets.stagger} className={className}>
            {children}
        </motion.div>
    )
}
