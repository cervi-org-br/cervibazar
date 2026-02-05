"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { clientStore } from "@/app/lib/clients/clientStore";

export async function searchClients(token: string, term: string) {
  await verifyAuthToken(token);
  const trimmed = term.trim();
  const normalized = trimmed.replace(/\D/g, "");
  const hasPhoneSearch = normalized.length >= 3;
  const hasNameSearch = trimmed.length >= 3;
  if (!hasPhoneSearch && !hasNameSearch) return [];
  const store = clientStore();
  const all = await store.list();
  return all
    .filter((client) => {
      const clientDigits = (client.phone ?? "").replace(/\D/g, "");
      const nameMatch = client.name.toLowerCase().includes(trimmed.toLowerCase());
      return (
        (hasPhoneSearch && clientDigits.includes(normalized)) || (hasNameSearch && nameMatch)
      );
    })
    .slice(0, 5);
}
