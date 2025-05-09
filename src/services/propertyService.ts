
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Property = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  address: string | null;
  type: string;
  category: string; // 'venta' o 'arriendo'
  status: string; // e.g., 'disponible', 'vendida', 'en_arriendo', 'en_negociacion'
  bedrooms: number;
  bathrooms: number;
  area: number;
  year_built: number | null;
  parking: number | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  agent_id: string | null;
};

export type PropertyWithImages = Property & {
  images: { id: string; url: string; is_main: boolean }[];
  features: { id: string; feature: string }[];
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    photo_url: string | null;
  } | null;
};

export const propertyService = {
  async getFeaturedProperties(): Promise<PropertyWithImages[]> {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_images(id, url, is_main),
        property_features(id, feature)
      `)
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured properties:", error);
      return [];
    }

    return (data || []) as unknown as PropertyWithImages[];
  },

  async getAllProperties(filters?: {
    category?: string;
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    status?: string;
  }): Promise<PropertyWithImages[]> {
    let query = supabase
      .from("properties")
      .select(`
        *,
        property_images(id, url, is_main),
        property_features(id, feature)
      `);

    // Apply filters
    if (filters) {
      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters.type && filters.type !== "all") {
        query = query.eq("type", filters.type);
      }
      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }
      if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
        query = query.eq("bedrooms", filters.bedrooms);
      }
      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    return (data || []) as unknown as PropertyWithImages[];
  },

  async getPropertyById(id: string): Promise<PropertyWithImages | null> {
    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(id, url, is_main),
          property_features(id, feature)
        `)
        .eq('id', id)
        .single();

      if (propertyError) {
        console.error(`Error fetching property with id ${id}:`, propertyError);
        return null;
      }

      let agentData = null;
      if (propertyData && propertyData.agent_id) {
        const {  agent, error: agentError } = await supabase
          .from('agents')
          .select('id, name, email, phone, photo_url')
          .eq('id', propertyData.agent_id)
          .single();

        if (!agentError && agent) {
          agentData = agent;
        }
      }

      const safePropertyData = {
        ...propertyData,
        images: Array.isArray((propertyData as any).property_images) ? (propertyData as any).property_images : [],
        features: Array.isArray((propertyData as any).property_features) ? (propertyData as any).property_features : [],
        agent: agentData
      };

      delete (safePropertyData as any).property_images;
      delete (safePropertyData as any).property_features;

      return safePropertyData as unknown as PropertyWithImages;
    } catch (error) {
      console.error(`Error in getPropertyById for id ${id}:`, error);
      return null;
    }
  },

  async createProperty(property: Omit<Property, "id" | "created_at" | "updated_at">): Promise<string | null> {
    const { data, error } = await supabase
      .from("properties")
      .insert([property])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating property:", error);
      return null;
    }

    return data.id;
  },

  async updateProperty(id: string, property: Partial<Property>): Promise<boolean> {
    const { error } = await supabase
      .from("properties")
      .update(property)
      .eq("id", id);

    if (error) {
      console.error(`Error updating property with id ${id}:`, error);
      return false;
    }

    return true;
  },

  async deleteProperty(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting property with id ${id}:`, error);
      return false;
    }

    return true;
  },

  async addPropertyImage(propertyId: string, url: string, isMain: boolean = false): Promise<string | null> {
    const { data, error } = await supabase
      .from("property_images")
      .insert([{ property_id: propertyId, url, is_main: isMain }])
      .select("id")
      .single();

    if (error) {
      console.error("Error adding property image:", error);
      return null;
    }

    return data.id;
  },

  async addPropertyFeature(propertyId: string, feature: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("property_features")
      .insert([{ property_id: propertyId, feature }])
      .select("id")
      .single();

    if (error) {
      console.error("Error adding property feature:", error);
      return null;
    }

    return data.id;
  }
};

export default propertyService;
  