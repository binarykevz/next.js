export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

export function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371;

  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lng - a.lng);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  return (
    2 *
    R *
    Math.asin(Math.sqrt(h))
  );
}

export function interpolateGreatCircle(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  t: number
) {
  const lat1 = toRadians(start.lat);
  const lon1 = toRadians(start.lng);

  const lat2 = toRadians(end.lat);
  const lon2 = toRadians(end.lng);

  const x1 =
    Math.cos(lat1) *
    Math.cos(lon1);

  const y1 =
    Math.cos(lat1) *
    Math.sin(lon1);

  const z1 = Math.sin(lat1);

  const x2 =
    Math.cos(lat2) *
    Math.cos(lon2);

  const y2 =
    Math.cos(lat2) *
    Math.sin(lon2);

  const z2 = Math.sin(lat2);

  const dot = Math.max(
    -1,
    Math.min(
      1,
      x1 * x2 +
        y1 * y2 +
        z1 * z2
    )
  );

  const angle = Math.acos(dot);

  if (Math.abs(angle) < 0.000001) {
    return {
      lat:
        start.lat +
        (end.lat - start.lat) * t,

      lng:
        start.lng +
        (end.lng - start.lng) * t,
    };
  }

  const sinAngle = Math.sin(angle);

  const a =
    Math.sin((1 - t) * angle) /
    sinAngle;

  const b =
    Math.sin(t * angle) /
    sinAngle;

  const x = a * x1 + b * x2;
  const y = a * y1 + b * y2;
  const z = a * z1 + b * z2;

  return {
    lat: toDegrees(
      Math.atan2(
        z,
        Math.sqrt(x * x + y * y)
      )
    ),

    lng: toDegrees(
      Math.atan2(y, x)
    ),
  };
}
