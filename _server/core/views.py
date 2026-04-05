from django.shortcuts import render
from django.conf import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods, require_POST
from .ai import simple_prompt, chat_completion, MissingApiKeyError, grade_tutor_answer
from .models import TutorProgress


TUTOR_PARTS = {
    "cpu": "CPU",
    "cooler": "CPU Cooler",
    "mobo": "Motherboard",
    "ram": "Memory",
    "storage": "Storage",
    "gpu": "Video Card",
    "case": "Case",
    "psu": "Power Supply",
    "wifi": "Wi-Fi",
}

_TUTOR_STACK_FIELDS = {"partKey", "optionKey", "label", "summary", "partLabel", "attributes", "compatible"}

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)


@login_required
@csrf_exempt
@require_POST
def ai_simple(req):
    try:
        payload = json.loads(req.body.decode("utf-8"))
        prompt = payload.get("prompt")
    except Exception:
        prompt = req.POST.get("prompt")

    if not prompt:
        return JsonResponse({"error": "Missing 'prompt'."}, status=400)

    try:
        reply = simple_prompt(prompt)
        return JsonResponse({"reply": reply})
    except MissingApiKeyError:
        return JsonResponse({"error": "GROQ_API_KEY not set"}, status=500)


@login_required
@csrf_exempt
@require_POST
def ai_chat(req):
    try:
        payload = json.loads(req.body.decode("utf-8"))
    except Exception:
        payload = None

    messages = (payload or {}).get("messages")
    model = (payload or {}).get("model")

    if not isinstance(messages, list) or not messages:
        return JsonResponse({"error": "Missing 'messages' list."}, status=400)

    try:
        reply = chat_completion(messages, model=model or settings.AI_LLM_MODEL)
        return JsonResponse({"reply": reply})
    except MissingApiKeyError:
        return JsonResponse({"error": "GROQ_API_KEY not set"}, status=500)


def _get_or_create_progress(user):
    progress, _ = TutorProgress.objects.get_or_create(user=user)
    return progress


def _normalize_stack_item(item):
    if isinstance(item, str):
        part_key = item
        label = TUTOR_PARTS.get(part_key)
        if not label:
            return None

        return {
            "partKey": part_key,
            "optionKey": part_key,
            "label": label,
            "partLabel": label,
            "compatible": True,
        }

    if not isinstance(item, dict):
        return None

    part_key = item.get("partKey")
    label = item.get("label")

    if part_key not in TUTOR_PARTS or not isinstance(label, str) or not label.strip():
        return None

    normalized = {key: item[key] for key in item.keys() if key in _TUTOR_STACK_FIELDS}
    normalized["partKey"] = part_key
    normalized["optionKey"] = str(item.get("optionKey") or part_key)
    normalized["label"] = label.strip()
    normalized["partLabel"] = str(item.get("partLabel") or TUTOR_PARTS[part_key])
    normalized["compatible"] = bool(item.get("compatible", True))

    if "attributes" in normalized and not isinstance(normalized["attributes"], dict):
        normalized.pop("attributes", None)

    return normalized


@login_required
@csrf_exempt
@require_http_methods(["GET", "POST"])
def tutor_progress(req):
    progress = _get_or_create_progress(req.user)

    if req.method == "GET":
        return JsonResponse({"buildStack": progress.build_stack})

    try:
        payload = json.loads(req.body.decode("utf-8"))
    except Exception:
        payload = {}

    build_stack = payload.get("buildStack")
    if not isinstance(build_stack, list):
        return JsonResponse({"error": "Missing 'buildStack' list."}, status=400)

    sanitized_stack = []
    for item in build_stack:
        normalized_item = _normalize_stack_item(item)
        if normalized_item:
            sanitized_stack.append(normalized_item)

    progress.build_stack = sanitized_stack
    progress.save(update_fields=["build_stack", "updated_at"])

    return JsonResponse({"buildStack": progress.build_stack})


@login_required
@csrf_exempt
@require_POST
def tutor_grade_q1(req):
    try:
        payload = json.loads(req.body.decode("utf-8"))
    except Exception:
        payload = {}

    part_key = payload.get("partKey")
    answer = (payload.get("answer") or "").strip()

    if part_key not in TUTOR_PARTS:
        return JsonResponse({"error": "Invalid 'partKey'."}, status=400)

    if not answer:
        return JsonResponse({"error": "Missing 'answer'."}, status=400)

    try:
        result = grade_tutor_answer(part_key, answer)
    except MissingApiKeyError:
        return JsonResponse({"error": "GROQ_API_KEY not set"}, status=500)
    except ValueError as exc:
        return JsonResponse({"error": str(exc)}, status=400)
    except Exception:
        return JsonResponse({"error": "Tutor grading failed."}, status=500)

    return JsonResponse(
        {
            "correct": result["correct"],
            "feedback": result["feedback"],
        }
    )