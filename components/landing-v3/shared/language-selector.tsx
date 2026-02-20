"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { type Language } from "@/lib/i18n";
import { useIsMobile } from "@/components/ui/use-mobile";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const languages: { code: Language; name: string; icons: string[] }[] = [
    { code: "en", name: "English", icons: ["/icons/flags/us.svg", "/icons/flags/gb.svg"] },
    { code: "es", name: "Español", icons: ["/icons/flags/es.svg"] },
    { code: "fr", name: "Français", icons: ["/icons/flags/fr.svg"] },
    { code: "ua", name: "Українська", icons: ["/icons/flags/ua.svg"] },
    // Здесь легко добавляются все языки ЕС в будущем
];

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);

    // Радиокнопка (пустая и заполненная)
    const RadioIcon = ({ active }: { active: boolean }) => (
        <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${active ? 'border-[#b58c54]' : 'border-gray-300'}`}>
            {active && <div className="w-2.5 h-2.5 bg-[#b58c54] rounded-full" />}
        </div>
    );

    const handleSelect = (lang: Language) => {
        setLanguage(lang);
        setOpen(false);
    };

    const TriggerContent = (
        <button
            className="flex items-center justify-center w-8 h-8 rounded-full border border-light-grey bg-white-card/80 p-1 backdrop-blur-sm logo-shadow hover:bg-white transition-colors"
            title="Choose language"
        >
            <img src="/chat-lang.svg" alt="Languages" className="w-5 h-5 opacity-80" />
        </button>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {TriggerContent}
                </DrawerTrigger>
                <DrawerContent className="bg-white">
                    <DrawerHeader>
                        <DrawerTitle className="text-center font-normal text-gray-700">
                            Please choose your preferred language
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-2 pb-8">
                        {languages.map((lang) => {
                            const isActive = language === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => handleSelect(lang.code)}
                                    className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all ${isActive ? 'border-gray-300 shadow-sm bg-gray-50/50' : 'border-gray-100 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-10 h-10 shrink-0">
                                            <div className="flex items-center justify-center relative w-full h-full">
                                                {lang.icons.map((icon, i) => (
                                                    <img
                                                        key={icon}
                                                        src={icon}
                                                        alt="flag"
                                                        className={`w-10 h-10 rounded-full shadow-sm object-cover border border-gray-200/60 bg-white ${i > 0 ? '-ml-5 relative z-10' : 'relative z-0'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-lg font-medium text-gray-800">{lang.name}</span>
                                    </div>
                                    <RadioIcon active={isActive} />
                                </button>
                            );
                        })}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    // Десктопная версия: Grid, чтобы избежать полосы прокрутки при добавлении языков ЕС
    // В зависимости от количества языков grid-cols можно менять (сейчас 2 колонки, когда будет больше - можно 3)
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                {TriggerContent}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 p-2 bg-white rounded-xl border border-gray-100 shadow-xl"
            >
                <DropdownMenuLabel className="font-normal text-muted-foreground text-center pb-2">
                    Preferred language
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* CSS Grid для языков (по умолчанию 2 колонки) */}
                <div className="grid grid-cols-2 gap-1 mt-2">
                    {languages.map((lang) => {
                        const isActive = language === lang.code;
                        return (
                            <DropdownMenuItem
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center justify-center w-7 h-7 shrink-0">
                                    <div className="flex items-center justify-center relative w-full h-full">
                                        {lang.icons.map((icon, i) => (
                                            <img
                                                key={icon}
                                                src={icon}
                                                alt="flag"
                                                className={`w-7 h-7 rounded-full shadow-sm object-cover border border-gray-200/60 bg-white ${i > 0 ? '-ml-3.5 relative z-10' : 'relative z-0'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="font-medium flex-1 text-gray-800">{lang.name}</span>
                                {isActive && <div className="w-1.5 h-1.5 bg-[#b58c54] rounded-full ml-auto" />}
                            </DropdownMenuItem>
                        );
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
