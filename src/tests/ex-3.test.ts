import { describe, it, expect } from 'vitest';
import { PGroup } from '../ex-3';

describe('PGroup', () => {
  it('should return an empty group', () => {
    const empty = PGroup.empty<number>();
    expect(empty.toArray()).toEqual([]);
  });

  it('should add values immutably', () => {
    const group = PGroup.empty<string>().add('x');
    expect(group.has('x')).toBe(true);
    expect(PGroup.empty<string>().has('x')).toBe(false);
  });

  it('should delete values immutably', () => {
    const group = PGroup.empty<string>().add('a').add('b');
    const afterDelete = group.delete('a');
    expect(afterDelete.has('a')).toBe(false);
    expect(afterDelete.has('b')).toBe(true);
  });

  it('should not duplicate values', () => {
    const group = PGroup.empty<number>().add(1).add(1);
    expect(group.toArray()).toEqual([1]);
  });

  it('should return the same instance when deleting non-existent value', () => {
    const group = PGroup.empty<string>().add('x');
    const result = group.delete('y');
    expect(result).toBe(group);
  });
});
