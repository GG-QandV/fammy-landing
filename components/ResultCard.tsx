interface Props {
    result: {
        toxicityLevel: 'safe' | 'caution' | 'moderate' | 'high' | 'critical' | 'deadly';
        toxicityName: string;
        explanation: string;
        severity: number;
    };
    foodName: string;
}

const TOXICITY_CONFIG = {
    safe: {
        color: 'success',
        icon: '✅',
        title: 'Safe',
        bgClass: 'bg-success-50 border-success-200',
        textClass: 'text-success-800',
        badgeClass: 'bg-success-100 text-success-800',
    },
    caution: {
        color: 'warning',
        icon: '⚠️',
        title: 'Caution',
        bgClass: 'bg-warning-50 border-warning-200',
        textClass: 'text-warning-800',
        badgeClass: 'bg-warning-100 text-warning-800',
    },
    moderate: {
        color: 'warning',
        icon: '⚠️',
        title: 'Moderate Risk',
        bgClass: 'bg-warning-50 border-warning-300',
        textClass: 'text-warning-900',
        badgeClass: 'bg-warning-200 text-warning-900',
    },
    high: {
        color: 'danger',
        icon: '🚫',
        title: 'High Risk',
        bgClass: 'bg-danger-50 border-danger-300',
        textClass: 'text-danger-900',
        badgeClass: 'bg-danger-200 text-danger-900',
    },
    critical: {
        color: 'danger',
        icon: '☠️',
        title: 'Critical - Toxic',
        bgClass: 'bg-danger-100 border-danger-400',
        textClass: 'text-danger-900',
        badgeClass: 'bg-danger-300 text-danger-900',
    },
    deadly: {
        color: 'danger',
        icon: '💀',
        title: 'DEADLY / LETHAL',
        bgClass: 'bg-red-900 border-red-950',
        textClass: 'text-white',
        badgeClass: 'bg-black text-white border border-red-500',
    },
};

export default function ResultCard({ result, foodName }: Props) {
    // Safety check for toxicityLevel
    const level = result?.toxicityLevel || 'safe';
    const config = TOXICITY_CONFIG[level as keyof typeof TOXICITY_CONFIG] || TOXICITY_CONFIG.safe;

    return (
        <div
            className={`border-2 rounded-lg p-6 animate-slide-up ${config.bgClass}`}
            data-testid={`f2-results-${level}`}
        >
            <div className="flex items-start gap-4">
                <div className="text-4xl">{config.icon}</div>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className={`text-xl font-bold ${config.textClass}`}>
                            {foodName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${config.badgeClass}`}>
                            {result.toxicityName || config.title}
                        </span>
                    </div>
                    <p className={`text-sm ${config.textClass}`}>
                        {result.explanation}
                    </p>
                </div>
            </div>
        </div>
    );
}
