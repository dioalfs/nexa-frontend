import { supabase } from "./supabase.js";

export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.replace("login.html");
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (!user) return;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || data.role !== "admin") {
    alert("Akses ditolak");
    window.location.replace("laptofy.html");
  }
}
