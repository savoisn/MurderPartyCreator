export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "player" | "creator";
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });
    if (response.status === 401) return null;
    if (!response.ok) return null;
    const body = await response.json();
    return body.data;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function loginWithGithub(): void {
  window.location.href = "/api/auth/github";
}

export function loginWithGoogle(): void {
  window.location.href = "/api/auth/google";
}
