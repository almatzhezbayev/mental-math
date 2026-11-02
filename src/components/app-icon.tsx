import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';

function symbol(ios: SFSymbol, material: AndroidSymbol) {
  return { ios, android: material, web: material };
}

const ICONS = {
  add: symbol('plus', 'add'),
  barbell: symbol('dumbbell.fill', 'fitness_center'),
  'barbell-outline': symbol('dumbbell', 'fitness_center'),
  checkmark: symbol('checkmark', 'check'),
  close: symbol('xmark', 'close'),
  flame: symbol('flame.fill', 'local_fire_department'),
  flash: symbol('bolt.fill', 'bolt'),
  help: symbol('questionmark', 'help'),
  hourglass: symbol('hourglass', 'hourglass_empty'),
  infinite: symbol('infinity', 'all_inclusive'),
  leaf: symbol('leaf.fill', 'eco'),
  'lock-closed': symbol('lock.fill', 'lock'),
  people: symbol('person.2.fill', 'group'),
  'people-outline': symbol('person.2', 'group'),
  search: symbol('magnifyingglass', 'search'),
  'shield-half': symbol('shield.fill', 'shield'),
  speedometer: symbol('speedometer', 'speed'),
  star: symbol('star.fill', 'star'),
  'timer-outline': symbol('timer', 'timer'),
  'trending-up': symbol('chart.line.uptrend.xyaxis', 'trending_up'),
  trophy: symbol('trophy.fill', 'emoji_events'),
} as const;

export type AppIconName = keyof typeof ICONS;

export function AppIcon({ name, size, color }: { name: AppIconName; size: number; color: string }) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} />;
}
