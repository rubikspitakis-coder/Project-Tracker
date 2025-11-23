import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppSchema } from "@shared/schema";
import type { InsertApp, App } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertApp) => void;
  app?: App | null;
}

export function AppDialog({ open, onOpenChange, onSubmit, app }: AppDialogProps) {
  const form = useForm<InsertApp>({
    resolver: zodResolver(insertAppSchema),
    defaultValues: {
      name: app?.name || "",
      platform: app?.platform || "Replit",
      status: app?.status || "In Development",
      category: app?.category || "Personal",
      icon: app?.icon || "",
      liveUrl: (app?.liveUrl || "") as string,
      repositoryUrl: (app?.repositoryUrl || "") as string,
      notes: (app?.notes || "") as string,
    },
  });

  const handleSubmit = (data: InsertApp) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-app-form">
        <DialogHeader>
          <DialogTitle>{app ? "Edit Application" : "Add New Application"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Awesome App"
                      {...field}
                      data-testid="input-app-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-platform">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Replit">Replit</SelectItem>
                        <SelectItem value="Lovable">Lovable</SelectItem>
                        <SelectItem value="Railway">Railway</SelectItem>
                        <SelectItem value="Custom">Custom/Devin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="In Development">In Development</SelectItem>
                        <SelectItem value="Paused">Paused</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Icon (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger data-testid="select-icon">
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="📱">📱 Mobile App</SelectItem>
                      <SelectItem value="💻">💻 Desktop App</SelectItem>
                      <SelectItem value="🌐">🌐 Web App</SelectItem>
                      <SelectItem value="🎮">🎮 Game</SelectItem>
                      <SelectItem value="🛒">🛒 E-commerce</SelectItem>
                      <SelectItem value="📊">📊 Analytics</SelectItem>
                      <SelectItem value="💬">💬 Chat/Social</SelectItem>
                      <SelectItem value="📝">📝 Productivity</SelectItem>
                      <SelectItem value="🎨">🎨 Design Tool</SelectItem>
                      <SelectItem value="🔧">🔧 Utility</SelectItem>
                      <SelectItem value="📚">📚 Education</SelectItem>
                      <SelectItem value="🏥">🏥 Healthcare</SelectItem>
                      <SelectItem value="💰">💰 Finance</SelectItem>
                      <SelectItem value="🎵">🎵 Music/Audio</SelectItem>
                      <SelectItem value="📷">📷 Photo/Video</SelectItem>
                      <SelectItem value="🚀">🚀 Startup</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://myapp.example.com"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-live-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repositoryUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/user/repo"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-repo-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details, credentials location, deployment notes..."
                      className="resize-none h-24"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit">
                {app ? "Update" : "Add"} Application
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
