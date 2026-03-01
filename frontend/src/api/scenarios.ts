import type { Scenario, CreateScenarioInput } from "../types/scenario";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Request failed (${response.status})`);
  }
  const body = await response.json();
  return body.data;
}

export async function fetchScenarios(): Promise<Scenario[]> {
  const response = await fetch("/api/scenarios");
  return handleResponse<Scenario[]>(response);
}

export async function createScenario(input: CreateScenarioInput): Promise<Scenario> {
  const response = await fetch("/api/scenarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Scenario>(response);
}

export async function deleteScenario(id: string): Promise<void> {
  const response = await fetch(`/api/scenarios/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Request failed (${response.status})`);
  }
}
