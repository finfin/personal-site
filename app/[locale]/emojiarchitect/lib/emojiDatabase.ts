// Emoji composition database with compatibility rules

export interface BaseEmoji {
  codePoint: string;
  emoji: string;
  name: string;
  category: string;
  combinable: boolean;
  compatibleWith: string[];
}

export interface CombinedEmoji {
  composed: string;
  components: BaseEmoji[];
  description: string;
  category: string;
  zwjCount: number;
}

// Base emoji database with composition compatibility
export const baseEmojis: BaseEmoji[] = [
  // People - Gender Neutral
  {
    codePoint: 'U+1F9D1',
    emoji: '🧑',
    name: 'Person',
    category: 'People',
    combinable: true,
    compatibleWith: ['U+1F4BB', 'U+2695', 'U+1F3A8', 'U+1F527', 'U+1F373', 'U+1F692', 'U+1F9AF', 'U+1F469', 'U+1F9D1']
  },
  // People - Male
  {
    codePoint: 'U+1F468',
    emoji: '👨',
    name: 'Man',
    category: 'People',
    combinable: true,
    compatibleWith: ['U+1F4BB', 'U+2695', 'U+1F3A8', 'U+1F527', 'U+1F373', 'U+1F692', 'U+1F9AF', 'U+1F469', 'U+1F467', 'U+1F466']
  },
  // People - Female
  {
    codePoint: 'U+1F469',
    emoji: '👩',
    name: 'Woman',
    category: 'People',
    combinable: true,
    compatibleWith: ['U+1F4BB', 'U+2695', 'U+1F3A8', 'U+1F527', 'U+1F373', 'U+1F692', 'U+1F9AF', 'U+1F468', 'U+1F467', 'U+1F466']
  },
  // Children
  {
    codePoint: 'U+1F467',
    emoji: '👧',
    name: 'Girl',
    category: 'People',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1', 'U+1F466']
  },
  {
    codePoint: 'U+1F466',
    emoji: '👦',
    name: 'Boy',
    category: 'People',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1', 'U+1F467']
  },
  // Professions/Objects
  {
    codePoint: 'U+1F4BB',
    emoji: '💻',
    name: 'Laptop Computer',
    category: 'Objects',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  },
  {
    codePoint: 'U+2695',
    emoji: '⚕️',
    name: 'Medical Symbol',
    category: 'Objects',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  },
  {
    codePoint: 'U+1F3A8',
    emoji: '🎨',
    name: 'Artist Palette',
    category: 'Objects',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  },
  {
    codePoint: 'U+1F527',
    emoji: '🔧',
    name: 'Wrench',
    category: 'Objects',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  },
  {
    codePoint: 'U+1F373',
    emoji: '🍳',
    name: 'Cooking',
    category: 'Objects',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  },
  {
    codePoint: 'U+1F692',
    emoji: '🚒',
    name: 'Fire Engine',
    category: 'Objects',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  },
  {
    codePoint: 'U+1F9AF',
    emoji: '🦯',
    name: 'White Cane',
    category: 'Objects',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  },
  // Hearts for couples
  {
    codePoint: 'U+2764',
    emoji: '❤️',
    name: 'Red Heart',
    category: 'Symbols',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  },
  // Kiss mark
  {
    codePoint: 'U+1F48B',
    emoji: '💋',
    name: 'Kiss Mark',
    category: 'Symbols',
    combinable: true,
    compatibleWith: ['U+1F468', 'U+1F469', 'U+1F9D1']
  }
];

