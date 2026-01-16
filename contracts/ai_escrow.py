# { "Depends": "py-genlayer:latest" }

from genlayer import *

STATUS_OPEN = "OPEN"
STATUS_SUBMITTED = "SUBMITTED"
STATUS_REVISION = "REVISION"
STATUS_APPROVED = "APPROVED"
STATUS_FAILED = "FAILED"


class AIEscrow(gl.Contract):
    next_job_id: u256

    exists: TreeMap[u256, bool]

    brief: TreeMap[u256, str]
    budget: TreeMap[u256, u256]
    deadline: TreeMap[u256, str]

    client: TreeMap[u256, str]
    freelancer: TreeMap[u256, str]

    submission_url: TreeMap[u256, str]
    status: TreeMap[u256, str]
    feedback: TreeMap[u256, str]

    def __init__(self) -> None:
        self.next_job_id = u256(1)

    def _require_job(self, job_id: u256) -> None:
        if job_id not in self.exists or self.exists[job_id] is False:
            raise Exception("Unknown job_id")

    def _as_u256(self, n: int) -> u256:
        # Defensive: avoid negative ids
        if n < 0:
            raise Exception("Negative value not allowed")
        return u256(n)

    # -------- views --------
    @gl.public.view
    def get_status(self, job_id: int) -> str:
        jid = self._as_u256(job_id)
        if jid not in self.exists or self.exists[jid] is False:
            return ""
        return self.status[jid]

    @gl.public.view
    def get_feedback(self, job_id: int) -> str:
        jid = self._as_u256(job_id)
        if jid not in self.exists or self.exists[jid] is False:
            return ""
        return self.feedback[jid]

    @gl.public.view
    def get_submission_url(self, job_id: int) -> str:
        jid = self._as_u256(job_id)
        if jid not in self.exists or self.exists[jid] is False:
            return ""
        return self.submission_url[jid]

    @gl.public.view
    def get_brief(self, job_id: int) -> str:
        jid = self._as_u256(job_id)
        if jid not in self.exists or self.exists[jid] is False:
            return ""
        return self.brief[jid]

    # -------- writes --------
    @gl.public.write
    def post_job(self, brief: str, budget: int, deadline: str) -> int:
        bud = self._as_u256(budget)

        job_id = self.next_job_id
        self.next_job_id = job_id + u256(1)

        self.exists[job_id] = True

        self.brief[job_id] = brief
        self.budget[job_id] = bud
        self.deadline[job_id] = deadline

        self.client[job_id] = "unknown"
        self.freelancer[job_id] = "unassigned"

        self.submission_url[job_id] = ""
        self.status[job_id] = STATUS_OPEN
        self.feedback[job_id] = ""

        # Return as int for schema/ABI compatibility
        return int(job_id)

    @gl.public.write
    def submit_delivery(self, job_id: int, url: str) -> None:
        jid = self._as_u256(job_id)
        self._require_job(jid)

        s = self.status[jid]
        if s != STATUS_OPEN and s != STATUS_REVISION:
            raise Exception("Job not accepting submissions")

        self.freelancer[jid] = "unknown"
        self.submission_url[jid] = url
        self.status[jid] = STATUS_SUBMITTED
        self.feedback[jid] = ""

    @gl.public.write
    def judge(self, job_id: int) -> str:
        jid = self._as_u256(job_id)
        self._require_job(jid)

        if self.status[jid] != STATUS_SUBMITTED:
            raise Exception("Nothing to judge")

        brief = self.brief[jid]
        url = self.submission_url[jid]

        def nd_eval() -> str:
            get_page = getattr(gl, "get_webpage", None)
            if get_page is not None and callable(get_page):
                evidence = get_page(url, mode="text")
                note = "Used fetched webpage text."
            else:
                evidence = url
                note = "Web fetch not available; judged using URL only."

            if len(evidence.strip()) < 10:
                return "FAILED|Empty/invalid submission. " + note

            bt = [w.lower() for w in brief.split() if len(w) >= 5]
            lower = evidence.lower()

            hits = 0
            for w in bt[:12]:
                if w in lower:
                    hits += 1

            if hits >= 1:
                return "APPROVED|Basic match with brief keywords. " + note
            return "REVISION|Not enough signal to verify brief match. " + note

        ep = getattr(gl, "eq_principle_strict_eq", None)
        if ep is None:
            ep = getattr(gl, "eq_principle_strict", None)
        if ep is None:
            ep = getattr(gl, "eq_principle", None)

        if ep is None:
            result = nd_eval()
        else:
            if not callable(ep):
                for name in ("strict_eq", "strict", "run", "execute", "call"):
                    candidate = getattr(ep, name, None)
                    if candidate is not None and callable(candidate):
                        ep = candidate
                        break
            result = ep(nd_eval) if callable(ep) else nd_eval()

        if result.startswith("APPROVED|"):
            self.status[jid] = STATUS_APPROVED
            self.feedback[jid] = result[len("APPROVED|") :]
            return STATUS_APPROVED

        if result.startswith("FAILED|"):
            self.status[jid] = STATUS_FAILED
            self.feedback[jid] = result[len("FAILED|") :]
            return STATUS_FAILED

        self.status[jid] = STATUS_REVISION
        if result.startswith("REVISION|"):
            self.feedback[jid] = result[len("REVISION|") :]
        else:
            self.feedback[jid] = result
        return STATUS_REVISION
