import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const titleVariants = cva("text-4xl md:text-5xl lg:text-6xl font-bold", {
    variants: {
        textColor: {
            default: "text-gray-base",
            contrast: "text-gray-contrast",
        },
        size: {
            default: "",
            lg: "text-7xl md:text-8xl lg:text-9xl",
            sm: "text-2xl md:text-3xl lg:text-4xl",
        },
        font: {
            default: "",
            sm: "font-barlow-semi-condensed",
            special: "font-special",
        },
    },
    defaultVariants: {
        textColor: "default",
        size: "default",
        font: "default",
    },
})

interface TitleProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {}

export default function Title({ children, className, textColor, size, font, ...props }: TitleProps) {
    return (
        <h1 className={cn(titleVariants({ textColor, size, font, className }))} {...props}>
            {children}
        </h1>
    )
}
