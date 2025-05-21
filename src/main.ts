interface MapLocation {
  x: number;
  y: number;
  name: string;
}

interface Parcel {
  location: MapLocation;
  destination: MapLocation;
}

const locations: MapLocation[] = [
  { x: 50, y: 50, name: 'A' },
  { x: 150, y: 50, name: 'B' },
  { x: 250, y: 50, name: 'C' },
  { x: 50, y: 150, name: 'D' },
  { x: 150, y: 150, name: 'E' },
  { x: 250, y: 150, name: 'F' },
  { x: 50, y: 250, name: 'G' },
  { x: 150, y: 250, name: 'H' },
];

const parcels: Parcel[] = [
  { location: locations[0], destination: locations[5] },
  { location: locations[2], destination: locations[6] },
  { location: locations[3], destination: locations[1] },
  { location: locations[7], destination: locations[1] },
  { location: locations[6], destination: locations[0] },
  { location: locations[5], destination: locations[2] },
];

// Function to create a location element on the map
function createLocationElement(location: MapLocation): void {
  const map = document.getElementById('map')!;

  const locationElement = document.createElement('div');
  locationElement.className = 'location';
  locationElement.style.left = `${location.x}px`;
  locationElement.style.top = `${location.y}px`;
  map.appendChild(locationElement);

  const label = document.createElement('div');
  label.className = 'location-label';
  label.style.left = `${location.x}px`;
  label.style.top = `${location.y - 15}px`;
  label.textContent = location.name;
  map.appendChild(label);
}

// Function to create a parcel element on the map
function createParcelElement(parcel: Parcel, index: number): void {
  const map = document.getElementById('map')!;

  const parcelElement = document.createElement('div');
  parcelElement.className = 'parcel';
  parcelElement.style.left = `${parcel.location.x}px`;
  parcelElement.style.top = `${parcel.location.y + 15}px`;
  parcelElement.id = `parcel-${index}`;
  map.appendChild(parcelElement);
}

// Initialize the map with locations and parcels
function initializeMap(): void {
  locations.forEach(createLocationElement);
  parcels.forEach((parcel, i) => createParcelElement(parcel, i));
}

// Animate robot movement to a specific (x, y) coordinate
function moveRobotTo(x: number, y: number, callback: () => void): void {
  const robot = document.getElementById('robot') as HTMLDivElement;
  if (!robot) return;

  const currentX = parseInt(robot.style.left || '0', 10);
  const currentY = parseInt(robot.style.top || '0', 10);
  const dx = x - currentX;
  const dy = y - currentY;
  const steps = 50;
  let step = 0;

  function animate() {
    step++;
    if (step >= steps) {
      robot.style.left = `${x}px`;
      robot.style.top = `${y}px`;
      callback();
      return;
    }

    const progress = step / steps;
    robot.style.left = `${currentX + dx * progress}px`;
    robot.style.top = `${currentY + dy * progress}px`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Start the delivery process
function startDelivery(): void {
  let currentParcelIndex = 0;
  let carriedParcel: Parcel | null = null;

  function deliverNextParcel(): void {
    if (currentParcelIndex >= parcels.length) {
      console.log('✅ All parcels delivered!');
      initializeMap();
      return;
    }

    const parcel = parcels[currentParcelIndex];

    if (carriedParcel === null) {
      console.log(`🚚 Moving to pick up parcel at ${parcel.location.name}`);

      moveRobotTo(parcel.location.x, parcel.location.y, () => {
        console.log(`📦 Picked up parcel at ${parcel.location.name}`);
        carriedParcel = parcel;

        // Remove parcel element from DOM after pickup
        document.getElementById(`parcel-${currentParcelIndex}`)?.remove();

        deliverNextParcel();
      });
    } else {
      console.log(`🚀 Delivering parcel to ${carriedParcel.destination.name}`);

      moveRobotTo(
        carriedParcel.destination.x,
        carriedParcel.destination.y,
        () => {
          console.log(
            `✅ Delivered parcel to ${carriedParcel!.destination.name}`,
          );

          // No need to re-create parcel element after delivery

          carriedParcel = null;
          currentParcelIndex++;
          deliverNextParcel();
        },
      );
    }
  }

  deliverNextParcel();
}

// Initialize page events
document.addEventListener('DOMContentLoaded', () => {
  initializeMap();
  document
    .getElementById('startButton')
    ?.addEventListener('click', startDelivery);
});
