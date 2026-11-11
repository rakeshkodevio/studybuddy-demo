import { motion } from 'motion/react'
import { presets } from '@/lib/animation-presets'

interface StaggerItemProps {
    children: React.ReactNode
    className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    return (
        <motion.div {...presets.staggerItem} className={className}>
            {children}
        </motion.div>
    )
}
