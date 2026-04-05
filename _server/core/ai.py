import os
import json
import re
from functools import lru_cache
from groq import Groq
from django.conf import settings


class MissingApiKeyError(Exception):
    pass


@lru_cache(maxsize=1)
def get_client() -> Groq:
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        raise MissingApiKeyError("GROQ_API_KEY not set")
    return Groq(api_key=key)


def simple_prompt(prompt: str, model: str = settings.AI_LLM_MODEL) -> str:
    resp = get_client().chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=model,
    )
    return resp.choices[0].message.content


def chat_completion(messages: list[dict], model: str = settings.AI_LLM_MODEL)-> str:
    resp = get_client().chat.completions.create(
        messages=messages,
        model=model,
    )
    return resp.choices[0].message.content


TUTOR_PARTS = {
    "cpu": {
        "label": "CPU",
        "what_it_is": "The CPU is the computer's processor.",
        "what_it_does": "It handles instructions, calculations, and most of the system's decision-making.",
        "compatibility": "The CPU socket must match the motherboard socket, and the cooler bracket must fit the CPU mount.",
    },
    "cooler": {
        "label": "CPU Cooler",
        "what_it_is": "A cooler removes heat from the CPU and sometimes other parts.",
        "what_it_does": "It keeps the system from overheating so the PC can stay stable and fast.",
        "compatibility": "The cooler must fit the CPU socket, the case height limit, and any RAM clearance constraints.",
    },
    "mobo": {
        "label": "Motherboard",
        "what_it_is": "The motherboard is the main circuit board of the PC.",
        "what_it_does": "It connects the CPU, RAM, storage, GPU, power, and accessories so they can work together.",
        "compatibility": "Match CPU socket, chipset, RAM generation, and case form factor before buying a board.",
    },
    "ram": {
        "label": "Memory",
        "what_it_is": "RAM is temporary high-speed memory for active tasks.",
        "what_it_does": "It keeps programs and data ready so the PC can work quickly while powered on.",
        "compatibility": "Match DDR generation, speed support, capacity limits, and motherboard slot layout.",
    },
    "storage": {
        "label": "Storage",
        "what_it_is": "Storage keeps the operating system, programs, and files when the PC is turned off.",
        "what_it_does": "It gives the PC long-term space for data and determines how quickly files and apps load.",
        "compatibility": "Storage type and interface must match the motherboard, and NVMe drives need a supported M.2 slot.",
    },
    "gpu": {
        "label": "Video Card",
        "what_it_is": "The GPU is the graphics processor.",
        "what_it_does": "It renders images, video, and 3D graphics, and helps with gaming or visual workloads.",
        "compatibility": "Check PCIe slot support, case clearance, and PSU wattage and connectors.",
    },
    "case": {
        "label": "Case",
        "what_it_is": "The case is the outer enclosure that holds the PC.",
        "what_it_does": "It protects the components, shapes airflow, and gives the build its physical layout.",
        "compatibility": "Check motherboard size, GPU length, PSU placement, and cooler height before choosing a case.",
    },
    "psu": {
        "label": "Power Supply",
        "what_it_is": "The PSU is the power supply unit.",
        "what_it_does": "It converts wall power into the stable voltages the PC parts need.",
        "compatibility": "Check total wattage, connector types, efficiency rating, and case fit.",
    },
    "wifi": {
        "label": "Wi-Fi",
        "what_it_is": "Wi-Fi hardware gives the PC wireless networking access.",
        "what_it_does": "It lets the system connect to the internet without an ethernet cable.",
        "compatibility": "Check whether the board already includes Wi-Fi or needs PCIe, M.2, or USB support.",
    },
}


def _extract_json_object(text: str) -> dict:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(0)

    return json.loads(cleaned)


def grade_tutor_answer(part_key: str, answer: str, model: str = settings.AI_LLM_MODEL) -> dict:
    part = TUTOR_PARTS.get(part_key)
    if not part:
        raise ValueError("Unknown tutor part key")

    prompt = f"""
You are grading a PC tutor answer.

Return ONLY valid JSON with these keys:
- correct: boolean
- feedback: string

Rules:
- Use only the lesson content below.
- If the answer is clearly correct, set correct to true.
- If the answer is wrong, vague, or off-topic, set correct to false.
- Keep feedback short, specific, and helpful.
- Do not include markdown, code fences, or extra keys.

Lesson content:
Part: {part['label']}
What it is: {part['what_it_is']}
What it does: {part['what_it_does']}
Compatibility: {part['compatibility']}

Student answer:
{answer}
""".strip()

    resp = get_client().chat.completions.create(
        messages=[
            {"role": "system", "content": "You grade answers for a PC building tutor."},
            {"role": "user", "content": prompt},
        ],
        model=model,
        temperature=0,
    )
    content = resp.choices[0].message.content or ""
    result = _extract_json_object(content)

    correct = bool(result.get("correct"))
    feedback = str(result.get("feedback") or "")

    return {
        "correct": correct,
        "feedback": feedback,
        "raw": content,
    }
