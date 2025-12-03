import * as React from 'react';

import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
} from '@/components/animate-ui/primitives/radix/progress';
import { cn } from '@/lib/utils';

function Progress({
  className,
  indicator_className,
  ...props
}) {
  return (
    <ProgressPrimitive
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}>
      <ProgressIndicatorPrimitive
        className={cn("rounded-full h-full w-full flex-1",
          indicator_className
        )}
      />
    </ProgressPrimitive>
  );
}

export { Progress };
