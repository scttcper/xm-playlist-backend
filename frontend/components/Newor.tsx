import React, { useEffect } from 'react';

type Props = {
  id: string;
  className?: string;
  style?: React.CSSProperties;
};

export const NeworAd = ({ id, className = '', style = { display: 'block' }, ...rest }: Props) => {
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

  return <div className={className} style={style} {...rest} />;
};
