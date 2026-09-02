import logging
import json
from datetime import datetime
from typing import Dict, Any, Optional

# Setup dedicated AGRIFlow Audit Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agriflow.audit")

class AuditLoggerService:
    """
    AGRIFlow Transaction Audit & Security Event Logging Service.
    Records timestamped matching decisions, price guidance calculations, order state transitions, and security checks.
    """

    def log_event(
        self,
        event_type: str,
        user_id: Optional[str],
        action: str,
        details: Dict[str, Any],
        status: str = "SUCCESS"
    ):
        event_record = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "event_type": event_type,
            "user_id": user_id or "ANONYMOUS",
            "action": action,
            "status": status,
            "details": details
        }
        logger.info(f"[AUDIT] {json.dumps(event_record)}")
        return event_record

audit_logger = AuditLoggerService()
