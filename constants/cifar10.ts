export const CIFAR10_CLASSES = [
  { id: 0, name: "Airplane",    emoji: "✈️",  color: "#7C3AED", desc: "Fixed-wing aircraft" },
  { id: 1, name: "Automobile",  emoji: "🚗",  color: "#6D28D9", desc: "Four-wheeled vehicles" },
  { id: 2, name: "Bird",        emoji: "🐦",  color: "#5B21B6", desc: "Feathered vertebrates" },
  { id: 3, name: "Cat",         emoji: "🐱",  color: "#7C3AED", desc: "Domestic felines" },
  { id: 4, name: "Deer",        emoji: "🦌",  color: "#6D28D9", desc: "Herbivorous mammals" },
  { id: 5, name: "Dog",         emoji: "🐶",  color: "#5B21B6", desc: "Canine companions" },
  { id: 6, name: "Frog",        emoji: "🐸",  color: "#7C3AED", desc: "Amphibious creatures" },
  { id: 7, name: "Horse",       emoji: "🐴",  color: "#6D28D9", desc: "Equine mammals" },
  { id: 8, name: "Ship",        emoji: "🚢",  color: "#5B21B6", desc: "Large watercraft" },
  { id: 9, name: "Truck",       emoji: "🚛",  color: "#7C3AED", desc: "Heavy cargo vehicles" },
];

export const CLASS_NAMES = CIFAR10_CLASSES.map(c => c.name);
