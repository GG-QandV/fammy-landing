import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"
import { functions } from "@/lib/functions-config"

interface CategoryBayanProps {
    onSelectCategory: (categoryId: any) => void
    activeCategory?: string
    className?: string
}

export function CategoryBayan({ onSelectCategory, activeCategory, className }: CategoryBayanProps) {
    const { t } = useLanguage()

    // Categories are: 'safety', 'nutrition', 'health'
    const categories = [
        { id: 'safety', label: t('category_safety'), iconPath: '/icons/category-safety.svg' },
        { id: 'nutrition', label: t('category_nutrition'), iconPath: '/icons/category-nutrition.svg' },
        { id: 'health', label: t('category_health'), iconPath: '/icons/category-health.svg' },
    ]

    return (
        <div className={cn("flex flex-col gap-3 w-full", className)}>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={cn(
                        "relative flex items-center pr-20 pl-8 py-2 rounded-[42px] border-2 transition-all duration-300 text-[21px] font-bold min-h-[65px] border-[#2C3650] w-full max-w-[440px] mx-auto",
                        activeCategory === cat.id
                            ? "bg-[#4A5A7A] text-[#F5E6B8] shadow-xl" // Dark border (#2C3650 is in base) + Light Cream text
                            : "bg-[#4A5A7A] text-white/95 hover:bg-[#5a6e91] hover:border-[#2C3650]/80"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <img
                            src={cat.iconPath}
                            alt=""
                            className={cn(
                                "w-[30px] h-[30px] brightness-0 invert transition-all duration-300",
                                activeCategory === cat.id ? "opacity-100" : "opacity-90"
                            )}
                            style={activeCategory === cat.id ? {
                                filter: 'invert(93%) sepia(14%) saturate(464%) hue-rotate(3deg) brightness(101%) contrast(97%)' // Target #F5E6B8
                            } : undefined}
                        />
                        <span>{cat.label}</span>
                    </div>

                    {/* Accent Circle (Status indicator) */}
                    <div
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full border-2 transition-colors duration-300",
                            activeCategory === cat.id
                                ? "bg-[#FF7F50] border-[#f8f8f2]" // Active: Coral fill + Light Cream border (Promo Block match)
                                : "bg-[#F5E6B8] border-[#F2BBA9]" // Inactive: Cream fill + Light Coral border (#F2BBA9 is ~30% lighter than #E8887A)
                        )}
                    />
                </button>
            ))}
        </div>
    )
}
