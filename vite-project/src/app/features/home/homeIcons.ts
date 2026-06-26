import {
  Blocks,
  CheckCircle2,
  FolderKanban,
  Library,
  MonitorSmartphone,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RouteSectionKey } from "@/app/types/navigation";

export const quickLinkIcons: Partial<Record<RouteSectionKey, LucideIcon>> = {
  components: Blocks,
  "full-apps": FolderKanban,
  libraries: Library,
  mcp: Zap,
  tools: Wrench,
};

export const fallbackQuickLinkIcon = Blocks;

export const featureCardIcons = [Sparkles, MonitorSmartphone, CheckCircle2] as const;
