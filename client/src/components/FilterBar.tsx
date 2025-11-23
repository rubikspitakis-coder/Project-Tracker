import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[140px]" data-testid="select-filter-category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Work">Work</SelectItem>
            <SelectItem value="Personal">Personal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPlatform} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-[150px]" data-testid="select-filter-platform">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="Lovable">Lovable</SelectItem>
            <SelectItem value="Railway">Railway</SelectItem>
            <SelectItem value="Custom">Custom/Devin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]" data-testid="select-filter-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="In Development">In Development</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
