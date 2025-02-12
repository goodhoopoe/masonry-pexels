import { useState, useEffect, useCallback } from 'react';
import { Image, VirtualItem } from './types';

const COLUMN_WIDTH = 300;
const GAP = 16;
const OVERSCAN = 5;

export function useVirtualization(images: Image[]) {
  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [columns, setColumns] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const calculateLayout = useCallback(() => {
    const width = window.innerWidth;
    const columnCount = Math.floor((Math.min(width, 1600) - GAP) / (COLUMN_WIDTH + GAP));
    const columnHeights = new Array(columnCount).fill(0);
    const items: VirtualItem[] = [];

    images.forEach(image => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      const aspectRatio = image.width / image.height;
      const height = COLUMN_WIDTH / aspectRatio;

      items.push({
        image,
        column: shortestColumn,
        top: columnHeights[shortestColumn],
      });

      columnHeights[shortestColumn] += height + GAP;
    });

    setColumns(columnCount);
    setContainerHeight(Math.max(...columnHeights));
    setVirtualItems(items);
  }, [images]);

  const getVisibleItems = useCallback(() => {
    const start = Math.max(0, scrollTop - OVERSCAN * COLUMN_WIDTH);
    const end = scrollTop + viewportHeight + OVERSCAN * COLUMN_WIDTH;

    return virtualItems.filter(item => item.top >= start && item.top <= end);
  }, [virtualItems, scrollTop, viewportHeight]);

  useEffect(() => {
    calculateLayout();
    const handleResize = () => calculateLayout();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateLayout]);

  const handleScroll = useCallback((event: Event) => {
    const target = event.target as Document;
    setScrollTop(target.documentElement.scrollTop);
    setViewportHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    setViewportHeight(window.innerHeight);
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    virtualItems: getVisibleItems(),
    containerHeight,
    columns,
  };
}
