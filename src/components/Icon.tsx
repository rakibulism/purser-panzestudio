import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

export function Icon({ icon, size = 20, stroke = 1.5 }: { icon: IconSvgElement; size?: number; stroke?: number }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={stroke} color="currentColor" aria-hidden="true" />;
}
