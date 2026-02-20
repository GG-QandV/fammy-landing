import { useEffect, useRef } from 'react';

/**
 * Хук для перехвата системной кнопки "Назад" (Android back button, iOS swipe back).
 * Позволяет выполнить кастомное действие вместо стандартного возврата назад в истории браузера.
 * 
 * @param onBack Функция, которая будет вызвана при нажатии кнопки "Назад"
 * @param isActive Нужно ли перехватывать логику прямо сейчас
 */
export function useBackInterceptor(
    onBack: () => void,
    isActive: boolean = true
) {
    const onBackRef = useRef(onBack);

    // Поддерживаем ссылку на функцию всегда актуальной
    useEffect(() => {
        onBackRef.current = onBack;
    }, [onBack]);

    useEffect(() => {
        if (!isActive) return;

        // Уникальный ID для нашей записи в истории
        const stateId = `back-interceptor-${Date.now()}`;

        // Функция сохранения стейта с учетом Next.js 
        // ВАЖНО: Next.js App Router хранит свое дерево навигации в window.history.state. 
        // Если его затереть, при popstate произойдет полная перезагрузка (hard reload)!
        const pushDummyState = () => {
            const currentState = window.history.state || {};
            if (currentState.interceptorId !== stateId) {
                // Сохраняем все поля Next.js (...currentState) и добавляем свой флаг
                window.history.pushState({ ...currentState, interceptorId: stateId }, '');
            }
        };

        // Пушим запись при активации
        pushDummyState();

        const handlePopState = (event: PopStateEvent) => {
            // При нажатии "Назад" браузер извлекает этот стейт. 
            // Чтобы перехват продолжал работать и стейт-ловушка оставалась, пушим его обратно
            pushDummyState();

            // Вызываем пользовательскую логику возврата 
            onBackRef.current();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);

            // Если компонент размонтировался или хук деактивировался (например закрыли модалку "крестиком"),
            // и наш пустой стейт всё еще висит последним в истории, то нужно сделать back(),
            // иначе у пользователя накопится "мусор" в стеке истории.
            if (window.history.state?.interceptorId === stateId) {
                window.history.back();
            }
        };
    }, [isActive]);
}
