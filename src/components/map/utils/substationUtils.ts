
import { PalmettoHouse, PGESubstation } from '@/types/palmetto';
import { calculateDistance } from '@/utils/distance';

export function findNearestSubstation(house: PalmettoHouse, substations: PGESubstation[]): PGESubstation | null {
  if (!substations || substations.length === 0) return null;

  let nearestSubstation: PGESubstation | null = null;
  let minDistance = Infinity;

  substations.forEach(substation => {
    if (!substation.latitude || !substation.longitude) return;

    const distance = calculateDistance(
      house.latitude,
      house.longitude,
      substation.latitude,
      substation.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestSubstation = substation;
    }
  });

  return nearestSubstation;
}
