/* eslint-disable react/jsx-sort-props */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const codeBlockClasses = 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto border';
const inlineCodeClasses = 'bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono';

export function LearningMode() {
  const [activeSection, setActiveSection] = useState<string>('basics');

  const sections = [
    { id: 'basics', title: 'Unicode Basics', icon: '🔤' },
    { id: 'zwj', title: 'Zero Width Joiners', icon: '🔗' },
    { id: 'modifiers', title: 'Modifiers & Variations', icon: '🎨' },
    { id: 'composition', title: 'Composition Process', icon: '⚙️' },
    { id: 'examples', title: 'JavaScript Examples', icon: '💻' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Navigation Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Contents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3',
                  activeSection === section.id
                    ? 'dark:bg-white/10 bg-black/10 text-primary-foreground hover:bg-white/50 hover:dark:bg-black/30'
                    : 'hover:bg-muted'
                )}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">

        {/* Unicode Basics */}
        {activeSection === 'basics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔤</span>
                  Understanding Unicode and Emojis
                </CardTitle>
                <CardDescription>
                  Learn the fundamental concepts behind emoji representation in computers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What are Unicode Code Points?</h3>
                  <p className="text-muted-foreground mb-4">
                    Every emoji is represented by one or more Unicode code points. A code point is a unique number
                    that identifies a character in the Unicode standard.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-4 text-lg">
                      <span className="text-3xl">😀</span>
                      <span className="font-mono">U+1F600</span>
                      <span className="text-muted-foreground">GRINNING FACE</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Simple vs Complex Emojis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Simple Emojis</h4>
                      <p className="text-sm text-muted-foreground mb-3">Single Unicode code point</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">😀</span>
                          <code className={inlineCodeClasses}>U+1F600</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">❤️</span>
                          <code className={inlineCodeClasses}>U+2764</code>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">Complex Emojis</h4>
                      <p className="text-sm text-muted-foreground mb-3">Multiple code points combined</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">👨‍💻</span>
                          <code className={inlineCodeClasses}>U+1F468 + U+200D + U+1F4BB</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">👩‍👩‍👧‍👦</span>
                          <code className={inlineCodeClasses}>4 emojis + 3 joiners</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Zero Width Joiners */}
        {activeSection === 'zwj' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  Zero Width Joiners (ZWJ)
                </CardTitle>
                <CardDescription>
                  The invisible characters that make emoji composition possible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is a Zero Width Joiner?</h3>
                  <p className="text-muted-foreground mb-4">
                    The Zero Width Joiner (ZWJ) is an invisible Unicode character <code className={inlineCodeClasses}>U+200D</code>
                    that tells the renderer to combine adjacent emojis into a single glyph when possible.
                  </p>

                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-medium mb-2">Example: Man Technologist</h4>
                    <div className="font-mono text-sm space-y-2">
                      <div>👨 + <span className="bg-red-100 dark:bg-red-900 px-1 rounded">ZWJ</span> + 💻 = 👨‍💻</div>
                      <div className="text-xs text-muted-foreground">
                        U+1F468 + U+200D + U+1F4BB = U+1F468 U+200D U+1F4BB
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">How ZWJ Sequences Work</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Step 1: Individual Emojis</h4>
                      <div className="flex items-center gap-4 text-2xl">
                        <span>👨</span>
                        <span>💻</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Two separate emojis, displayed individually</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Step 2: Add ZWJ</h4>
                      <div className="flex items-center gap-2 text-lg font-mono">
                        <span>👨</span>
                        <span className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-xs">ZWJ</span>
                        <span>💻</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">ZWJ inserted between emojis</p>
                    </div>

                    <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
                      <h4 className="font-medium mb-2">Step 3: Combined Result</h4>
                      <div className="text-4xl">👨‍💻</div>
                      <p className="text-sm text-muted-foreground mt-2">Renderer combines them into a single glyph</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Family Sequences</h3>
                  <p className="text-muted-foreground mb-4">
                    Complex family emojis use multiple ZWJs to join several people together:
                  </p>

                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="space-y-2 text-sm font-mono">
                      <div>👩‍👩‍👧‍👧 = 👩 + ZWJ + 👩 + ZWJ + 👧 + ZWJ + 👧</div>
                      <div className="text-xs text-muted-foreground">
                        U+1F469 U+200D U+1F469 U+200D U+1F467 U+200D U+1F467
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modifiers */}
        {activeSection === 'modifiers' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Modifiers and Variations
                </CardTitle>
                <CardDescription>
                  How skin tones, gender variations, and other modifiers work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Skin Tone Modifiers</h3>
                  <p className="text-muted-foreground mb-4">
                    Skin tone modifiers are special Unicode characters that change the appearance of human emojis.
                    They use the Fitzpatrick scale with 5 different tones.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Base Emoji</h4>
                      <div className="border rounded-lg p-4">
                        <div className="text-3xl mb-2">👋</div>
                        <code className={inlineCodeClasses}>U+1F44B</code>
                        <p className="text-xs text-muted-foreground mt-1">WAVING HAND</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">With Skin Tone</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 border rounded">
                          <span className="text-2xl">👋🏽</span>
                          <code className={inlineCodeClasses}>U+1F44B U+1F3FD</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Base + Medium skin tone modifier</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">All Skin Tone Variations</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {[
                        { emoji: '👋🏻', code: 'U+1F3FB', name: 'Light' },
                        { emoji: '👋🏼', code: 'U+1F3FC', name: 'Medium-Light' },
                        { emoji: '👋🏽', code: 'U+1F3FD', name: 'Medium' },
                        { emoji: '👋🏾', code: 'U+1F3FE', name: 'Medium-Dark' },
                        { emoji: '👋🏿', code: 'U+1F3FF', name: 'Dark' },
                      ].map((item, index) => (
                        <div className="text-center p-2 border rounded" key={index}>
                          <div className="text-2xl mb-1">{item.emoji}</div>
                          <div className="text-xs font-mono">{item.code}</div>
                          <div className="text-xs text-muted-foreground">{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Gender Variations</h3>
                  <p className="text-muted-foreground mb-4">
                    Many emojis have gender variations created using ZWJ sequences with gender symbols.
                  </p>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Generic → Gendered</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl mb-2">🧑‍💻</div>
                          <div className="text-sm font-mono">🧑 + ZWJ + 💻</div>
                          <div className="text-xs text-muted-foreground">Generic Technologist</div>
                        </div>
                        <div>
                          <div className="text-3xl mb-2">👨‍💻</div>
                          <div className="text-sm font-mono">👨 + ZWJ + 💻</div>
                          <div className="text-xs text-muted-foreground">Man Technologist</div>
                        </div>
                        <div>
                          <div className="text-3xl mb-2">👩‍💻</div>
                          <div className="text-sm font-mono">👩 + ZWJ + 💻</div>
                          <div className="text-xs text-muted-foreground">Woman Technologist</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Variant Selectors</h3>
                  <p className="text-muted-foreground mb-4">
                    Some characters can be displayed as text or emoji using variant selectors.
                  </p>

                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Text Style</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">♠</span>
                          <code className={inlineCodeClasses}>U+2660 U+FE0E</code>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Text Variant Selector</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Emoji Style</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">♠️</span>
                          <code className={inlineCodeClasses}>U+2660 U+FE0F</code>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Emoji Variant Selector</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Composition Process */}
        {activeSection === 'composition' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  The Composition Process
                </CardTitle>
                <CardDescription>
                  Step-by-step guide to how emoji composition works in practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Step-by-Step Breakdown</h3>
                  <p className="text-muted-foreground mb-4">
                    Let&apos;s trace through creating a &quot;Woman Technologist with Medium Skin Tone&quot; emoji:
                  </p>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">1</span>
                        <h4 className="font-medium">Start with base character</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">👩</span>
                        <code className={inlineCodeClasses}>U+1F469</code>
                        <span className="text-muted-foreground">WOMAN</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">2</span>
                        <h4 className="font-medium">Add skin tone modifier</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">👩🏽</span>
                        <code className={inlineCodeClasses}>U+1F469 U+1F3FD</code>
                        <span className="text-muted-foreground">WOMAN + MEDIUM SKIN TONE</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-purple-50 dark:bg-purple-950">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">3</span>
                        <h4 className="font-medium">Add Zero Width Joiner</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">👩🏽‍</span>
                        <code className={inlineCodeClasses}>U+1F469 U+1F3FD U+200D</code>
                        <span className="text-muted-foreground">+ ZWJ (invisible)</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">4</span>
                        <h4 className="font-medium">Add profession emoji</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">👩🏽‍💻</span>
                        <code className={inlineCodeClasses}>U+1F469 U+1F3FD U+200D U+1F4BB</code>
                        <span className="text-muted-foreground">+ LAPTOP COMPUTER</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Rendering Process</h3>
                  <p className="text-muted-foreground mb-4">
                    How the system decides whether to combine or display separately:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded mt-1">1</span>
                      <div>
                        <h4 className="font-medium">Unicode Normalization</h4>
                        <p className="text-sm text-muted-foreground">
                          The text is normalized to ensure consistent representation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mt-1">2</span>
                      <div>
                        <h4 className="font-medium">ZWJ Sequence Detection</h4>
                        <p className="text-sm text-muted-foreground">
                          The renderer identifies sequences joined by ZWJ characters
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded mt-1">3</span>
                      <div>
                        <h4 className="font-medium">Font Lookup</h4>
                        <p className="text-sm text-muted-foreground">
                          Check if the font has a glyph for the complete sequence
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded mt-1">4</span>
                      <div>
                        <h4 className="font-medium">Fallback or Render</h4>
                        <p className="text-sm text-muted-foreground">
                          Either render the combined glyph or fall back to individual characters
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Compatibility Considerations</h3>
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-medium mb-2">⚠️ Not all sequences work everywhere</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Font support varies between platforms and devices</li>
                      <li>New emoji sequences may not work on older systems</li>
                      <li>Some combinations are valid Unicode but not standardized</li>
                      <li>Always test across different platforms and devices</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* JavaScript Examples */}
        {activeSection === 'examples' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  JavaScript Examples
                </CardTitle>
                <CardDescription>
                  Practical code examples for working with emoji composition in JavaScript
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Emoji Manipulation</h3>
                  <pre className={codeBlockClasses}>
                    {`// Get Unicode code points from an emoji
                    function getCodePoints(emoji) {
                      return Array.from(emoji).map(char =>
                        'U+' + char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')
                      );
                    }

                    // Example usage
                    console.log(getCodePoints('👩‍💻'));
                    // Output: ['U+1F469', 'U+200D', 'U+1F4BB']

                    console.log(getCodePoints('👨🏽‍👩🏽‍👧🏽‍👦🏽'));
                    // Output: ['U+1F468', 'U+1F3FD', 'U+200D', 'U+1F469', 'U+1F3FD', 'U+200D', 'U+1F467', 'U+1F3FD', 'U+200D', 'U+1F466', 'U+1F3FD']`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Creating Emoji from Code Points</h3>
                  <pre className={codeBlockClasses}>
{`// Create emoji from Unicode code points
function createEmojiFromCodePoints(codePoints) {
  return codePoints.map(cp =>
    String.fromCodePoint(parseInt(cp.replace('U+', ''), 16))
  ).join('');
}

// Example: Create "Woman Technologist"
const womanTechnologist = createEmojiFromCodePoints([
  'U+1F469', // Woman
  'U+200D',  // ZWJ
  'U+1F4BB'  // Laptop
]);
console.log(womanTechnologist); // 👩‍💻

// Example: Create family emoji
const family = createEmojiFromCodePoints([
  'U+1F468', // Man
  'U+200D',  // ZWJ
  'U+1F469', // Woman
  'U+200D',  // ZWJ
  'U+1F467', // Girl
  'U+200D',  // ZWJ
  'U+1F466'  // Boy
]);
console.log(family); // 👨‍👩‍👧‍👦`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Analyzing Emoji Composition</h3>
                  <pre className={codeBlockClasses}>
{`// Decompose an emoji into its components
function decomposeEmoji(emoji) {
  const codePoints = Array.from(emoji).map(char => char.codePointAt(0));
  const ZWJ = 0x200D; // Zero Width Joiner

  const result = {
    original: emoji,
    codePoints: codePoints.map(cp => \`U+\${cp.toString(16).toUpperCase()}\`),
    components: [],
    zwjCount: 0
  };

  let currentComponent = [];

  for (let i = 0; i < codePoints.length; i++) {
    const cp = codePoints[i];

    if (cp === ZWJ) {
      if (currentComponent.length > 0) {
        result.components.push(String.fromCodePoint(...currentComponent));
        currentComponent = [];
      }
      result.zwjCount++;
    } else {
      currentComponent.push(cp);
    }
  }

  // Add the last component
  if (currentComponent.length > 0) {
    result.components.push(String.fromCodePoint(...currentComponent));
  }

  return result;
}

// Example usage
console.log(decomposeEmoji('👨‍👩‍👧‍👦'));
// Output: {
//   original: "👨‍👩‍👧‍👦",
//   codePoints: ["U+1F468", "U+200D", "U+1F469", "U+200D", "U+1F467", "U+200D", "U+1F466"],
//   components: ["👨", "👩", "👧", "👦"],
//   zwjCount: 3
// }`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Working with Skin Tone Modifiers</h3>
                  <pre className={codeBlockClasses}>
{`// Skin tone modifier constants
const SKIN_TONES = {
  LIGHT: 0x1F3FB,        // 🏻
  MEDIUM_LIGHT: 0x1F3FC, // 🏼
  MEDIUM: 0x1F3FD,       // 🏽
  MEDIUM_DARK: 0x1F3FE,  // 🏾
  DARK: 0x1F3FF          // 🏿
};

// Add skin tone to an emoji
function addSkinTone(baseEmoji, skinTone) {
  const baseCodePoint = baseEmoji.codePointAt(0);
  return String.fromCodePoint(baseCodePoint, skinTone);
}

// Example usage
const waveEmoji = '👋';
console.log(addSkinTone(waveEmoji, SKIN_TONES.MEDIUM)); // 👋🏽

// Check if an emoji has a skin tone modifier
function hasSkinTone(emoji) {
  const codePoints = Array.from(emoji).map(char => char.codePointAt(0));
  return codePoints.some(cp =>
    cp >= 0x1F3FB && cp <= 0x1F3FF
  );
}

console.log(hasSkinTone('👋'));   // false
console.log(hasSkinTone('👋🏽')); // true`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Emoji Validation and Normalization</h3>
                  <pre className={codeBlockClasses}>
{`// Check if a string is a valid emoji sequence
function isValidEmojiSequence(text) {
  // Basic check for emoji characters
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
}

// Count actual emoji characters (handling ZWJ sequences)
function countEmojis(text) {
  // Use Intl.Segmenter for proper grapheme cluster counting
  if (Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(text));
    return segments.filter(segment =>
      isValidEmojiSequence(segment.segment)
    ).length;
  }

  // Fallback for browsers without Intl.Segmenter
  return (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
}

// Example usage
console.log(countEmojis('👨‍👩‍👧‍👦')); // 1 (one complex emoji)
console.log(countEmojis('👋🏽😀🎉'));     // 3 (three separate emojis)

// Normalize emoji text for comparison
function normalizeEmojiText(text) {
  return text.normalize('NFC'); // Canonical composition
}

// Compare emoji strings properly
function emojiEquals(emoji1, emoji2) {
  return normalizeEmojiText(emoji1) === normalizeEmojiText(emoji2);
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Advanced: Building an Emoji Composer</h3>
                  <pre className={codeBlockClasses}>
{`class EmojiComposer {
  static ZWJ = 0x200D;
  static VARIATION_SELECTOR_16 = 0xFE0F; // Emoji variation selector

  // Compose multiple emojis with ZWJ
  static compose(emojis) {
    const codePoints = [];

    for (let i = 0; i < emojis.length; i++) {
      // Add emoji code points
      const emoji = emojis[i];
      for (const char of emoji) {
        codePoints.push(char.codePointAt(0));
      }

      // Add ZWJ between emojis (except for the last one)
      if (i < emojis.length - 1) {
        codePoints.push(this.ZWJ);
      }
    }

    return String.fromCodePoint(...codePoints);
  }

  // Check if two emojis can be combined
  static canCombine(emoji1, emoji2) {
    // This is a simplified check - real implementation would use
    // the Unicode emoji data files
    const peopleEmojis = ['👨', '👩', '🧑', '👧', '👦'];
    const professionEmojis = ['💻', '⚕️', '🎨', '🔧', '✈️'];

    const isPerson = (emoji) => peopleEmojis.some(p => emoji.includes(p));
    const isProfession = (emoji) => professionEmojis.some(p => emoji.includes(p));

    return (isPerson(emoji1) && isProfession(emoji2)) ||
           (isPerson(emoji1) && isPerson(emoji2));
  }

  // Get all valid combinations for an emoji
  static getValidCombinations(baseEmoji) {
    const combinations = [];

    // Example combinations (in real app, this would be data-driven)
    if (baseEmoji === '👨' || baseEmoji === '👩' || baseEmoji === '🧑') {
      combinations.push(
        this.compose([baseEmoji, '💻']), // Technologist
        this.compose([baseEmoji, '⚕️']), // Health worker
        this.compose([baseEmoji, '🎨']), // Artist
      );
    }

    return combinations;
  }
}

// Example usage
const composed = EmojiComposer.compose(['👨', '👩', '👧', '👦']);
console.log(composed); // 👨‍👩‍👧‍👦

console.log(EmojiComposer.canCombine('👨', '💻')); // true
console.log(EmojiComposer.canCombine('🎂', '🎈')); // false

const combinations = EmojiComposer.getValidCombinations('👩');
console.log(combinations); // ['👩‍💻', '👩‍⚕️', '👩‍🎨']`}
                  </pre>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium mb-2">💡 Pro Tips for Developers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Always use <code className={inlineCodeClasses}>String.fromCodePoint()</code> instead of <code className={inlineCodeClasses}>String.fromCharCode()</code> for Unicode characters above U+FFFF</li>
                    <li>Use <code className={inlineCodeClasses}>Intl.Segmenter</code> for proper grapheme cluster handling when available</li>
                    <li>Remember that emoji counting is complex - what looks like one emoji might be multiple Unicode characters</li>
                    <li>Test your emoji handling across different platforms and browsers</li>
                    <li>Consider using the official Unicode emoji data files for accurate composition rules</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
