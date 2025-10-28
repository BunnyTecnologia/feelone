import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// URL base do seu aplicativo nativo (simulando um esquema de URL personalizado)
const APP_BASE_URL = "feelone://";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pulseiraId = url.searchParams.get("id");

    if (!pulseiraId) {
      return new Response("Missing pulseira ID", { status: 400, headers: corsHeaders });
    }

    // Inicializa o cliente Supabase com a chave de serviço para acesso irrestrito ao DB
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // 1. Inspeção: Buscar a pulseira
    const { data: pulseiraData, error: pulseiraError } = await supabaseClient
      .from("pulseiras")
      .select("status, id_usuario_vinculado")
      .eq("pulseira_id", pulseiraId)
      .single();

    if (pulseiraError && pulseiraError.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error("Database error:", pulseiraError);
        // Rota 1: FALHA (Erro de servidor ou DB)
        const redirectUrl = `${APP_BASE_URL}erro?motivo=erro_servidor`;
        return Response.redirect(redirectUrl, 302);
    }

    // Rota 1: FALHA (Pulseira Inválida ou Inativa)
    if (!pulseiraData || pulseiraData.status !== "ativa") {
      const redirectUrl = `${APP_BASE_URL}erro?motivo=pulseira_invalida`;
      return Response.redirect(redirectUrl, 302);
    }

    // Rota 2: ONBOARDING (Pulseira "Vaga")
    if (!pulseiraData.id_usuario_vinculado) {
      const redirectUrl = `${APP_BASE_URL}cadastro?vincular_pulseira=${pulseiraId}`;
      return Response.redirect(redirectUrl, 302);
    }

    // Rota 3: ACESSO (Pulseira com "Dono")
    if (pulseiraData.id_usuario_vinculado) {
      // Buscar o slug do perfil
      const { data: profileData, error: profileError } = await supabaseClient
        .from("profiles")
        .select("slug_perfil")
        .eq("id", pulseiraData.id_usuario_vinculado)
        .single();

      if (profileError || !profileData?.slug_perfil) {
        console.error("Profile lookup error:", profileError);
        // Se o perfil não for encontrado, redireciona para erro
        const redirectUrl = `${APP_BASE_URL}erro?motivo=perfil_nao_encontrado`;
        return Response.redirect(redirectUrl, 302);
      }

      const redirectUrl = `${APP_BASE_URL}perfil?slug=${profileData.slug_perfil}`;
      return Response.redirect(redirectUrl, 302);
    }

    // Fallback (não deve ser alcançado)
    const redirectUrl = `${APP_BASE_URL}erro?motivo=desconhecido`;
    return Response.redirect(redirectUrl, 302);

  } catch (error) {
    console.error(error);
    const redirectUrl = `${APP_BASE_URL}erro?motivo=excecao_interna`;
    return Response.redirect(redirectUrl, 302);
  }
});