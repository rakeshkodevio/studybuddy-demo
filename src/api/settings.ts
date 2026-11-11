export interface StaticContent {
    slug: string
    title: string
    content: string
}

export interface UpdateStaticContentPayload {
    slug?: string
    title: string
    content: string
}

export const staticContentApi = {
    get: async (slug: string): Promise<StaticContent> => {
        // Mock get API
        return {
            slug,
            title: slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions',
            content:
                slug === 'privacy-policy'
                    ? '<h2>AZ Sports Privacy Policy</h2><p>This policy explains how AZ Sports collects, uses, and protects customer information when processing ecommerce orders.</p>'
                    : '<h2>AZ Sports Terms and Conditions</h2><p>These terms govern purchases, payments, fulfillment, returns, and use of the AZ Sports online store.</p>',
        }
    },
    update: async (_slug: string, _data: UpdateStaticContentPayload): Promise<{ success: boolean }> => {
        // Mock update API
        return { success: true }
    },
}
