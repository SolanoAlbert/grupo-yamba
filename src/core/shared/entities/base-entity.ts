/**
 * BaseEntity class representing the core attributes of an entity.
 */
export abstract class BaseEntity {
    constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {

        if (!id || id.trim() === '') {
            throw new Error('ID cannot be empty');
        }

    if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
      throw new Error('createdAt must be a valid Date');
    }
    if (!(updatedAt instanceof Date) || Number.isNaN(updatedAt.getTime())) {
      throw new Error('updatedAt must be a valid Date');
    }
    if (updatedAt.getTime() < createdAt.getTime()) {
      throw new Error('updatedAt cannot be earlier than createdAt');
    }
    }

     /**
   * Compares this entity with another based on their IDs.
   * @param entity - Entity to compare
   * @returns true if they have the same ID
   */
  equals(entity: BaseEntity): boolean {
    if (!entity) return false;
    return this.id === entity.id;
  }

  /**
   * Converts the entity to a plain object representation.
   * Must be implemented by each child entity.
   */
  abstract toObject(): Record<string, unknown>;


}