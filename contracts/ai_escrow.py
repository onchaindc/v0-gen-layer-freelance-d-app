# { "Depends": "py-genlayer:latest" }

from genlayer import *

STATUS_OPEN = "OPEN"
STATUS_SUBMITTED = "SUBMITTED"
STATUS_REVISION = "REVISION"
STATUS_APPROVED = "APPROVED"
STATUS_FAILED = "FAILED"

ZERO_ADDR = Address("0x0000000000000000000000000000000000000000")


class AIEscrow(gl.Contract):
    next_job_id: u256
    exists: TreeMap[u256, bool]

    brief: TreeMap[u256, str]
    deadline: TreeMap[u256, str]

    # DEMO: budget is just stored (no deposit)
    budget: TreeMap[u256, u256]

    client: TreeMap[u256, Address]
    freelancer: TreeMap[u256, Address]

    submission_url: TreeMap[u256, str]
    submission_description: TreeMap[u256, str]  # ✅ stored on-chain

    status: TreeMap[u256, str]
    feedback: TreeMap[u256, str]

    def __init__(self) -> None:
        self.next_job_id = u256(1)

    def _require_job(self, job_id: u256) -> None:
        if job_id not in self.exists or self.exists[job_id] is False:
            raise Exception("Unknown job_id")

    def _as_u256(self, n: int) -> u256:
        if n < 0:
            raise Exception("Negative value not allowed")
        return u256(n)

    # -------- views --------
    @gl.public.view
    def get_next_job_id(self) -> int:
        return int(self.next_job_id)

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
    def get_submission_description(self, job_id: int) -> str:
        jid = self._as_u256(job_id)
        if jid not in self.exists or self.exists[jid] is False:
            return ""
        return self.submission_description[jid]

    @gl.public.view
    def get_brief(self, job_id: int) -> str:
        jid = self._as_u256(job_id)
        if jid not in self.exists or self.exists[jid] is False:
            return ""
        return self.brief[jid]

    @gl.public.view
    def get_budget(self, job_id: int) -> int:
        jid = self._as_u256(job_id)
        if jid not in self.exists or self.exists[jid] is False:
            return 0
        return int(self.budget[jid])

    # -------- writes --------

    # ✅ DEMO: NOT PAYABLE. No deposit required.
    @gl.public.write
    def post_job(self, brief: str, budget: int, deadline: str) -> int:
        bud = self._as_u256(budget)

        if len(brief.strip()) == 0:
            raise Exception("Brief cannot be empty")
        if len(deadline.strip()) == 0:
            raise Exception("Deadline cannot be empty")
        if bud <= u256(0):
            raise Exception("Budget must be > 0")

        job_id = self.next_job_id
        self.next_job_id = job_id + u256(1)

        self.exists[job_id] = True

        self.brief[job_id] = brief
        self.budget[job_id] = bud
        self.deadline[job_id] = deadline

        self.client[job_id] = gl.message.sender_address
        self.freelancer[job_id] = ZERO_ADDR  # ✅ correct default

        self.submission_url[job_id] = ""
        self.submission_description[job_id] = ""
        self.status[job_id] = STATUS_OPEN
        self.feedback[job_id] = ""

        return int(job_id)

    # ✅ signature: (job_id, url, description)
    @gl.public.write
    def submit_delivery(self, job_id: int, url: str, description: str) -> None:
        jid = self._as_u256(job_id)
        self._require_job(jid)

        s = self.status[jid]
        if s != STATUS_OPEN and s != STATUS_REVISION:
            raise Exception("Job not accepting submissions")

        if len(url.strip()) == 0:
            raise Exception("URL cannot be empty")
        if len(description.strip()) == 0:
            raise Exception("Description cannot be empty")

        self.freelancer[jid] = gl.message.sender_address
        self.submission_url[jid] = url
        self.submission_description[jid] = description
        self.status[jid] = STATUS_SUBMITTED
        self.feedback[jid] = ""

    # ✅ Judge only sets status + feedback (no money logic)
    @gl.public.write
    def judge(self, job_id: int) -> str:
        jid = self._as_u256(job_id)
        self._require_job(jid)

        if self.status[jid] != STATUS_SUBMITTED:
            raise Exception("Nothing to judge")

        brief = self.brief[jid]
        url = self.submission_url[jid]
        delivery_note = self.submission_description[jid]

        def nd_eval() -> str:
            # Try new nondet web API
            web = getattr(getattr(gl, "nondet", None), "web", None)
            render = getattr(web, "render", None) if web is not None else None

            if render is not None and callable(render):
                evidence = render(url, mode="text")
                note = "Fetched webpage text."
            else:
                evidence = url
                note = "Web fetch not available; judged using URL only."

            combined = (evidence or "") + "\n\nDELIVERY_NOTE:\n" + (delivery_note or "")
            if len(combined.strip()) < 10:
                return "FAILED|Empty/invalid submission. " + note

            bt = [w.lower() for w in brief.split() if len(w) >= 5]
            lower = combined.lower()

            hits = 0
            for w in bt[:12]:
                if w in lower:
                    hits += 1

            if hits >= 1:
                return "APPROVED|Basic match with brief keywords. " + note
            return "REVISION|Not enough signal to verify brief match. " + note

        # Use newer eq_principle API if available
        ep = getattr(gl, "eq_principle", None)
        strict_eq = getattr(ep, "strict_eq", None) if ep is not None else None

        result = strict_eq(nd_eval) if strict_eq is not None and callable(strict_eq) else nd_eval()

        if result.startswith("APPROVED|"):
            self.status[jid] = STATUS_APPROVED
            self.feedback[jid] = result[len("APPROVED|") :]
            return STATUS_APPROVED

        if result.startswith("FAILED|"):
            self.status[jid] = STATUS_FAILED
            self.feedback[jid] = result[len("FAILED|") :]
            return STATUS_FAILED

        self.status[jid] = STATUS_REVISION
        self.feedback[jid] = result[len("REVISION|") :] if result.startswith("REVISION|") else result
        return STATUS_REVISION
