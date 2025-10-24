import {ValidationError} from '../errors/DomainError';

/**
 * Slug validation
 * For friendly URLs
 * */
export class Slug {
  private readonly _value: string;
    constructor(slug: string) {
        this._value = this.validate(slug);
    }
    get value(): string {
        return this._value;
    }

    /**
     * Creates a slug from a title
     * Transforms normal text into URL-friendly format
     */

    static fromText(text: string): Slug {
        const slug=text
        .toLowerCase()                          // 1. Lowercase 
            .trim()                             // 2. Remove whitespace from edges
            .replace(/\s+/g, '-')               // 3. Spaces → hyphens
            .replace(/-+/g, '-')                // 4. Multiple hyphens → one
            .replace(/[^\w\-]+/g, '')           // 5. Remove special characters
            .normalize('NFD')                   // 6. Decompose accents
            .replace(/[\u0300-\u036f]/g, '')    // 7. Remove accents
            .replace(/^-+|-+$/g, '');           // 8. Clean up hyphens from edges

        return new Slug(slug);
    }

    /** Validates the slug format */
    private validate(slug: string): string {
        const trimmed = slug.trim();

        if(!trimmed){
            throw new ValidationError('Slug cannot be empty');
        }

        // Only lowercase letters, numbers and hyphens (no leading/trailing or consecutive)
         const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(trimmed)) {
            throw new ValidationError(
                'Slug must contain only lowercase letters, numbers, and hyphens',
                'slug'
            );
        }

         if (trimmed.length > 200) {
            throw new ValidationError('Slug too long (max 200 characters)', 'slug');
        }
        return trimmed;
    }

    /**
     * Compares two slugs for equality
     */
    equals(other: Slug): boolean {
        if(!other){
            return false;
        }
        return this._value === other.value;
    }

    /**Converts slug to string */
    toString(): string {
        return this._value;
    }

    /** Converts slug to JSON */
    toJSON(): string {
        return JSON.stringify({ slug: this._value });
    }













}