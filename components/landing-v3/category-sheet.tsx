import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from "@/components/ui/dialog"
import { useLanguage } from "@/context/LanguageContext"
import { functions } from "@/lib/functions-config"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CategorySheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    categoryId: string | null
    onSelectTool: (toolId: any) => void
}

export function CategorySheet({ open, onOpenChange, categoryId, onSelectTool }: CategorySheetProps) {
    const { t } = useLanguage()

    if (!categoryId) return null

    const categoryTools = Object.values(functions).filter((f: any) => f.category === categoryId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay className="bg-black/5 backdrop-blur-[1px]" />
            <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white">
                <DialogHeader className="p-6 bg-[#4A5A7A] border-b border-transparent">
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
                        <img
                            src={`/icons/category-${categoryId}.svg`}
                            alt=""
                            className="w-6 h-6 brightness-0 invert"
                        />
                        {t(`category_${categoryId}` as any)}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto bg-slate-50/30">
                    {categoryTools.map((tool: any) => {
                        const isAvailable = tool.available
                        return (
                            <div
                                key={tool.id}
                                className={cn(
                                    "group relative flex flex-col p-4 rounded-2xl border transition-all duration-200",
                                    isAvailable
                                        ? "bg-white border-slate-200 hover:border-[#546a8c] hover:bg-slate-50 cursor-pointer shadow-sm"
                                        : "bg-slate-50 border-transparent opacity-80"
                                )}
                                onClick={() => isAvailable && onSelectTool(tool.id)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-3">
                                        <img
                                            src={`/icons/tool-${tool.id}.svg`}
                                            alt=""
                                            className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
                                        />
                                        {t(tool.i18nKey as any)}
                                    </h3>
                                    {isAvailable ? (
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#546a8c] transition-colors" />
                                    ) : (
                                        <Badge variant="secondary" className="bg-slate-200 text-slate-500 font-normal">
                                            {t('coming_soon' as any) || 'Скоро'}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2">
                                    {t(tool.i18nDescKey as any)}
                                </p>

                                {isAvailable && (
                                    <div className="mt-3 flex justify-end">
                                        <Link
                                            href={tool.route}
                                            className="text-xs text-slate-400 hover:text-[#546a8c] flex items-center gap-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            {t('open_on_page' as any) || 'Відкрити окремо'}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}
