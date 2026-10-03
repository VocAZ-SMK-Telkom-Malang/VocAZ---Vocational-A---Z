// lib/email/templates/team-invite.tsx
type Props = {
  companyName: string
  inviterName: string
  role: string
  inviteUrl: string
  expiresAt: string
}

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  recruiter: 'Recruiter',
  viewer: 'Viewer',
}

export function TeamInviteEmail({
  companyName,
  inviterName,
  role,
  inviteUrl,
  expiresAt,
}: Props) {
  const roleLabel = ROLE_LABEL[role] ?? role

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Undangan Bergabung ke ${companyName}</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background:#FAF8F5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF8F5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px -12px rgba(183,0,17,0.15);max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#b70011 0%,#dc2626 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:800;letter-spacing:-0.03em;">
                VocAZ
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">
                Team Invitation
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 8px;color:#141B2B;font-size:22px;font-weight:800;letter-spacing:-0.02em;">
                Kamu Diundang Bergabung 🎉
              </h2>
              <p style="margin:0 0 24px;color:#5C403C;font-size:15px;line-height:1.6;">
                <strong>${inviterName}</strong> mengundangmu untuk bergabung ke tim <strong>${companyName}</strong> di VocAZ dengan role:
              </p>
              
              <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-right:12px;">
                      <span style="display:inline-block;width:32px;height:32px;background:#B45309;border-radius:8px;text-align:center;line-height:32px;color:#FFFFFF;font-size:16px;font-weight:800;">
                        ★
                      </span>
                    </td>
                    <td>
                      <div style="color:#92400E;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
                        Role
                      </div>
                      <div style="color:#78350F;font-size:16px;font-weight:800;margin-top:2px;">
                        ${roleLabel}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${inviteUrl}" style="display:inline-block;background:linear-gradient(135deg,#b70011 0%,#dc2626 100%);color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:999px;box-shadow:0 8px 24px -4px rgba(183,0,17,0.4);">
                  Terima Undangan →
                </a>
              </div>
              
              <!-- Fallback link -->
              <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:16px 20px;">
                <p style="margin:0 0 8px;color:#6B7280;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">
                  Atau copy link ini:
                </p>
                <p style="margin:0;color:#141B2B;font-size:12px;font-family:monospace;word-break:break-all;">
                  ${inviteUrl}
                </p>
              </div>
              
              <p style="margin:24px 0 0;color:#9CA3AF;font-size:12px;text-align:center;">
                Undangan ini berlaku sampai <strong style="color:#5C403C;">${expiresAt}</strong>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#FAF8F5;text-align:center;border-top:1px solid #E5E7EB;">
              <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.6;">
                Email ini dikirim oleh VocAZ — Smart Career & Talent Ecosystem for SMK.<br>
                Kalau kamu tidak merasa diundang, abaikan email ini.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}