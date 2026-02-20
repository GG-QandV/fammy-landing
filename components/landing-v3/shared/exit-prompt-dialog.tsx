import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLanguage } from "@/context/LanguageContext"

interface ExitPromptDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirmExit: () => void;
}

export function ExitPromptDialog({ open, onOpenChange, onConfirmExit }: ExitPromptDialogProps) {
    const { t } = useLanguage();

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md rounded-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">
                        {t('exit_prompt_title' as any)}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('exit_prompt_desc' as any)}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:space-x-4 mt-4">
                    <AlertDialogCancel className="w-full sm:w-auto">
                        {t('exit_prompt_no' as any)}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirmExit}
                        className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {t('exit_prompt_yes' as any)}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
