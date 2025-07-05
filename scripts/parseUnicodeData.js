#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 🎯 Simple Multi-Select Emoji Parser
 * 
 * Creates:
 * 1. List of all individual emojis used in sequences
 * 2. List of all complex emojis with their base components
 * 3. Fast lookup for filtering by selected components
 */

class SimpleEmojiParser {
  constructor() {
    this.allBaseEmojis = new Map(); // All individual emojis used
    this.complexEmojis = new Map(); // All complex emoji sequences
    this.componentIndex = new Map(); // Component -> complex emojis lookup
  }

  /**
   * 🚀 Main parsing function
   */
  async parseUnicodeData() {
    console.log('🚀 Starting simple emoji parsing...');
    
    const inputPath = path.join(__dirname, '../app/[locale]/emojicodex/data/unicode-emoji-data.txt');
    const outputPath = path.join(__dirname, '../app/[locale]/emojicodex/data/unicodeEmojiData.json');
    
    try {
      // Load and parse data
      const lines = this.loadUnicodeFile(inputPath);
      this.parseSequences(lines);
      
      // Generate output
      const result = this.generateOutput();
      
      // Write JSON
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      
      this.printStats();
      console.log(`✅ Generated: ${outputPath}`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Parsing failed:', error);
      throw error;
    }
  }

  /**
   * 📖 Load Unicode data file
   */
  loadUnicodeFile(filePath) {
    console.log('📖 Loading Unicode data...');
    
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'));
    
    console.log(`📊 Found ${lines.length} sequences`);
    return lines;
  }

  /**
   * 🔍 Parse all sequences
   */
  parseSequences(lines) {
    console.log('🔍 Parsing sequences...');
    
    for (const line of lines) {
      try {
        this.parseSequenceLine(line);
      } catch (error) {
        console.warn(`⚠️  Failed to parse: ${line.substring(0, 50)}...`);
      }
    }
  }

  /**
   * 📝 Parse individual sequence line
   */
  parseSequenceLine(line) {
    const parts = line.split(';');
    if (parts.length < 3) return;
    
    const codePointsStr = parts[0].trim();
    const type = parts[1].trim();
    const description = parts[2].split('#')[0].trim();
    
    if (type !== 'RGI_Emoji_ZWJ_Sequence') return;
    
    // Parse full sequence
    const fullSequence = codePointsStr.split(' ').map(cp => `U+${cp}`);
    
    // Extract base components (no ZWJ, no FE0F)
    const baseComponents = fullSequence.filter(cp => 
      cp !== 'U+200D' && cp !== 'U+FE0F'
    );
    
    // Generate final emoji
    const finalEmoji = String.fromCodePoint(
      ...fullSequence.map(cp => parseInt(cp.slice(2), 16))
    );
    
    // Register all base components as individual emojis
    for (const component of baseComponents) {
      this.registerBaseEmoji(component);
    }
    
    // Register complex emoji
    this.registerComplexEmoji(baseComponents, fullSequence, finalEmoji, description);
  }

  /**
   * 📝 Register individual base emoji
   */
  registerBaseEmoji(codePoint) {
    if (this.allBaseEmojis.has(codePoint)) {
      this.allBaseEmojis.get(codePoint).frequency++;
      return;
    }
    
    const emoji = String.fromCodePoint(parseInt(codePoint.slice(2), 16));
    const name = this.getEmojiName(codePoint);
    const category = this.getEmojiCategory(codePoint);
    
    this.allBaseEmojis.set(codePoint, {
      codePoint,
      emoji,
      name,
      category,
      frequency: 1
    });
  }

  /**
   * 📝 Register complex emoji sequence
   */
  registerComplexEmoji(baseComponents, fullSequence, finalEmoji, description) {
    const id = baseComponents.join('|');
    
    const complexEmoji = {
      id,
      baseComponents,
      fullSequence,
      emoji: finalEmoji,
      description: description.trim(),
      category: this.categorizeSequence(description),
      componentCount: baseComponents.length
    };
    
    this.complexEmojis.set(id, complexEmoji);
    
    // Add to component index for fast lookup
    for (const component of baseComponents) {
      if (!this.componentIndex.has(component)) {
        this.componentIndex.set(component, []);
      }
      this.componentIndex.get(component).push(id);
    }
  }

  /**
   * 🏷️ Get emoji name
   */
  getEmojiName(codePoint) {
    const names = {
      'U+1F468': 'Man',
      'U+1F469': 'Woman',
      'U+1F9D1': 'Person',
      'U+1F466': 'Boy',
      'U+1F467': 'Girl',
      'U+1F9B0': 'Red Hair',
      'U+1F9B1': 'Curly Hair',
      'U+1F9B2': 'Bald',
      'U+1F9B3': 'White Hair',
      'U+2764': 'Red Heart',
      'U+1F48B': 'Kiss Mark',
      'U+1F4BB': 'Laptop Computer',
      'U+2695': 'Medical Symbol',
      'U+1F33E': 'Sheaf of Rice',
      'U+1F373': 'Cooking',
      'U+1F3A8': 'Artist Palette',
      'U+1F692': 'Fire Engine',
      'U+1F680': 'Rocket',
      'U+1F91D': 'Handshake',
      // Skin tones
      'U+1F3FB': 'Light Skin Tone',
      'U+1F3FC': 'Medium-Light Skin Tone',
      'U+1F3FD': 'Medium Skin Tone',
      'U+1F3FE': 'Medium-Dark Skin Tone',
      'U+1F3FF': 'Dark Skin Tone'
    };
    
    return names[codePoint] || `Emoji ${codePoint}`;
  }

  /**
   * 🏷️ Get emoji category
   */
  getEmojiCategory(codePoint) {
    // People & Body emojis
    if (codePoint.startsWith('U+1F46') || codePoint.startsWith('U+1F469') || 
        codePoint.startsWith('U+1F9D1') || codePoint.startsWith('U+1F9B')) {
      return 'People & Body';
    }
    
    // Gesture emojis (U+1F64X range)
    if (codePoint.startsWith('U+1F64')) {
      return 'People & Body';
    }
    
    // Skin tones
    if (codePoint.startsWith('U+1F3F')) {
      return 'People & Body';
    }
    
    // Hearts and emotion
    if (codePoint === 'U+2764' || codePoint === 'U+1F48B') {
      return 'Smileys & Emotion';
    }
    
    // Gender symbols
    if (codePoint === 'U+2640' || codePoint === 'U+2642') {
      return 'Symbols';
    }
    
    // Activity and sports
    if (codePoint.startsWith('U+1F3') && !codePoint.startsWith('U+1F3F')) {
      return 'Activities';
    }
    
    // Animals and nature
    if (codePoint.startsWith('U+1F42') || codePoint.startsWith('U+1F43') || 
        codePoint.startsWith('U+1F98') || codePoint.startsWith('U+1F99')) {
      return 'Animals & Nature';
    }
    
    // Food and drink
    if (codePoint.startsWith('U+1F34') || codePoint.startsWith('U+1F35') ||
        codePoint.startsWith('U+1F37') || codePoint.startsWith('U+1F96')) {
      return 'Food & Drink';
    }
    
    // Travel and places
    if (codePoint.startsWith('U+1F68') || codePoint.startsWith('U+1F69') ||
        codePoint.startsWith('U+1F6A') || codePoint.startsWith('U+1F6B')) {
      return 'Travel & Places';
    }
    
    return 'Objects';
  }

  /**
   * 🏷️ Categorize complex sequence
   */
  categorizeSequence(description) {
    const desc = description.toLowerCase();
    
    if (desc.includes('couple') || desc.includes('kiss')) return 'Couple';
    if (desc.includes('family')) return 'Family';
    if (desc.includes('holding hands')) return 'Gesture';
    if (desc.includes('hair') || desc.includes('bald')) return 'Hair';
    if (desc.includes('health worker') || desc.includes('technologist') || 
        desc.includes('artist') || desc.includes('farmer') ||
        desc.includes('cook') || desc.includes('mechanic') ||
        desc.includes('scientist') || desc.includes('firefighter') ||
        desc.includes('pilot') || desc.includes('astronaut')) return 'Profession';
    
    return 'Other';
  }

  /**
   * 📤 Generate final output
   */
  generateOutput() {
    console.log('📤 Generating output...');
    
    // Convert to arrays and sort
    const baseEmojis = Array.from(this.allBaseEmojis.values())
      .sort((a, b) => b.frequency - a.frequency); // Sort by frequency
    
    const complexEmojis = Array.from(this.complexEmojis.values())
      .sort((a, b) => a.componentCount - b.componentCount); // Sort by complexity
    
    // Create lookup index
    const lookupIndex = {};
    for (const [component, emojiIds] of this.componentIndex) {
      lookupIndex[component] = emojiIds;
    }
    
    return {
      // All individual emojis for selection
      baseEmojis,
      
      // All complex emojis with their components
      complexEmojis,
      
      // Fast lookup: component -> list of complex emoji IDs
      lookupIndex,
      
      // Metadata
      metadata: {
        version: '3.0.0',
        generatedAt: new Date().toISOString(),
        totalBaseEmojis: baseEmojis.length,
        totalComplexEmojis: complexEmojis.length,
        categories: [...new Set(complexEmojis.map(e => e.category))]
      }
    };
  }

  /**
   * 📊 Print statistics
   */
  printStats() {
    console.log('\n📊 Parsing Results:');
    console.log(`   Base Emojis: ${this.allBaseEmojis.size}`);
    console.log(`   Complex Emojis: ${this.complexEmojis.size}`);
    console.log(`   Component Index Entries: ${this.componentIndex.size}`);
    
    // Show most frequent base emojis
    const topBase = Array.from(this.allBaseEmojis.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
      .map(e => `${e.emoji}(${e.frequency})`)
      .join(' ');
    
    console.log(`   Top Base Emojis: ${topBase}`);
  }
}

/**
 * 🚀 Main execution
 */
async function main() {
  try {
    const parser = new SimpleEmojiParser();
    const result = await parser.parseUnicodeData();
    
    console.log('\n🎉 Simple emoji parsing completed!');
    console.log(`📋 Output structure:`);
    console.log(`   • ${result.baseEmojis.length} individual emojis for selection`);
    console.log(`   • ${result.complexEmojis.length} complex emoji combinations`);
    console.log(`   • Fast lookup index for filtering`);
    
    return result;
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { SimpleEmojiParser, main };