// Predefined complex emojis for decomposition
export const complexEmojis: CombinedEmoji[] = [
  {
    composed: '👨‍💻',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+1F4BB')!
    ],
    description: 'Man Technologist',
    category: 'Profession',
    zwjCount: 1
  },
  {
    composed: '👩‍💻',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+1F4BB')!
    ],
    description: 'Woman Technologist',
    category: 'Profession',
    zwjCount: 1
  },
  {
    composed: '🧑‍💻',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F9D1')!,
      baseEmojis.find(e => e.codePoint === 'U+1F4BB')!
    ],
    description: 'Technologist',
    category: 'Profession',
    zwjCount: 1
  },
  {
    composed: '👨‍⚕️',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+2695')!
    ],
    description: 'Man Health Worker',
    category: 'Profession',
    zwjCount: 1
  },
  {
    composed: '👩‍⚕️',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+2695')!
    ],
    description: 'Woman Health Worker',
    category: 'Profession',
    zwjCount: 1
  },
  {
    composed: '👨‍🎨',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+1F3A8')!
    ],
    description: 'Man Artist',
    category: 'Profession',
    zwjCount: 1
  },
  {
    composed: '👩‍🎨',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+1F3A8')!
    ],
    description: 'Woman Artist',
    category: 'Profession',
    zwjCount: 1
  },
  {
    composed: '👨‍👩‍👧',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+1F467')!
    ],
    description: 'Family: Man, Woman, Girl',
    category: 'Family',
    zwjCount: 2
  },
  {
    composed: '👨‍👩‍👦',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+1F466')!
    ],
    description: 'Family: Man, Woman, Boy',
    category: 'Family',
    zwjCount: 2
  },
  {
    composed: '👨‍👩‍👧‍👦',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+1F467')!,
      baseEmojis.find(e => e.codePoint === 'U+1F466')!
    ],
    description: 'Family: Man, Woman, Girl, Boy',
    category: 'Family',
    zwjCount: 3
  },
  {
    composed: '👩‍👩‍👧',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+1F467')!
    ],
    description: 'Family: Woman, Woman, Girl',
    category: 'Family',
    zwjCount: 2
  },
  {
    composed: '👨‍👨‍👧',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+1F467')!
    ],
    description: 'Family: Man, Man, Girl',
    category: 'Family',
    zwjCount: 2
  },
  {
    composed: '👨‍❤️‍👨',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+2764')!,
      baseEmojis.find(e => e.codePoint === 'U+1F468')!
    ],
    description: 'Couple with Heart: Man, Man',
    category: 'Couple',
    zwjCount: 2
  },
  {
    composed: '👩‍❤️‍👩',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F469')!,
      baseEmojis.find(e => e.codePoint === 'U+2764')!,
      baseEmojis.find(e => e.codePoint === 'U+1F469')!
    ],
    description: 'Couple with Heart: Woman, Woman',
    category: 'Couple',
    zwjCount: 2
  },
  {
    composed: '👨‍❤️‍👩',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+2764')!,
      baseEmojis.find(e => e.codePoint === 'U+1F469')!
    ],
    description: 'Couple with Heart: Man, Woman',
    category: 'Couple',
    zwjCount: 2
  },
  {
    composed: '👨‍💋‍👨',
    components: [
      baseEmojis.find(e => e.codePoint === 'U+1F468')!,
      baseEmojis.find(e => e.codePoint === 'U+1F48B')!,
      baseEmojis.find(e => e.codePoint === 'U+1F468')!
    ],
    description: 'Kiss: Man, Man',
    category: 'Couple',
    zwjCount: 2
  }
];

// Utility functions
export function getCompatibleEmojis(selectedEmoji: BaseEmoji): BaseEmoji[] {
  return baseEmojis.filter(emoji => 
    selectedEmoji.compatibleWith.includes(emoji.codePoint) && 
    emoji.codePoint !== selectedEmoji.codePoint
  );
}

export function canCombine(emoji1: BaseEmoji, emoji2: BaseEmoji): boolean {
  return emoji1.compatibleWith.includes(emoji2.codePoint) || 
         emoji2.compatibleWith.includes(emoji1.codePoint);
}

export function composeEmojis(emojis: BaseEmoji[]): string {
  if (emojis.length === 0) {
    return '';
  }
  if (emojis.length === 1) {
    return emojis[0].emoji;
  }
  
  // Join emojis with ZWJ (Zero Width Joiner)
  const ZWJ = '\u200D';
  return emojis.map(emoji => emoji.emoji).join(ZWJ);
}

export function getEmojisByCategory(category: string): BaseEmoji[] {
  return baseEmojis.filter(emoji => emoji.category === category);
}

export function getCombinableEmojis(): BaseEmoji[] {
  return baseEmojis.filter(emoji => emoji.combinable);
}

export function findEmojiByCodePoint(codePoint: string): BaseEmoji | undefined {
  return baseEmojis.find(emoji => emoji.codePoint === codePoint);
}