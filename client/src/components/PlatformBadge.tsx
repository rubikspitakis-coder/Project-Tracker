import { Badge } from "@/components/ui/badge";
import { Code2, Heart, Train, Wrench } from "lucide-react";

interface PlatformBadgeProps {
  platform: string;
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const getPlatformConfig = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "replit":
        return { icon: Code2, label: "Replit" };
      case "lovable":
        return { icon: Heart, label: "Lovable" };
      case "railway":
        return { icon: Train, label: "Railway" };
      default:
        return { icon: Wrench, label: "Custom" };
    }
  };

  const config = getPlatformConfig(platform);
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className="gap-1.5" data-testid={`badge-platform-${platform.toLowerCase()}`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
}
