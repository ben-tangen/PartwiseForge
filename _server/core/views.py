from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .ai import simple_prompt, chat_completion, MissingApiKeyError

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
        reply = chat_completion(messages, model=model or "llama-3.1-8b-instant")
        return JsonResponse({"reply": reply})
    except MissingApiKeyError:
        return JsonResponse({"error": "GROQ_API_KEY not set"}, status=500)