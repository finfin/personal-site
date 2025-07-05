// Simple Multi-Select Emoji Database
// Users can select multiple base emojis and see all combinations containing them

import unicodeEmojiData from '../data/unicodeEmojiData.json';

export interface BaseEmoji {
  codePoint: string;
  emoji: string;
  name: string;
  category: string;
  frequency: number;
}

export interface ComplexEmoji {
  id: string;
  baseComponents: string[];
  fullSequence: string[];
  emoji: string;
  description: string;
  category: string;
  componentCount: number;
}

export interface EmojiDatabase {
  baseEmojis: BaseEmoji[];
  complexEmojis: ComplexEmoji[];
  lookupIndex: Record<string, string[]>;
}

/**
 * 🎯 Simple Emoji Composition System
 */
class SimpleEmojiDatabase {
  private data: EmojiDatabase;

  constructor() {
    this.data = unicodeEmojiData as EmojiDatabase;
  }

  /**
   * 📋 Get all selectable base emojis
   */
  getAllBaseEmojis(): BaseEmoji[] {
    return this.data.baseEmojis;
  }

  /**
   * 🔍 Find complex emojis containing ALL selected components
   */
  findComplexEmojis(selectedCodePoints: string[]): ComplexEmoji[] {
    if (selectedCodePoints.length === 0) {
      return this.data.complexEmojis;
    }

    // Find emojis that contain ALL selected components
    const matchingEmojiIds = this.findIntersection(selectedCodePoints);
    
    return matchingEmojiIds
      .map(id => this.data.complexEmojis.find(emoji => emoji.id === id))
      .filter(Boolean) as ComplexEmoji[];
  }

  /**
   * 🔍 Find intersection of emoji IDs containing all selected components
   */
  private findIntersection(codePoints: string[]): string[] {
    if (codePoints.length === 0) {
      return [];
    }
    
    // Start with emojis containing the first component
    let result = this.data.lookupIndex[codePoints[0]] || [];
    
    // Intersect with emojis containing each subsequent component
    for (let i = 1; i < codePoints.length; i++) {
      const nextSet = this.data.lookupIndex[codePoints[i]] || [];
      result = result.filter(id => nextSet.includes(id));
    }
    
    return result;
  }

  /**
   * 📊 Get statistics for selected components
   */
  getSelectionStats(selectedCodePoints: string[]): {
    totalMatches: number;
    categoryCounts: Record<string, number>;
    averageComplexity: number;
  } {
    const matches = this.findComplexEmojis(selectedCodePoints);
    
    const categoryCounts: Record<string, number> = {};
    let totalComplexity = 0;
    
    for (const emoji of matches) {
      categoryCounts[emoji.category] = (categoryCounts[emoji.category] || 0) + 1;
      totalComplexity += emoji.componentCount;
    }
    
    return {
      totalMatches: matches.length,
      categoryCounts,
      averageComplexity: matches.length > 0 ? totalComplexity / matches.length : 0
    };
  }

  /**
   * 🏷️ Get emojis by category
   */
  getBaseEmojisByCategory(category: string): BaseEmoji[] {
    return this.data.baseEmojis.filter(emoji => emoji.category === category);
  }

  /**
   * 🎯 Get most frequent base emojis (for suggestions)
   */
  getMostFrequentBaseEmojis(limit = 20): BaseEmoji[] {
    return this.data.baseEmojis
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  /**
   * 🔍 Search base emojis by name
   */
  searchBaseEmojis(query: string): BaseEmoji[] {
    const lowerQuery = query.toLowerCase();
    return this.data.baseEmojis.filter(emoji => 
      emoji.name.toLowerCase().includes(lowerQuery) ||
      emoji.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 📋 Get all categories
   */
  getAllCategories(): string[] {
    return Array.from(new Set(this.data.baseEmojis.map(emoji => emoji.category)));
  }

  /**
   * 📋 Get all complex emojis
   */
  getAllComplexEmojis(): ComplexEmoji[] {
    return this.data.complexEmojis;
  }

  /**
   * 📋 Get metadata
   */
  getMetadata() {
    return (this.data as EmojiDatabase & { metadata: unknown }).metadata;
  }
}

// Global instance
const emojiDB = new SimpleEmojiDatabase();

// Export public API
export function getAllBaseEmojis(): BaseEmoji[] {
  return emojiDB.getAllBaseEmojis();
}

export function findComplexEmojis(selectedCodePoints: string[]): ComplexEmoji[] {
  return emojiDB.findComplexEmojis(selectedCodePoints);
}

export function getSelectionStats(selectedCodePoints: string[]) {
  return emojiDB.getSelectionStats(selectedCodePoints);
}

export function getBaseEmojisByCategory(category: string): BaseEmoji[] {
  return emojiDB.getBaseEmojisByCategory(category);
}

export function getMostFrequentBaseEmojis(limit = 20): BaseEmoji[] {
  return emojiDB.getMostFrequentBaseEmojis(limit);
}

export function searchBaseEmojis(query: string): BaseEmoji[] {
  return emojiDB.searchBaseEmojis(query);
}

export function getAllCategories(): string[] {
  return emojiDB.getAllCategories();
}

export function getMetadata() {
  return emojiDB.getMetadata();
}

// Backwards compatibility exports (simplified)
export function getAllCombinableEmojis(): BaseEmoji[] {
  return getAllBaseEmojis();
}

export function getCompatibleEmojis(selectedEmoji: BaseEmoji): ComplexEmoji[] {
  return findComplexEmojis([selectedEmoji.codePoint]);
}

// Legacy types for compatibility
export interface UnicodeEmoji extends BaseEmoji {
  // For backwards compatibility
  codePoints: string[];
  hex: string[];
  isBase: boolean;
  canCombine: boolean;
  compatibleWith: string[];
  skinToneBase?: boolean;
}

export interface EmojiSequence extends ComplexEmoji {
  // For backwards compatibility  
  components: UnicodeEmoji[];
  zwjCount: number;
  hasVariationSelector?: boolean;
}

// Legacy functions
export function composeEmojisFromUnicode(emojis: UnicodeEmoji[]): string {
  const codePoints = emojis.map(e => e.codePoint || e.codePoints?.[0]).filter(Boolean);
  const matches = findComplexEmojis(codePoints);
  return matches[0]?.emoji || '';
}

export function findPredefinedSequence(emojis: UnicodeEmoji[]): EmojiSequence | null {
  const codePoints = emojis.map(e => e.codePoint || e.codePoints?.[0]).filter(Boolean);
  const matches = findComplexEmojis(codePoints);
  if (matches.length === 0) {
    return null;
  }
  
  const match = matches[0];
  return {
    ...match,
    components: emojis,
    zwjCount: match.fullSequence.filter(cp => cp === 'U+200D').length,
    hasVariationSelector: match.fullSequence.includes('U+FE0F')
  };
}

export const basePeopleEmojis = getBaseEmojisByCategory('People & Body');
export const combinableObjects = getAllBaseEmojis().filter(e => e.category !== 'People & Body');
export const allCombinableEmojis = getAllBaseEmojis();
export const predefinedSequences = emojiDB.getAllComplexEmojis();

// Note: BaseEmoji, ComplexEmoji, and EmojiDatabase are already exported as interfaces above