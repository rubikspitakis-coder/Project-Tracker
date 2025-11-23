import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppCard } from "@/components/AppCard";
import { AppDialog } from "@/components/AppDialog";
import { FilterBar } from "@/components/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { Plus, LogOut, LayoutGrid, List } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { App, InsertApp } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: apps = [], isLoading } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout", {});
      queryClient.clear();
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleAddApp = async (data: InsertApp) => {
    try {
      await apiRequest("POST", "/api/apps", data);
      await queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Application added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add application",
        variant: "destructive",
      });
    }
  };

  const handleEditApp = (app: App) => {
    setEditingApp(app);
    setDialogOpen(true);
  };

  const handleUpdateApp = async (data: InsertApp) => {
    if (!editingApp) return;

    try {
      await apiRequest("PUT", `/api/apps/${editingApp.id}`, data);
      await queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      setDialogOpen(false);
      setEditingApp(null);
      toast({
        title: "Success",
        description: "Application updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    }
  };

  const handleArchiveApp = async (app: App) => {
    try {
      await apiRequest("PUT", `/api/apps/${app.id}`, { status: "Archived" });
      await queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      toast({
        title: "Success",
        description: "Application archived",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive application",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApp = async (app: App) => {
    if (!confirm(`Are you sure you want to delete "${app.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiRequest("DELETE", `/api/apps/${app.id}`, {});
      await queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      toast({
        title: "Success",
        description: "Application deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      selectedPlatform === "all" || app.platform === selectedPlatform;
    const matchesStatus =
      selectedStatus === "all" || app.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "all" || app.category === selectedCategory;
    return matchesSearch && matchesPlatform && matchesStatus && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">App Manager</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setEditingApp(null);
                setDialogOpen(true);
              }}
              data-testid="button-add-app"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add App
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              data-testid="button-logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                title="Grid view"
                data-testid="button-grid-view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                title="List view"
                data-testid="button-list-view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {filteredApps.length === 0 ? (
          apps.length === 0 ? (
            <EmptyState onAddApp={() => setDialogOpen(true)} />
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No applications match your filters. Try adjusting your search or filters.
              </p>
            </div>
          )
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col gap-4"
          }>
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onEdit={handleEditApp}
                onArchive={handleArchiveApp}
                onDelete={handleDeleteApp}
              />
            ))}
          </div>
        )}
      </main>

      <AppDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingApp(null);
        }}
        onSubmit={editingApp ? handleUpdateApp : handleAddApp}
        app={editingApp}
      />
    </div>
  );
}
