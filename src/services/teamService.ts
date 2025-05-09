import { supabase } from "@/integrations/supabase/client";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  order_index: number;
  created_at: string;
  username?: string;
  email?: string;
  user_id?: string;
};

export const teamService = {
  async getAllTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("order_index");

    if (error) {
      console.error("Error fetching team members:", error);
      return [];
    }

    return data as TeamMember[];
  },

  async getTeamMemberByUsername(username: string): Promise<TeamMember | null> {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      console.error(`Error fetching team member with username ${username}:`, error);
      return null;
    }

    return data as TeamMember;
  },

  async getTeamMemberByUserId(userId: string): Promise<TeamMember | null> {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error(`Error fetching team member with user_id ${userId}:`, error);
      return null;
    }

    return data as TeamMember;
  },

  async createTeamMember(member: Omit<TeamMember, "id" | "created_at">): Promise<string | null> {
    const { data, error } = await supabase
      .from("team_members")
      .insert([member])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating team member:", error);
      return null;
    }

    return data.id;
  },

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<boolean> {
    const { error } = await supabase
      .from("team_members")
      .update(member)
      .eq("id", id);

    if (error) {
      console.error(`Error updating team member with id ${id}:`, error);
      return false;
    }

    return true;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting team member with id ${id}:`, error);
      return false;
    }

    return true;
  }
};

export default teamService;