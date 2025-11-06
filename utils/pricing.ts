export function hourlyRateFromDaily(daily: number): number {
  return daily / 24;
}

export function computeExtensionCost(daily: number, minutes: number): number {
  if (daily <= 0 || minutes <= 0) return 0;
  
  const hours = minutes / 60;
  // Arrotonda ai 15' superiori
  // Esempio: 1.1 ore (66 min) -> 1.1 * 4 = 4.4 -> ceil(4.4) = 5 -> 5 / 4 = 1.25 ore
  // Esempio: 1.5 ore (90 min) -> 1.5 * 4 = 6.0 -> ceil(6.0) = 6 -> 6 / 4 = 1.5 ore
  const billedHours = Math.ceil(hours * 4) / 4;
  
  const cost = billedHours * hourlyRateFromDaily(daily);
  
  // Arrotonda al centesimo più vicino
  return Math.round(cost * 100) / 100;
}