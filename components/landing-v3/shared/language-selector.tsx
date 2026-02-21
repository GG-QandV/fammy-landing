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
            className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-light-grey bg-white-card/80 p-1 backdrop-blur-sm logo-shadow hover:bg-white transition-colors"
            title="Choose language"
        >
            <svg className="w-[18px] h-[18px] opacity-80 translate-y-[2px]" viewBox="0 0 204 188" fill="currentColor">
                <path d="m 186.95875,0.01260153 c -57.73144,0.0054 -115.464065,-0.01104 -173.195322,0.0078 -0.166312,0.0045 -0.331735,0.0092 -0.498047,0.01367 -5.42058,0.217969 -10.471584,3.92402997 -12.34375002,9.00976597 -1.231603,2.9923475 -0.850855,6.2712805 -0.910156,9.4218755 0.0052,52.021599 -0.01041,104.042967 0.0078,156.064467 0.09998,5.28762 3.54088102,10.31517 8.43359402,12.32226 4.664229,2.0716 10.433519,1.31071 14.361328,-1.96289 11.171359,-9.60082 22.299271,-19.25483 33.453137,-28.87694 44.663736,-0.005 89.328646,0.011 133.992196,-0.008 5.52791,-0.0126 10.79413,-3.68331 12.76953,-8.83789 1.06145,-2.4631 1.02141,-5.17876 0.98242,-7.80664 -0.007,-41.898094 0.0134,-83.797488 -0.0117,-125.695324 -0.0506,-5.5277285 -3.75802,-10.7657835 -8.92578,-12.70507847 -2.56634,-1.087628 -5.38975,-0.96393 -8.11525,-0.947076 z M 12.011475,12.012602 h 2 178.000005 V 144.01261 c -46.0846,0.005 -92.169512,-0.0106 -138.253911,0.008 -1.798867,0.0423 -3.351088,1.08925 -4.595703,2.30469 -12.383278,10.68436 -24.767526,21.36928 -37.150391,32.0545 z m 95.748055,8 a 57.747899,57.747899 0 1 0 57.74804,57.74805 57.814531,57.814531 0 0 0 -57.74804,-57.74805 z M 96.425538,30.229399 A 75.11669,75.11669 0 0 0 84.044675,55.549712 H 64.243897 A 49.024635,49.024635 0 0 1 96.425538,30.229399 Z m 22.666022,0 a 49.024635,49.024635 0 0 1 32.18359,25.320313 h -0.0215 -19.7793 A 75.11669,75.11669 0 0 0 119.09156,30.229399 Z m -11.33203,0.333984 a 64.005772,64.005772 0 0 1 14.4375,24.986329 H 93.322028 A 63.91693,63.91693 0 0 1 107.75953,30.563383 Z M 60.743897,64.434482 h 21.384768 a 87.421435,87.421435 0 0 0 0,26.652344 H 60.743897 a 48.647052,48.647052 0 0 1 -1.847656,-13.326174 48.647052,48.647052 0 0 1 1.847656,-13.32617 z m 30.412111,0 h 33.250002 a 78.203982,78.203982 0 0 1 0,26.652344 H 91.156008 a 78.203982,78.203982 0 0 1 0,-26.652344 z m 42.234382,0 h 21.38281 a 48.647052,48.647052 0 0 1 1.84961,13.32617 48.647052,48.647052 0 0 1 -1.84961,13.326174 h -21.38281 a 87.421435,87.421435 0 0 0 0,-26.652344 z M 64.243897,99.971586 H 84.044675 A 75.11669,75.11669 0 0 0 96.425538,125.29191 49.024635,49.024635 0 0 1 64.243897,99.971586 Z m 29.078131,0 H 122.19703 A 63.91693,63.91693 0 0 1 107.75953,124.95792 64.005772,64.005772 0 0 1 93.322028,99.971586 Z m 38.152342,0 h 19.80078 a 49.024635,49.024635 0 0 1 -32.18359,25.320324 75.11669,75.11669 0 0 0 12.38281,-25.320324 z" />
            </svg>
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
