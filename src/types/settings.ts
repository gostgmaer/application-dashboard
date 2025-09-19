export interface Settings {
    siteName: string
    siteKey: string
    isDeleted: boolean
    name?: string
    isLive: boolean
    maintenanceMode: boolean
    siteTimezone: string
    siteLocale: string
    defaultPageSize: number
    maxUploadSizeMB: number
    contactInfo: {
        email: string
        phone?: string
        address: {
            street?: string
            city?: string
            state?: string
            zipCode?: string
            country?: string
        }
        supportEmail?: string
        supportPhone?: string
        contactHours?: string
    }
    branding: {
        logo?: string
        favicon?: string
        themeColor: string
        customCSSUrl?: string
        customJSUrl?: string
    }
    shipping: {
        shippingOptions: string[]
        shippingMethods: string[]
        minOrderAmount: number
        maxOrderAmount?: number
        freeShippingThreshold: number
        shippingHandlingFee: number
        shippingInsuranceEnabled: boolean
    }
    email: {
        smtpHost?: string
        smtpPort?: number
        smtpUser?: string
        smtpPassword?: string
        templates: {
            orderConfirmation?: string
            passwordReset?: string
            shippingNotification?: string
            promotional?: string
        }
        emailSenderName?: string
        emailSenderAddress?: string
    }
    seo: {
        title?: string
        description?: string
        keywords: string[]
        googleSiteVerification?: string
        robotsTxt?: string
    }
    analytics: {
        googleAnalyticsID?: string
        facebookPixelID?: string
        hotjarID?: string
        segmentWriteKey?: string
    }
    currencySettings: {
        currency: string
        currencySymbol: string
        taxRate: number
        taxEnabled: boolean
        taxInclusivePricing: boolean
    }
    payment: {
        paymentMethods: string[]
        enabledMFA: boolean
        defaultPaymentMethod?: string
        stripePublicKey?: string
        stripeSecretKey?: string
        paypalClientId?: string
        paypalSecret?: string
        currencyConversionEnabled: boolean
    }
    socialMediaLinks: {
        facebook?: string
        twitter?: string
        instagram?: string
        linkedin?: string
        youtube?: string
        pinterest?: string
        tiktok?: string
    }
    featuredCategories: string[] // ObjectId[] in Mongoose, treated as strings in UI
    loyaltyProgram: {
        enabled: boolean
        pointsPerDollar: number
        tieredRewardsEnabled: boolean
        extraRewardMultiplier: number
    }
    policies: {
        returnPolicy?: string
        privacyPolicy?: string
        termsOfService?: string
        cookiePolicy?: string
        gdprComplianceEnabled: boolean
    }
    security: {
        passwordMinLength: number
        passwordRequireSymbols: boolean
        passwordRequireNumbers: boolean
        passwordRequireUppercase: boolean
        maxLoginAttempts: number
        accountLockoutDurationMinutes: number
        sessionTimeoutMinutes: number
        refreshTokenExpiryDays: number
        enableCaptchaOnLogin: boolean
        enableCaptchaOnSignup: boolean
        enableIPRateLimiting: boolean
        maxRequestsPerMinute: number
        allowedIPRanges: string[]
        auditLoggingEnabled: boolean
        twoFactorAuthRequired: boolean
        jwtSecret?: string
        jwtExpiryMinutes: number
        passwordResetTokenExpiryMinutes: number
    }
    misc: {
        allowGuestCheckout: boolean
        enableDarkMode: boolean
        defaultLanguage: string
        supportedLanguages: string[]
        defaultPageSize: number
        maxUploadSizeMB: number
        enablePushNotifications: boolean
        notificationSound: string
        customCSSUrl?: string
        customJSUrl?: string
    }
}