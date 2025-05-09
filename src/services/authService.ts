import { supabase } from "@/integrations/supabase/client";
import { teamService } from '@/services/teamService';

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signInWithUsername(username: string, password: string) {
    try {
      // Buscar el email asociado al nombre de usuario
      const { data, error } = await supabase
        .from('team_members')
        .select('email')
        .eq('username', username)
        .single();
      
      if (error || !data || !data.email) {
        throw new Error('Usuario no encontrado');
      }
      
      // Iniciar sesión con el email encontrado
      return await this.signIn(data.email, password);
    } catch (error) {
      console.error('Error en inicio de sesión con nombre de usuario:', error);
      throw error;
    }
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return data;
  },
  
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};

export default authService;