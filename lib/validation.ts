/**
 * Input Validation and Sanitization Utilities
 * 
 * Provides functions to validate and sanitize user inputs
 * to prevent XSS, injection attacks, and invalid data
 */

/**
 * Sanitize string input by removing potentially dangerous characters
 * Allows alphanumeric, spaces, and common punctuation
 */
export function sanitizeString(input: string, allowHtml: boolean = false): string {
    if (!input) return '';

    // Trim whitespace
    let sanitized = input.trim();

    if (!allowHtml) {
        // Remove HTML tags and script content
        sanitized = sanitized.replace(/<[^>]*>/g, '');
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+=/gi, '');
    }

    return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate team name
 * Allows letters, numbers, spaces, hyphens, and basic punctuation
 */
export function isValidTeamName(name: string): boolean {
    if (!name || name.length < 2 || name.length > 100) return false;
    // Allow letters, numbers, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z0-9\s\-']+$/;
    return nameRegex.test(name);
}

/**
 * Validate player name
 */
export function isValidPlayerName(name: string): boolean {
    if (!name || name.length < 2 || name.length > 100) return false;
    // Allow letters, spaces, hyphens, periods, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-'.]+$/;
    return nameRegex.test(name);
}

/**
 * Validate numeric input with optional range
 */
export function isValidNumber(value: any, min?: number, max?: number): boolean {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
}

/**
 * Sanitize filename to prevent directory traversal attacks
 */
export function sanitizeFilename(filename: string): string {
    if (!filename) return '';

    // Remove directory separators and special characters
    let sanitized = filename.replace(/[\/\\]/g, '');
    sanitized = sanitized.replace(/[<>:"|?*]/g, '');
    sanitized = sanitized.replace(/\.\./g, '');

    return sanitized.trim();
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Sanitize player jersey number
 */
export function isValidJerseyNumber(number: any): boolean {
    return isValidNumber(number, 0, 99);
}

/**
 * Validate season year
 */
export function isValidSeasonYear(year: any): boolean {
    const currentYear = new Date().getFullYear();
    return isValidNumber(year, 2000, currentYear + 10);
}

/**
 * Sanitize text for display (escape HTML entities)
 */
export function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validate and sanitize form data
 * Returns { valid: boolean, data: sanitizedData, errors: string[] }
 */
export interface ValidationResult<T> {
    valid: boolean;
    data: T;
    errors: string[];
}

export function validateFormData<T extends Record<string, any>>(
    data: T,
    validators: Record<keyof T, (value: any) => boolean>,
    errorMessages: Record<keyof T, string>
): ValidationResult<T> {
    const errors: string[] = [];
    const sanitizedData = { ...data };

    for (const key in validators) {
        const value = data[key];
        const validator = validators[key];

        if (!validator(value)) {
            errors.push(errorMessages[key]);
        } else if (typeof value === 'string') {
            // Sanitize string values
            sanitizedData[key] = sanitizeString(value) as T[typeof key];
        }
    }

    return {
        valid: errors.length === 0,
        data: sanitizedData,
        errors
    };
}
