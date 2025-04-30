import { describe, it, expect } from 'vitest';
import { VillageState, buildGraph } from '../ex-2';

describe('VillageState', () => {
  it('moves robot and updates parcels correctly', () => {
    const state = new VillageState('Post Office', [
      { place: 'Post Office', address: 'Shop' },
      { place: 'Cabin', address: 'Shop' },
    ]);
    const state2 = state.move("Alice's House");
    const state3 = state2.move('Cabin');

    expect(state3.currentRobotPlace).toBe('Cabin');
    expect(state3.remainingParcels.length).toBe(2);
    expect(state3.remainingParcels[0].place).toBe('Cabin');
  });

  it('does not move robot if destination is invalid', () => {
    const state = new VillageState('Post Office', []);
    const newState = state.move("Grete's House");
    expect(newState).toBe(state);
  });

  it('random creates parcels with different place and address', () => {
    const randomState = VillageState.random(10);
    for (const parcel of randomState.remainingParcels) {
      expect(parcel.place).not.toBe(parcel.address);
    }
  });
});

describe('buildGraph', () => {
  it('creates a bidirectional graph', () => {
    const graph = buildGraph(['A-B', 'A-C']);
    expect(graph['A']).toContain('B');
    expect(graph['A']).toContain('C');
    expect(graph['B']).toContain('A');
    expect(graph['C']).toContain('A');
  });
});
