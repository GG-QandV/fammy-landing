import { useEffect, useRef } from 'react';

type InterceptorCallback = () => void;

class BackInterceptorManager {
    private stack: InterceptorCallback[] = [];
    private stateId: string | null = null;
    private isInitialized = false;

    private pushDummyState() {
        if (typeof window === 'undefined') return;

        if (!this.stateId) {
            this.stateId = `back-interceptor-${Date.now()}`;
        }
        const currentState = window.history.state || {};
        if (currentState.interceptorId !== this.stateId) {
            window.history.pushState({ ...currentState, interceptorId: this.stateId }, '');
        }
    }

    private handlePopState = (event: PopStateEvent) => {
        if (this.stack.length > 0) {
            // Поддерживаем ловушку активной, но делаем это асинхронно!
            // Chrome/Safari блокируют синхронный pushState внутри popstate (History Trapping protection)
            // Если pushState заблокируется, на следующий "Назад" юзер вылетит из приложения.
            setTimeout(() => {
                this.pushDummyState();
            }, 50);

            // Вызываем верхний колбек из стека
            const topCallback = this.stack[this.stack.length - 1];
            if (topCallback) topCallback();
        }
    };

    public push(callback: InterceptorCallback) {
        if (typeof window === 'undefined') return;

        if (!this.isInitialized) {
            window.addEventListener('popstate', this.handlePopState);
            this.isInitialized = true;
        }

        if (this.stack.length === 0) {
            this.pushDummyState();
        }
        this.stack.push(callback);
    }

    public remove(callback: InterceptorCallback) {
        if (typeof window === 'undefined') return;

        const index = this.stack.indexOf(callback);
        if (index !== -1) {
            this.stack.splice(index, 1);
        }

        // Ждем миллисекунды, чтобы убедиться, что другой модал не открылся сразу же
        setTimeout(() => {
            if (this.stack.length === 0 && this.stateId) {
                if (window.history.state?.interceptorId === this.stateId) {
                    window.history.back();
                }
                this.stateId = null;
            }
        }, 50);
    }
}

// Единый глобальный диспетчер
const backManager = new BackInterceptorManager();

/**
 * Хук для перехвата системной кнопки "Назад" (Android back button, iOS swipe back).
 * Решает проблему Race Conditions при переключении между несколькими модалками.
 */
export function useBackInterceptor(
    onBack: () => void,
    isActive: boolean = true
) {
    const onBackRef = useRef(onBack);

    // Поддерживаем ссылку актуальной
    useEffect(() => {
        onBackRef.current = onBack;
    }, [onBack]);

    useEffect(() => {
        if (!isActive) return;

        const callback = () => onBackRef.current();
        backManager.push(callback);

        return () => {
            backManager.remove(callback);
        };
    }, [isActive]);
}
