import { ValidationError } from '../errors/domain-error';

/**
 * Email validation
 * */

export class Email {
    private readonly _value: string;

    constructor(email: string) {
        this._value=this.validate(email);
    }

    get value(): string {
        return this._value;
    }

    private validate(email: string): string {
        const trimmed = email.trim().toLowerCase();
        if (!trimmed) {
            throw new ValidationError('Email cannot be empty', 'email');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            throw new ValidationError('Invalid email format', 'email');
        }

        if (trimmed.length > 254) {
            throw new ValidationError('Email exceeds maximum length of 254 characters', 'email');
        }

        return trimmed;
    }

    equals(other: Email | null | undefined): boolean {
        if (!other) return false;
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }

    toJSON(): string {
        return this._value;
    }

    static isValid(value: string): boolean {
        try {
            new Email(value);
            return true;
        } catch {
            return false;
        }
    }
}