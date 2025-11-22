import { PlatformBadge } from '../PlatformBadge'

export default function PlatformBadgeExample() {
  return (
    <div className="flex gap-2">
      <PlatformBadge platform="Replit" />
      <PlatformBadge platform="Lovable" />
      <PlatformBadge platform="Railway" />
      <PlatformBadge platform="Custom" />
    </div>
  )
}
