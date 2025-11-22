import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  status: string;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return { color: "bg-green-500", label: "Active" };
      case "in development":
        return { color: "bg-blue-500", label: "In Development" };
      case "paused":
        return { color: "bg-yellow-500", label: "Paused" };
      case "archived":
        return { color: "bg-gray-400", label: "Archived" };
      default:
        return { color: "bg-gray-400", label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className="gap-2 text-xs" data-testid={`status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
      <span className={`h-2 w-2 rounded-full ${config.color}`} />
      <span>{config.label}</span>
    </Badge>
  );
}
