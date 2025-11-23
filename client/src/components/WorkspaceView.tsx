import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExternalLink, RefreshCw, X, Search } from "lucide-react";
import type { App } from "@shared/schema";

interface WorkspaceViewProps {
  apps: App[];
  selectedCategory: string;
}

const getFaviconUrl = (url: string) => {
  try {
    const u = new URL(url);
    return `${u.origin}/favicon.ico`;
  } catch {
    return null;
  }
};

const AppIcon = ({ app }: { app: App }) => {
  const faviconUrl = app.liveUrl ? getFaviconUrl(app.liveUrl) : null;
  const [showFallback, setShowFallback] = useState(false);

  if (!faviconUrl || showFallback) {
    return (
      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-medium text-primary">
          {app.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt={`${app.name} icon`}
      className="w-10 h-10 flex-shrink-0 object-contain rounded"
      onError={() => setShowFallback(true)}
    />
  );
};

export function WorkspaceView({ apps, selectedCategory }: WorkspaceViewProps) {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [iframeKey, setIframeKey] = useState(0);

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
    return matchesSearch && matchesCategory && app.liveUrl;
  });

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenInNewTab = () => {
    if (selectedApp?.liveUrl) {
      window.open(selectedApp.liveUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isLocalFile = (url: string) => {
    return url.startsWith("file://") || url.startsWith("C:") || url.startsWith("/C:");
  };

  return (
    <div className="flex h-[calc(100vh-180px)] gap-4">
      {/* Left Sidebar - App List */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredApps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {apps.filter((app) => app.liveUrl).length === 0
                  ? "No apps with live URLs found. Add live URLs to your apps to use the workspace."
                  : "No apps match your search."}
              </p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <Card
                key={app.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedApp?.id === app.id
                    ? "ring-2 ring-primary shadow-md"
                    : "hover:ring-1 hover:ring-border"
                }`}
                onClick={() => setSelectedApp(app)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <AppIcon app={app} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{app.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {app.category}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Embedded App */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedApp ? (
          <>
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-4 p-4 bg-card border rounded-lg">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <AppIcon app={selectedApp} />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold truncate">{selectedApp.name}</h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedApp.liveUrl}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReload}
                  title="Reload app"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Tab
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApp(null)}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 bg-card border rounded-lg overflow-hidden relative">
              {isLocalFile(selectedApp.liveUrl || "") ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <ExternalLink className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Local File Path</h3>
                    <p className="text-sm text-muted-foreground">
                      This app uses a local file path and cannot be embedded in the workspace.
                      Local files can only be accessed directly on your computer.
                    </p>
                    <Button onClick={handleOpenInNewTab} className="mt-4">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View File Location
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe
                  key={iframeKey}
                  src={selectedApp.liveUrl || ""}
                  className="w-full h-full border-0"
                  title={selectedApp.name}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-card border rounded-lg">
            <div className="text-center space-y-4 max-w-md p-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <ExternalLink className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Welcome to Workspace</h2>
              <p className="text-muted-foreground">
                Select an app from the left sidebar to view it here. Your apps will be embedded
                directly in this workspace for quick access.
              </p>
              <p className="text-sm text-muted-foreground">
                Tip: Apps with live URLs can be embedded. Use the "Open in Tab" button if an app
                doesn't display correctly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
