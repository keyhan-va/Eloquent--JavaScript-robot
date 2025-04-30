export class PGroup<T> {
  private constructor(private readonly members: T[]) {}

  static empty<T>(): PGroup<T> {
    return new PGroup<T>([]);
  }

  has(value: T): boolean {
    return this.members.includes(value);
  }

  add(value: T): PGroup<T> {
    return this.has(value) ? this : new PGroup([...this.members, value]);
  }

  delete(value: T): PGroup<T> {
    return this.has(value)
      ? new PGroup(this.members.filter((m) => m !== value))
      : this;
  }

  toArray(): T[] {
    return [...this.members];
  }
}
