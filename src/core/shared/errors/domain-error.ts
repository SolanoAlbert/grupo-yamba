/**
 * Base class for domain-specific errors.
 * 
 */
export class DomainError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly statusCode: number = 400
    ){
        super(message);
        this.name = this.constructor.name;
        // Keep proper stack trace when available
        const AnyError = Error as unknown as {
            captureStackTrace?: (
                target: unknown,
                ctor?: ((...args: unknown[]) => unknown) | (new (...args: unknown[]) => unknown)
            ) => void;
        };
        if (typeof AnyError.captureStackTrace === 'function') {
            AnyError.captureStackTrace(
                this,
                this.constructor as unknown as ((...args: unknown[]) => unknown) | (new (...args: unknown[]) => unknown)
            );
        }
    }
}

/**
 * Authentication error
 */
export class UnauthorizedError extends DomainError {
    constructor(message: string = "Unauthorized access") {
        super(message, 'UNAUTHORIZED', 401);
    }
}

/**
 * Error when a requested resource is not found.
 */
export class NotFoundError extends DomainError {
    constructor(resource: string, identifier?: string) {
        const message = identifier 
            ? `${resource} with identifier "${identifier}" not found`
            : `${resource} not found`;
        super(message, 'NOT_FOUND', 404);
    }
}

/**
 * Permission denied error.
 */
export class ForbiddenError extends DomainError {
    constructor(message:string="Forbidden") {
        super(message, 'FORBIDDEN', 403);
    }
}

/**
 * Conflict error (e.g., resource already exists)
 */
export class ConflictError extends DomainError {
    constructor(message:string) {
        super(message, 'CONFLICT', 409);
    }
}

/**
 * Validation error for invalid data.
 */
export class ValidationError extends DomainError {
    constructor(message:string,field?:string) {
        const fullMessage= field
            ? `Validation error on field "${field}": ${message}`
            : `Validation error: ${message}`;
        super(fullMessage, 'VALIDATION_ERROR', 422);
    }
}
