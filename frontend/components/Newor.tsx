import React, { useEffect } from 'react';

type Props = {
  id: string;
  className?: string;
  style?: React.CSSProperties;
};

export const NeworAd = ({ id, className = '', style = {}, ...rest }: Props) => {
  useEffect(() => {
    try {
      if (typeof window === 'object') {
        (window as any).waldo?.refreshTag?.(id);
      }
    } catch {
      // Pass
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id={id}
      className={`block mt-3 mx-auto max-w-full text-center ${className}`}
      style={style}
      {...rest}
    />
  );
};
