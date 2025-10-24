import { ValidationError } from '../errors/DomainError';

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
        const trimmed=email.trim().toLowerCase();
        if(!trimmed){
            throw new ValidationError('Email cannot be empty');
        }

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(trimmed)){
            throw new ValidationError('Invalid email format');
        }

        if (trimmed.length > 254) {
            throw new ValidationError('Email exceeds maximum length of 254 characters');
        }


        return trimmed;
    }

    equals(other: Email): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}