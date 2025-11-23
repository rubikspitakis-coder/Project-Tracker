import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlatformBadge } from "./PlatformBadge";
import { StatusIndicator } from "./StatusIndicator";
import { ExternalLink, Github, MoreVertical, Pencil, Archive, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { App } from "@shared/schema";

interface AppCardProps {
  app: App;
  onEdit?: (app: App) => void;
  onArchive?: (app: App) => void;
  onDelete?: (app: App) => void;
}

const getDisplayLiveUrl = (url: string) => {
  try {
    const { hostname, pathname } = new URL(url);
    if (!pathname || pathname === "/") return hostname;
    return `${hostname}${pathname}`;
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "");
  }
};

const getDisplayRepoUrl = (url: string) => {
  try {
    const u = new URL(url);
    if (u.hostname === "github.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    }
    return u.hostname;
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "");
  }
};

export function AppCard({ app, onEdit, onArchive, onDelete }: AppCardProps) {
  return (
    <Card className="hover-elevate active-elevate-2" data-testid={`card-app-${app.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {app.icon && (
            <span className="text-2xl flex-shrink-0" data-testid={`icon-${app.id}`}>
              {app.icon}
            </span>
          )}
          <h3 className="text-lg font-medium truncate" data-testid={`text-app-name-${app.id}`}>
            {app.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <PlatformBadge platform={app.platform} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid={`button-menu-${app.id}`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(app)} data-testid={`menu-edit-${app.id}`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {app.liveUrl && (
                <DropdownMenuItem asChild>
                  <a href={app.liveUrl} target="_blank" rel="noopener noreferrer" data-testid={`menu-open-url-${app.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Live URL
                  </a>
                </DropdownMenuItem>
              )}
              {app.repositoryUrl && (
                <DropdownMenuItem asChild>
                  <a href={app.repositoryUrl} target="_blank" rel="noopener noreferrer" data-testid={`menu-view-repo-${app.id}`}>
                    <Github className="h-4 w-4 mr-2" />
                    View Repository
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onArchive?.(app)} data-testid={`menu-archive-${app.id}`}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(app)} 
                data-testid={`menu-delete-${app.id}`}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <StatusIndicator status={app.status} />
        </div>

        {app.liveUrl && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <a
              href={app.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline truncate"
              data-testid={`link-live-url-${app.id}`}
              title={app.liveUrl}
            >
              {getDisplayLiveUrl(app.liveUrl)}
            </a>
          </div>
        )}

        {app.repositoryUrl && (
          <div className="flex items-center gap-2">
            <Github className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <a
              href={app.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline truncate"
              data-testid={`link-repo-${app.id}`}
              title={app.repositoryUrl}
            >
              {getDisplayRepoUrl(app.repositoryUrl)}
            </a>
          </div>
        )}

        {app.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-notes-${app.id}`}>
            {app.notes}
          </p>
        )}

        <p className="text-xs text-muted-foreground" data-testid={`text-updated-${app.id}`}>
          Updated {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
}
