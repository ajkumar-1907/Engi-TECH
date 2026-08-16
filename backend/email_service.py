"""
Email sending via Resend (https://resend.com).

Set RESEND_API_KEY in your environment. Until you verify your own domain
with Resend, RESEND_FROM_EMAIL must stay on their shared 'onboarding@resend.dev'
sender, which only delivers to the email address you signed up to Resend with —
fine for development, not for real users. Verify a domain before going live.
"""
import os
import logging
from starlette.concurrency import run_in_threadpool

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "EngiTech <onboarding@resend.dev>")

_resend = None
if RESEND_API_KEY:
    import resend as _resend_module
    _resend_module.api_key = RESEND_API_KEY
    _resend = _resend_module


async def send_email(to: str, subject: str, html: str) -> bool:
    """Best-effort send. Never raises — auth flows must not break if email fails."""
    if not _resend:
        logger.warning(f"RESEND_API_KEY not set — skipping email to {to}: {subject}")
        return False
    try:
        await run_in_threadpool(
            _resend.Emails.send,
            {"from": FROM_EMAIL, "to": [to], "subject": subject, "html": html},
        )
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")
        return False


def _wrapper(title: str, body_html: str) -> str:
    return f"""
    <div style="font-family: 'Courier New', monospace; max-width: 480px; margin: 0 auto; padding: 32px 24px; border: 2px solid #111;">
      <h2 style="text-transform: uppercase; letter-spacing: 1px; font-size: 18px; margin-bottom: 24px;">{title}</h2>
      {body_html}
      <p style="margin-top: 32px; font-size: 12px; color: #666;">EngiTech &mdash; Engineering Equipment Reference Platform</p>
    </div>
    """


def verification_email_html(name: str, link: str) -> str:
    body = f"""
      <p style="font-size: 14px; line-height: 1.6;">Hi {name or 'there'},</p>
      <p style="font-size: 14px; line-height: 1.6;">Confirm your email address to finish setting up your EngiTech account.</p>
      <p style="margin: 24px 0;">
        <a href="{link}" style="background:#111; color:#fff; padding: 12px 20px; text-decoration:none; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Verify Email</a>
      </p>
      <p style="font-size: 12px; color: #666;">This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>
    """
    return _wrapper("Verify your email", body)


def reset_email_html(name: str, link: str) -> str:
    body = f"""
      <p style="font-size: 14px; line-height: 1.6;">Hi {name or 'there'},</p>
      <p style="font-size: 14px; line-height: 1.6;">We received a request to reset your EngiTech password. Click below to choose a new one.</p>
      <p style="margin: 24px 0;">
        <a href="{link}" style="background:#111; color:#fff; padding: 12px 20px; text-decoration:none; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Reset Password</a>
      </p>
      <p style="font-size: 12px; color: #666;">This link expires in 30 minutes. If you didn't request this, you can safely ignore this email — your password will not change.</p>
    """
    return _wrapper("Reset your password", body)
