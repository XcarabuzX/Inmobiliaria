
import { supabase } from "@/integrations/supabase/client";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  property_id: string | null;
  agent_id: string | null;
  status: string;
  created_at: string;
};

export const contactService = {
  async submitContactMessage(message: Omit<ContactMessage, "id" | "status" | "created_at">): Promise<string | null> {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([{ ...message, status: "pending" }])
      .select("id")
      .single();

    if (error) {
      console.error("Error submitting contact message:", error);
      return null;
    }

    return data.id;
  },

  async getAllMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching contact messages:", error);
      return [];
    }

    return data as ContactMessage[];
  },

  async updateMessageStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(`Error updating message status with id ${id}:`, error);
      return false;
    }

    return true;
  },

  async deleteMessage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting message with id ${id}:`, error);
      return false;
    }

    return true;
  }
};

export default contactService;
