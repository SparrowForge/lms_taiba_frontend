'use client';

import { useEffect, useState } from 'react';

// Default matches Ant Design's `md` breakpoint: anything narrower is treated as a phone.
// Pass a larger max width (e.g. 1023.98 for `lg`) to also include tablets.
export const useIsMobile = (maxWidth = 767.98) => {
  const query = `(max-width: ${maxWidth}px)`;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return isMobile;
};
