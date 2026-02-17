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
        { id: 'safety', iconPath: "/icons/category-safety.svg", label: t('category_safety' as any) || 'Безпека' },
        { id: 'nutrition', iconPath: "/icons/category-nutrition.svg", label: t('category_nutrition' as any) || 'Харчування' },
        { id: 'health', iconPath: "/icons/category-health.svg", label: t('category_health' as any) || 'Здоров\'я' }
    ]

    return (
        <div className={cn("flex flex-wrap justify-center gap-3 mt-8", className)}>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-200 text-sm font-medium",
                        activeCategory === cat.id
                            ? "bg-[#546a8c] text-white border-[#546a8c] shadow-md transform scale-105" // Slate blue
                            : "bg-white text-[#4a4a4a] border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-slate-50" // Light gray border
                    )}
                >
                    <img
                        src={cat.iconPath}
                        alt=""
                        className={cn(
                            "w-5 h-5 transition-colors",
                            activeCategory === cat.id ? "brightness-0 invert" : "brightness-0 opacity-70"
                        )}
                    />
                    <span>{cat.label}</span>
                </button>
            ))}
        </div>
    )
}
