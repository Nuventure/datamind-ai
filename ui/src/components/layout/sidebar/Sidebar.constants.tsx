import { Cloud, BarChart3, FileText } from "lucide-react";

export const NAV_ITEMS = [
  { name: "Upload", icon: Cloud, path: "/" },
  { name: "Summary", icon: FileText, path: "/summary" },
  { name: "Analysis", icon: BarChart3, path: "/analysis" },
] as const;
