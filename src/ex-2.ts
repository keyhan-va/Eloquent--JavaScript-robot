export type Parcel = {
  place: string;
  address: string;
};

export type Graph = {
  [key: string]: string[];
};

export const ROADS: string[] = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  'Marketplace-Farm',
  'Marketplace-Post Office',
  'Marketplace-Shop',
  'Marketplace-Town Hall',
  'Shop-Town Hall',
];

export const mailRoute: string[] = [
  "Alice's House",
  'Cabin',
  "Alice's House",
  "Bob's House",
  'Town Hall',
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  'Shop',
  "Grete's House",
  'Farm',
  'Marketplace',
  'Post Office',
];

export function buildGraph(roads: string[]): Graph {
  const graph: Graph = {};
  for (const road of roads) {
    const [from, to] = road.split('-');
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];
    graph[from].push(to);
    graph[to].push(from);
  }
  return graph;
}

export const roadGraph = buildGraph(ROADS);

export class VillageState {
  currentRobotPlace: string;
  remainingParcels: Parcel[];

  constructor(place: string, parcels: Parcel[]) {
    this.currentRobotPlace = place;
    this.remainingParcels = parcels;
  }

  move(destination: string): VillageState {
    if (!roadGraph[this.currentRobotPlace].includes(destination)) {
      return this;
    }

    const movedParcels = this.remainingParcels.map((parcel) =>
      parcel.place !== this.currentRobotPlace
        ? parcel
        : { place: destination, address: parcel.address },
    );

    const undeliveredParcels = movedParcels.filter(
      (parcel) => parcel.place !== parcel.address,
    );

    return new VillageState(destination, undeliveredParcels);
  }

  static random(parcelCount = 5): VillageState {
    const parcels: Parcel[] = [];
    const places = Object.keys(roadGraph);

    for (let i = 0; i < parcelCount; i++) {
      const address = randomPick(places);
      let place: string;
      do {
        place = randomPick(places);
      } while (place === address);
      parcels.push({ place, address });
    }

    return new VillageState('Post Office', parcels);
  }
}

export function randomPick<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export function runRobot(
  state: VillageState,
  robot: (
    state: VillageState,
    memory: string[],
  ) => { direction: string; routeMemory: string[] },
  routeMemory: string[],
): void {
  let turns = 0;
  while (state.remainingParcels.length > 0) {
    const action = robot(state, routeMemory);
    state = state.move(action.direction);
    routeMemory = action.routeMemory;
    turns++;
  }
  console.log(`Done in ${turns} turns`);
}

export function routeRobot(
  state: VillageState,
  routeMemory: string[],
): { direction: string; routeMemory: string[] } {
  if (routeMemory.length === 0) {
    routeMemory = mailRoute;
  }
  return { direction: routeMemory[0], routeMemory: routeMemory.slice(1) };
}
