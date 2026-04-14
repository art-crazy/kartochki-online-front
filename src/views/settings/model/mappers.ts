import type { SettingsResponse } from "@/shared/api";
import type { SettingsSessionData } from "./content";

export function mapSession(session: SettingsResponse["sessions"][number]): SettingsSessionData {
  return {
    id: session.id,
    device: session.device,
    platform: session.platform,
    location: session.location ?? "",
    isCurrent: session.is_current,
    canRevoke: session.can_revoke,
  };
}
