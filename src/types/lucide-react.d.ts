// Minimal type declaration for lucide-react
// The installed package version does not ship .d.ts files.
declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react';

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = FC<LucideProps>;

  export const X: LucideIcon;
}