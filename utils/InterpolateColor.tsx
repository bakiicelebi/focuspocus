export const interpolateColor = (
  color1: string,
  color2: string,
  factor: number
) => {
  if (factor > 1) factor = 1;
  if (factor < 0) factor = 0;

  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const a1 = color1.length > 7 ? parseInt(color1.substring(7, 9), 16) : 255;

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  const a2 = color2.length > 7 ? parseInt(color2.substring(7, 9), 16) : 255;

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  const a = Math.round(a1 + factor * (a2 - a1));

  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
};
