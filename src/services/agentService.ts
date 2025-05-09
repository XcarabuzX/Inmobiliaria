
import { supabase } from "@/integrations/supabase/client";

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  bio: string | null;
  user_id: string | null;
  created_at: string;
};

export const agentService = {
  async getAllAgents(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching agents:", error);
      return [];
    }

    return data as Agent[];
  },

  async getAgentById(id: string): Promise<Agent | null> {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching agent with id ${id}:`, error);
      return null;
    }

    return data as Agent;
  },

  async createAgent(agent: Omit<Agent, "id" | "created_at">): Promise<string | null> {
    const { data, error } = await supabase
      .from("agents")
      .insert([agent])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating agent:", error);
      return null;
    }

    return data.id;
  },

  async updateAgent(id: string, agent: Partial<Agent>): Promise<boolean> {
    const { error } = await supabase
      .from("agents")
      .update(agent)
      .eq("id", id);

    if (error) {
      console.error(`Error updating agent with id ${id}:`, error);
      return false;
    }

    return true;
  },

  async deleteAgent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting agent with id ${id}:`, error);
      return false;
    }

    return true;
  }
};

export default agentService;
