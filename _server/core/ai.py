import os
from functools import lru_cache
from groq import Groq


class MissingApiKeyError(Exception):
    pass


@lru_cache(maxsize=1)
def get_client() -> Groq:
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        raise MissingApiKeyError("GROQ_API_KEY not set")
    return Groq(api_key=key)


def simple_prompt(prompt: str, model: str = "llama-3.1-8b-instant") -> str:
    resp = get_client().chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=model,
    )
    return resp.choices[0].message.content


def chat_completion(messages: list[dict], model: str = "llama-3.1-8b-instant")-> str:
    resp = get_client().chat.completions.create(
        messages=messages,
        model=model,
    )
    return resp.choices[0].message.content
