import { InputHTMLAttributes, forwardRef, ReactNode, useId } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;
        const hasError = !!error;

        const wrapperClasses = [
            styles.inputWrapper,
            hasError ? styles.hasError : '',
            props.disabled ? styles.disabled : '',
            leftIcon ? styles.hasLeftIcon : '',
            rightIcon ? styles.hasRightIcon : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={styles.container}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={wrapperClasses}>
                    {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={styles.input}
                        aria-invalid={hasError}
                        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        {...props}
                    />
                    {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
                </div>
                {error && (
                    <span id={`${inputId}-error`} className={styles.error}>
                        {error}
                    </span>
                )}
                {hint && !error && (
                    <span id={`${inputId}-hint`} className={styles.hint}>
                        {hint}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
