#!/usr/bin/env python3
"""
Export a Cursor agent transcript JSONL to Markdown.
Format matches extract_chat_gpt.js (User/Assistant headings, preserved text).
"""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_TRANSCRIPT = (
    Path.home()
    / ".cursor/projects/d-git-engineering/agent-transcripts"
    / "96a75e78-5d00-4e9a-a52e-bfac09f2cc13"
    / "96a75e78-5d00-4e9a-a52e-bfac09f2cc13.jsonl"
)


def format_content_block(item: dict, conversation_only: bool = False) -> str:
    ctype = item.get("type", "")
    if ctype == "text":
        return item.get("text", "")
    if conversation_only:
        return ""
    if ctype == "tool_use":
        name = item.get("name", "tool")
        payload = json.dumps(item.get("input", {}), indent=2, ensure_ascii=False)
        return f"**[Tool: {name}]**\n\n```json\n{payload}\n```"
    if ctype == "tool_result":
        content = item.get("content", item.get("text", ""))
        if isinstance(content, list):
            parts = []
            for part in content:
                if isinstance(part, dict) and part.get("type") == "text":
                    parts.append(part.get("text", ""))
                else:
                    parts.append(str(part))
            content = "\n".join(parts)
        return f"**[Tool result]**\n\n{content}"
    if conversation_only:
        return ""
    return json.dumps(item, indent=2, ensure_ascii=False)


def clean_user_text(text: str) -> str:
    text = text.strip()
    has_image = "[Image]" in text or "<image_files>" in text
    match = re.search(r"<user_query>\s*(.*?)\s*</user_query>", text, re.DOTALL)
    if match:
        body = match.group(1).strip()
        if has_image:
            return f"[Image attached]\n\n{body}"
        return body
    cleaned = re.sub(r"<image_files>.*?</image_files>\s*", "", text, flags=re.DOTALL).strip()
    return cleaned


def message_body(content_items: list, role: str, conversation_only: bool) -> str:
    parts = [format_content_block(item, conversation_only) for item in content_items]
    body = "\n\n".join(p for p in parts if p).strip()
    if role == "user":
        body = clean_user_text(body)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip()


def role_heading(role: str, js_style: bool) -> str:
    role_title = "User" if role == "user" else "Assistant"
    if js_style:
        color = "blue" if role == "user" else "green"
        return (
            f'<span style="font-size:2em; color:{color}; font-weight:bold;">'
            f"{role_title}</span>"
        )
    return f"## {role_title}"


def message_to_markdown(
    role: str,
    content_items: list,
    *,
    js_style: bool = False,
    conversation_only: bool = False,
) -> str:
    body = message_body(content_items, role, conversation_only)
    if not body:
        return ""
    heading = role_heading(role, js_style)
    return f"{heading}\n\n{body}\n"


def load_messages(transcript_path: Path) -> list[dict]:
    messages: list[dict] = []
    for line in transcript_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        obj = json.loads(line)
        role = obj.get("role", "unknown")
        content = obj.get("message", {}).get("content", [])
        if not content:
            continue
        messages.append({"role": role, "content": content})
    return messages


def merge_consecutive_messages(messages: list[dict]) -> list[dict]:
    merged: list[dict] = []
    for message in messages:
        if merged and merged[-1]["role"] == message["role"]:
            merged[-1]["content"].extend(message["content"])
        else:
            merged.append({"role": message["role"], "content": list(message["content"])})
    return merged


def export_transcript(
    transcript_path: Path,
    output_path: Path,
    *,
    include_subagents: bool = False,
    js_style: bool = True,
    conversation_only: bool = True,
) -> None:
    messages = merge_consecutive_messages(load_messages(transcript_path))
    parts: list[str] = []
    parts.append("# Exported Conversation\n")
    parts.append(f"_Exported: {datetime.now(timezone.utc).isoformat()}_\n")

    msg_count = 0
    for message in messages:
        block = message_to_markdown(
            message["role"],
            message["content"],
            js_style=js_style,
            conversation_only=conversation_only,
        )
        if not block:
            continue
        parts.append(block)
        msg_count += 1

    if include_subagents:
        sub_dir = transcript_path.parent / "subagents"
        if sub_dir.is_dir():
            for sub_file in sorted(sub_dir.glob("*.jsonl")):
                parts.append(f"\n---\n\n# Subagent transcript: `{sub_file.name}`\n\n")
                for message in merge_consecutive_messages(load_messages(sub_file)):
                    block = message_to_markdown(
                        message["role"],
                        message["content"],
                        js_style=js_style,
                        conversation_only=conversation_only,
                    )
                    if block:
                        parts.append(block)

    md_full = "\n".join(parts).replace("\r\n", "\n")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(md_full, encoding="utf-8")
    print(f"Exported {msg_count} conversation turns -> {output_path}")
    print(f"Size: {output_path.stat().st_size:,} bytes")


def main() -> None:
    args = sys.argv[1:]
    full_export = "--full" in args
    if full_export:
        args.remove("--full")

    transcript = Path(args[0]) if args else DEFAULT_TRANSCRIPT
    if len(args) > 1:
        output = Path(args[1])
    else:
        output = ROOT / "docs" / "prompts.md"

    if not transcript.exists():
        print(f"Transcript not found: {transcript}")
        sys.exit(1)

    export_transcript(
        transcript,
        output,
        js_style=True,
        conversation_only=not full_export,
        include_subagents=full_export,
    )


if __name__ == "__main__":
    main()
