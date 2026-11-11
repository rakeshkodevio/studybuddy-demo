export const motionTokens = {
    duration: {
        fast: 0.2,
        normal: 0.4,
        slow: 0.6,
    },
    // Production-ready easings for snappy but smooth feel
    easing: {
        smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
        sharp: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
    distance: {
        sm: 4,
        md: 8,
        lg: 12,
    },
}
