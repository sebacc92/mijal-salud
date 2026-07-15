import { SITE_URL, LEAD_SERVICIOS } from "~/lib/constants";

interface LeadNotification {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  empresa?: string | null;
  servicio: string;
  segmento: string;
  mensaje?: string | null;
}

interface NotifyConfig {
  apiKey?: string; // RESEND_API_KEY
  to?: string; // LEADS_NOTIFY_EMAIL
  from?: string; // LEADS_NOTIFY_FROM (opcional)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Envía un email de notificación cuando entra un lead nuevo, usando Resend.
 * Es a prueba de fallos: si falta RESEND_API_KEY o LEADS_NOTIFY_EMAIL, o si
 * Resend responde con error, sólo loguea y sigue sin romper el flujo del lead.
 */
export async function notifyNewLead(
  lead: LeadNotification,
  cfg: NotifyConfig,
): Promise<void> {
  const from = cfg.from || "Mijal Salud Leads <onboarding@resend.dev>";

  if (!cfg.apiKey) {
    console.log("[notifyNewLead] RESEND_API_KEY no configurada; se omite el email.");
    return;
  }
  if (!cfg.to) {
    console.log("[notifyNewLead] LEADS_NOTIFY_EMAIL no configurada; se omite el email.");
    return;
  }

  const servicioLabel =
    LEAD_SERVICIOS.find((s) => s.value === lead.servicio)?.label ?? lead.servicio;
  const panelUrl = `${SITE_URL}/admin/leads`;
  const subject = `Nuevo lead: ${lead.nombre} — ${servicioLabel}`;

  const rows: [string, string][] = [
    ["Nombre", lead.nombre],
    ["Email", lead.email],
    ["Teléfono", lead.telefono || "—"],
    ["Empresa", lead.empresa || "—"],
    ["Servicio", servicioLabel],
    ["Segmento", lead.segmento],
    ["Mensaje", lead.mensaje || "—"],
    ["ID", lead.id],
  ];

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color:#0f172a; max-width:560px; margin:0 auto;">
      <h2 style="margin:0 0 4px;">Nuevo lead recibido</h2>
      <p style="color:#64748b; margin:0 0 16px;">Desde el sitio de Mijal Salud</p>
      <table style="border-collapse:collapse; width:100%; font-size:14px;">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; font-weight:bold; width:120px; vertical-align:top;">${escapeHtml(k)}</td>
            <td style="padding:8px 12px; border:1px solid #e2e8f0; white-space:pre-wrap;">${escapeHtml(v)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 0;">
        <a href="${panelUrl}" style="background:#00A651; color:#ffffff; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block;">Ver en el panel</a>
      </p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: cfg.to,
        subject,
        html,
        reply_to: lead.email,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[notifyNewLead] Resend respondió ${res.status}: ${detail}`);
    }
  } catch (err) {
    console.error("[notifyNewLead] Error enviando el email de notificación:", err);
  }
}
