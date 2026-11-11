import type { Variants } from 'motion/react'
import { motionTokens } from './motionTokens'

// Page entrance variants
export const pageVariants: Variants = {
    hidden: { opacity: 0, y: motionTokens.distance.md },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: motionTokens.duration.normal,
            ease: motionTokens.easing.smooth,
        },
    },
}

// Stagger container variants
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
}

// Stagger item variants (for children of stagger container)
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: motionTokens.distance.md },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: motionTokens.duration.normal,
            ease: motionTokens.easing.smooth,
        },
    },
}

// Fade in variants
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: motionTokens.duration.normal,
            ease: motionTokens.easing.smooth,
        },
    },
}

// Slide up variants
export const slideUp: Variants = {
    hidden: { opacity: 0, y: motionTokens.distance.lg },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: motionTokens.duration.normal,
            ease: motionTokens.easing.smooth,
        },
    },
}

// Slide down variants
export const slideDown: Variants = {
    hidden: { opacity: 0, y: -motionTokens.distance.lg },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: motionTokens.duration.normal,
            ease: motionTokens.easing.smooth,
        },
    },
}

// Scale in variants
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: motionTokens.duration.fast,
            ease: motionTokens.easing.smooth,
        },
    },
}

// Card hover/tap variants
export const cardVariants: Variants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.01, y: -2 },
    tap: { scale: 0.99 },
}

// List item variants (for use in lists)
export const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -motionTokens.distance.sm },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: motionTokens.duration.fast,
            ease: motionTokens.easing.smooth,
        },
    },
}

// Dialog/sheet variants
export const dialogVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: motionTokens.duration.fast,
            ease: motionTokens.easing.smooth,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: {
            duration: motionTokens.duration.fast,
            ease: motionTokens.easing.smooth,
        },
    },
}

// Backdrop variants
export const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: motionTokens.duration.fast,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: motionTokens.duration.fast,
        },
    },
}
