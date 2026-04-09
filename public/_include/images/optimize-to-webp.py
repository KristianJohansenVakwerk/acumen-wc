#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
from pathlib import Path


DEFAULT_QUALITY = 82
IMAGES_DIR = Path(__file__).resolve().parent
CONVERT_EXTS = {".jpg", ".jpeg", ".png"}


def format_bytes(n: int) -> str:
    units = ["B", "KB", "MB", "GB"]
    f = float(n)
    i = 0
    while f >= 1024.0 and i < len(units) - 1:
        f /= 1024.0
        i += 1
    digits = 0 if i == 0 else 1
    return f"{f:.{digits}f} {units[i]}"


def gather_source_files(paths: list[str], only: set[str]) -> list[Path]:
    if not paths:
        source_files = [
            p for p in IMAGES_DIR.iterdir() if p.is_file() and p.suffix.lower() in CONVERT_EXTS
        ]
        if only:
            source_files = [p for p in source_files if p.name in only]
        return sorted(source_files, key=lambda p: p.name)

    out: list[Path] = []
    seen: set[Path] = set()

    for raw in paths:
        p = Path(raw).expanduser()
        if not p.exists():
            raise SystemExit(f"Path does not exist: {raw}")

        if p.is_dir():
            files = [
                c for c in p.iterdir() if c.is_file() and c.suffix.lower() in CONVERT_EXTS
            ]
            if only:
                files = [c for c in files if c.name in only]
            files = sorted(files, key=lambda x: x.name)
        else:
            if p.suffix.lower() not in CONVERT_EXTS:
                continue
            if only and p.name not in only:
                continue
            files = [p]

        for f in files:
            try:
                key = f.resolve()
            except Exception:
                key = f
            if key in seen:
                continue
            seen.add(key)
            out.append(f)

    return out


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Convert JPG/PNG files in this folder to high-quality WebP."
    )
    parser.add_argument(
        "-q",
        "--quality",
        type=int,
        default=DEFAULT_QUALITY,
        help=f"WebP quality 1-100 (default {DEFAULT_QUALITY})",
    )
    parser.add_argument(
        "-f",
        "--force",
        action="store_true",
        help="Overwrite existing .webp outputs",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be done without writing files",
    )
    parser.add_argument(
        "--scale",
        type=float,
        default=1.0,
        help="Scale dimensions by this factor (e.g. 0.5 halves width/height). Default 1.0",
    )
    parser.add_argument(
        "--only",
        action="append",
        default=[],
        help="Only process a specific filename (repeatable). Example: --only 'Razak–ACUMEN_OMIA_11.jpg'",
    )
    parser.add_argument(
        "paths",
        nargs="*",
        help="Optional input file(s) and/or directory(ies) to process. Defaults to this script's folder.",
    )
    args = parser.parse_args()

    if args.quality < 1 or args.quality > 100:
        raise SystemExit("quality must be in range 1-100")
    if args.scale <= 0:
        raise SystemExit("scale must be > 0")

    try:
        from PIL import Image  # type: ignore
    except Exception:
        print("Missing dependency: Pillow.")
        print("Create a venv and install it:")
        print("  python3 -m venv .venv-images && . .venv-images/bin/activate")
        print("  python -m pip install --upgrade pip pillow")
        return 2

    only_set = set(args.only) if args.only else set()
    source_files = gather_source_files(args.paths, only_set)

    if not source_files:
        if args.paths:
            print("No JPG/PNG images found in the provided path(s).")
        else:
            print(f"No JPG/PNG images found in {IMAGES_DIR}")
        return 0

    converted = 0
    skipped = 0
    total_before = 0
    total_after = 0

    for src in source_files:
        out = src.with_suffix(".webp")
        before = src.stat().st_size
        total_before += before

        if out.exists() and not args.force:
            skipped += 1
            total_after += out.stat().st_size
            print(f"skip  {src.name} (exists)")
            continue

        if args.dry_run:
            converted += 1
            scale_note = "" if args.scale == 1.0 else f", scale={args.scale:g}"
            print(f"dry   {src.name} -> {out.name} (q={args.quality}{scale_note})")
            continue

        with Image.open(src) as im:
            if args.scale != 1.0:
                w, h = im.size
                new_w = max(1, int(round(w * args.scale)))
                new_h = max(1, int(round(h * args.scale)))
                if (new_w, new_h) != (w, h):
                    im = im.resize((new_w, new_h), resample=Image.Resampling.LANCZOS)

            # Preserve alpha when present; avoid unnecessary conversions.
            save_kwargs = {
                "format": "WEBP",
                "quality": args.quality,
                "method": 6,
            }
            if im.mode in ("RGBA", "LA") or (
                im.mode == "P" and "transparency" in im.info
            ):
                save_kwargs["lossless"] = False

            im.save(out, **save_kwargs)

        after = out.stat().st_size
        converted += 1
        total_after += after

        print(
            f"done  {src.name} -> {out.name} ({format_bytes(before)} -> {format_bytes(after)})"
        )

    print("")
    print(
        f"Summary: converted {converted}, skipped {skipped}, quality={args.quality}, force={args.force}, dryRun={args.dry_run}"
    )
    saved = max(0, total_before - total_after)
    print(
        f"Total: {format_bytes(total_before)} -> {format_bytes(total_after)} ({format_bytes(saved)} saved)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

