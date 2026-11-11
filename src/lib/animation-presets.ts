import type { MotionProps } from 'motion/react'
import { motionTokens } from './motionTokens'
import * as primitives from './motion-primitives'

// Pre-configured motion props for common patterns
export const presets = {
    // Page entrance animation
    page: {
        initial: 'hidden',
        animate: 'visible',
        variants: primitives.pageVariants,
    } satisfies MotionProps,

    // Stagger container for animating lists/grids
    stagger: {
        initial: 'hidden',
        animate: 'visible',
        variants: primitives.staggerContainer,
    } satisfies MotionProps,

    // Stagger item (use as child of stagger container)
    staggerItem: {
        variants: primitives.staggerItem,
    } satisfies MotionProps,

    // Simple fade in
    fadeIn: {
        initial: 'hidden',
        animate: 'visible',
        variants: primitives.fadeIn,
    } satisfies MotionProps,

    // Slide up entrance
    slideUp: {
        initial: 'hidden',
        animate: 'visible',
        variants: primitives.slideUp,
    } satisfies MotionProps,

    // Scale in entrance
    scaleIn: {
        initial: 'hidden',
        animate: 'visible',
        variants: primitives.scaleIn,
    } satisfies MotionProps,

    // Card hover/tap interactions
    card: {
        initial: 'rest',
        whileHover: 'hover',
        whileTap: 'tap',
        variants: primitives.cardVariants,
        transition: {
            duration: motionTokens.duration.fast,
            ease: motionTokens.easing.smooth,
        },
    } satisfies MotionProps,

    // Dialog/sheet entrance
    dialog: {
        initial: 'hidden',
        animate: 'visible',
        exit: 'exit',
        variants: primitives.dialogVariants,
    } satisfies MotionProps,

    // Backdrop for modals
    backdrop: {
        initial: 'hidden',
        animate: 'visible',
        exit: 'exit',
        variants: primitives.backdropVariants,
    } satisfies MotionProps,
} as const
