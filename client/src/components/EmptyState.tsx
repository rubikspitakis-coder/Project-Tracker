import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

interface EmptyStateProps {
  onAddApp: () => void;
}

export function EmptyState({ onAddApp }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Layers className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No applications yet</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Start tracking your applications by adding your first one. Keep all your Lovable, Railway, and custom projects organized in one place.
      </p>
      <Button onClick={onAddApp} data-testid="button-add-first-app">
        Add Your First App
      </Button>
    </div>
  );
}
