'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  BaseEmoji,
  ComplexEmoji,
  findComplexEmojis,
  getAllBaseEmojis,
  getAllCategories,
  getPossibleComponents,
  getSelectionStats
} from '../lib/unicodeEmojiDatabase';

export default function CompositionMode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Load selected emojis from URL on mount
  useEffect(() => {
    const urlEmojis = searchParams.get('emojis');
    if (urlEmojis) {
      const emojiArray = urlEmojis.split(',').filter(Boolean);
      setSelectedEmojis(emojiArray);
    }
  }, [searchParams]);

  // Update URL when selectedEmojis changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedEmojis.length > 0) {
      params.set('emojis', selectedEmojis.join(','));
    } else {
      params.delete('emojis');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [selectedEmojis, searchParams, router]);

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
    const result = findComplexEmojis(selectedEmojis);

    return result;
  }, [selectedEmojis]);

  // Get possible components for current selection
  const possibleComponents = useMemo(() => {
    return getPossibleComponents(selectedEmojis);
  }, [selectedEmojis]);

  // Get statistics
  const stats = useMemo(() => {
    const result = getSelectionStats(selectedEmojis);
    return result;
  }, [selectedEmojis]);

  const handleEmojiToggle = (codePoint: string) => {
    setSelectedEmojis(prev => {
      if (prev.includes(codePoint)) {
        const newSelection = prev.filter(cp => cp !== codePoint);
        return newSelection;
      }
      const newSelection = [...prev, codePoint];
      return newSelection;
    });
  };

  const clearSelection = () => {
    // console.log('🧹 Clear selection called');
    setSelectedEmojis([]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      {/* <Card className="sm:border sm:shadow-sm border-0 shadow-none px-4 sm:px-0 py-4 sm:p-6">
          <CardTitle className='mb-4'>Multi-Select Emoji Composition</CardTitle>
          <CardDescription>
            Select base emojis to see all complex emojis containing them.
            For example: Select 👩 + <div className='inline'>🏻</div> to see 👩🏽‍❤️‍💋‍👨🏻 and other combinations.
          </CardDescription>
      </Card> */}

      {/* Selection Summary */}
      <Card className="sm:border sm:shadow-sm border-0 shadow-none px-4 sm:px-0 py-4 sm:p-6">
        <CardTitle className='mb-4'>Selected Components</CardTitle>

        <div className="flex flex-wrap items-center gap-2 min-h-[32px]">
          {selectedEmojis.length > 0 ? (
            <>
              {selectedEmojis.map(codePoint => {
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
              })}
              <Button
                className='ml-2'
                onClick={clearSelection}
                size='sm'
                variant='outline'
              >
                Clear All
              </Button>
            </>
          ) : (
            <span className='text-gray-500 text-sm'>No emojis selected</span>
          )}
        </div>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
          {selectedEmojis.length > 0
            ? `Found ${stats.totalMatches} matching complex emojis`
            : 'Select emojis to see combinations'
          }
        </p>

      </Card>

      <div className="flex items-center justify-center">
        <Button
          onClick={() => {
            if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
              navigator.share({
                title: 'Emoji Architect - My Selection',
                text: `Check out my emoji selection: ${selectedEmojis.map(cp => {
                  const emoji = allBaseEmojis.find(e => e.codePoint === cp);
                  return emoji?.emoji;
                }).join(' ')}`,
                url: window.location.href
              });
            } else {
              // Desktop: copy URL to clipboard
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }
          }}
          size='lg'
          variant='default'
        >
          Share My Findings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Base Emoji Selection */}
        <Card className="sm:border sm:shadow-sm border-0 shadow-none">
          <CardHeader className="px-0 py-4 sm:p-6">
            <div className="px-4 sm:px-0">
              <CardTitle className='mb-4'>Select Base Emojis</CardTitle>
              <CardDescription>Click to add/remove emojis from your selection</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-6 sm:p-6 sm:pt-0">
            <div className="px-4 sm:px-0">
              {/* Category Filter */}
              <div className="mb-4">
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {categories.map(category => (
                  <Button
                    className={cn(
                      'text-xs whitespace-nowrap flex-shrink-0 min-w-fit px-3',
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
            <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto overflow-x-visible p-1">
              {filteredBaseEmojis.map((emoji: BaseEmoji) => {
                const isSelected = selectedEmojis.includes(emoji.codePoint);
                const isPossible = selectedEmojis.length === 0 || possibleComponents.has(emoji.codePoint);
                const isDisabled = !isPossible && !isSelected;

                return (
                  <button
                    className={cn(
                      'aspect-square flex items-center justify-center text-xl sm:text-2xl rounded-md border-2 transition-all min-h-[44px] touch-manipulation',
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : isDisabled
                          ? 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-40 cursor-not-allowed'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-110'
                    )}
                    disabled={isDisabled}
                    key={emoji.codePoint}
                    onClick={() => !isDisabled && handleEmojiToggle(emoji.codePoint)}
                    title={`${emoji.name} (${emoji.frequency} uses)${isDisabled ? ' - Not compatible with current selection' : ''}`}
                  >
                    {emoji.emoji}
                  </button>
                );
              })}
            </div>

              <p className='text-xs text-gray-500 mt-2'>
                {(() => {
                  const enabledCount = filteredBaseEmojis.filter(emoji =>
                    selectedEmojis.length === 0 || possibleComponents.has(emoji.codePoint) || selectedEmojis.includes(emoji.codePoint)
                  ).length;
                  const totalCount = filteredBaseEmojis.length;

                  if (selectedEmojis.length === 0) {
                    return `Showing ${totalCount} emojis${activeCategory !== 'all' ? ` in ${activeCategory}` : ''}`;
                  }
                  return `Showing ${enabledCount} of ${totalCount} compatible emojis${activeCategory !== 'all' ? ` in ${activeCategory}` : ''}`;
                })()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Complex Emoji Results */}
        <Card className="sm:border sm:shadow-sm border-0 shadow-none">
          <CardHeader className="px-0 py-4 sm:p-6">
            <div className="px-4 sm:px-0">
              <CardTitle className='mb-4'>
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
            </div>
          </CardHeader>
          <CardContent className="px-0 py-6 sm:p-6 sm:pt-0">
              {matchingComplexEmojis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {selectedEmojis.length === 0
                  ? 'Select base emojis to filter complex emojis'
                  : 'No complex emojis found with your selection'
                }
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {matchingComplexEmojis.map((complexEmoji: ComplexEmoji) => (
                  <div
                    className='flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 mt-2'
                    key={complexEmoji.id}
                  >
                    <button
                      className="text-3xl hover:scale-110 transition-transform cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        navigator.clipboard.writeText(complexEmoji.emoji);
                        toast.success(`Copied ${complexEmoji.emoji} to clipboard!`);
                      }}
                      title="Click to copy emoji"
                    >
                      {complexEmoji.emoji}
                    </button>
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
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        <div>
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
                        <div className="font-mono text-xs break-all">
                          Codepoints: {complexEmoji.id}
                        </div>
                        <div>
                          JS Length: {complexEmoji.emoji.length}
                        </div>
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
