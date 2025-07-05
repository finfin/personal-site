'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';
import {
  BaseEmoji,
  ComplexEmoji,
  findComplexEmojis,
  getAllBaseEmojis,
  getAllCategories,
  getSelectionStats
} from '../lib/unicodeEmojiDatabase';

export default function CompositionMode() {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Get all base emojis and categories
  const allBaseEmojis = useMemo(() => getAllBaseEmojis(), []);
  const categories = useMemo(() => ['all', ...getAllCategories()], []);

  // Filter base emojis by category
  const filteredBaseEmojis = useMemo(() => {
    if (activeCategory === 'all') {
      return allBaseEmojis;
    }
    return allBaseEmojis.filter(emoji => emoji.category === activeCategory);
  }, [allBaseEmojis, activeCategory]);

  // Find matching complex emojis
  const matchingComplexEmojis = useMemo(() => {
    return findComplexEmojis(selectedEmojis);
  }, [selectedEmojis]);

  // Get statistics
  const stats = useMemo(() => {
    return getSelectionStats(selectedEmojis);
  }, [selectedEmojis]);

  const handleEmojiToggle = (codePoint: string) => {
    setSelectedEmojis(prev => {
      if (prev.includes(codePoint)) {
        return prev.filter(cp => cp !== codePoint);
      }
      return [...prev, codePoint];
    });
  };

  const clearSelection = () => {
    setSelectedEmojis([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Select Emoji Composition</CardTitle>
          <CardDescription>
            Select base emojis to see all complex emojis containing them.
            For example: Select 👩 + 🏽 to see 👩🏽‍❤️‍💋‍👨🏻 and other combinations.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Selection Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-medium">Selected Components</h3>
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {selectedEmojis.length > 0 ? (
                  selectedEmojis.map(codePoint => {
                    const emoji = allBaseEmojis.find(e => e.codePoint === codePoint);
                    return (
                      <span
                        className='inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm'
                        key={codePoint}
                      >
                        {emoji?.emoji} {emoji?.name}
                        <button
                          className='ml-1 text-blue-600 dark:text-blue-400 hover:text-red-600'
                          onClick={() => handleEmojiToggle(codePoint)}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className='text-gray-500 text-sm'>No emojis selected</span>
                )}
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {selectedEmojis.length > 0
                  ? `Found ${stats.totalMatches} matching complex emojis`
                  : 'Select emojis to see combinations'
                }
              </p>
            </div>
            <Button
              disabled={selectedEmojis.length === 0}
              onClick={clearSelection}
              size='sm'
              variant='outline'
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Base Emoji Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Base Emojis</CardTitle>
            <CardDescription>Click to add/remove emojis from your selection</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    className={cn(
                      'text-xs',
                      activeCategory === category && 'dark:bg-white/10 bg-black/10 hover:bg-white/50 hover:dark:bg-black/30 text-primary-foreground'
                    )}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    size='sm'
                    variant={activeCategory === category ? 'default' : 'outline'}
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-8 gap-2 max-h-96 overflow-y-auto">
              {filteredBaseEmojis.map((emoji: BaseEmoji) => (
                <button
                  className={cn(
                    'aspect-square flex items-center justify-center text-2xl rounded-md border-2 transition-all hover:scale-110',
                    selectedEmojis.includes(emoji.codePoint)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                  key={emoji.codePoint}
                  onClick={() => handleEmojiToggle(emoji.codePoint)}
                  title={`${emoji.name} (${emoji.frequency} uses)`}
                >
                  {emoji.emoji}
                </button>
              ))}
            </div>

            <p className='text-xs text-gray-500 mt-2'>
              Showing {filteredBaseEmojis.length} emojis
              {activeCategory !== 'all' && ` in ${activeCategory}`}
            </p>
          </CardContent>
        </Card>

        {/* Complex Emoji Results */}
        <Card>
          <CardHeader>
            <CardTitle>
              Complex Emojis
              {selectedEmojis.length > 0 && (
                <span className='text-sm font-normal text-gray-600 dark:text-gray-400'>
                  ({stats.totalMatches})
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {selectedEmojis.length === 0
                ? 'All available complex emojis'
                : 'Emojis containing your selected components'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matchingComplexEmojis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {selectedEmojis.length === 0
                  ? 'Select base emojis to filter complex emojis'
                  : 'No complex emojis found with your selection'
                }
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {matchingComplexEmojis.map((complexEmoji: ComplexEmoji) => (
                  <div
                    className='flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800'
                    key={complexEmoji.id}
                  >
                    <div className="text-3xl">{complexEmoji.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{complexEmoji.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                          {complexEmoji.category}
                        </span>
                        <span className="text-xs">
                          {complexEmoji.componentCount} components
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Components: {(complexEmoji.baseComponents.map((cp, index, array) => {
                          const emoji = allBaseEmojis.find(e => e.codePoint === cp);

                          if (index < array.length - 1) {
                            return <React.Fragment key={cp}>
                              <div className='inline'>{emoji?.emoji}</div>
                              {' + '}
                            </React.Fragment>
                          }
                          return <div className='inline' key={cp}>{emoji?.emoji}</div>;
                        }))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {stats.totalMatches > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Categories:</span>
                    <div className="mt-1">
                      {Object.entries(stats.categoryCounts).map(([category, count]) => (
                        <div className='text-xs' key={category}>
                          {category}: {count}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Avg Complexity:</span>
                    <div className="mt-1 text-xs">
                      {stats.averageComplexity.toFixed(1)} components
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
