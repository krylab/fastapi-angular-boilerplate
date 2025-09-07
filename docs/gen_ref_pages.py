"""Generate the code reference pages and navigation."""

import importlib.util
import sys
from pathlib import Path

import mkdocs_gen_files

nav = mkdocs_gen_files.Nav()

src_path = Path("rest_angular")

# Skip certain files/directories that might cause import issues
SKIP_PATTERNS = {
    "migrations/versions",  # Alembic migration files
    "__pycache__",
}


def should_skip_path(path: Path) -> bool:
    """Check if a path should be skipped."""
    path_str = str(path)
    return any(pattern in path_str for pattern in SKIP_PATTERNS)


for path in sorted(src_path.rglob("*.py")):
    if should_skip_path(path):
        continue

    module_path = path.relative_to(src_path).with_suffix("")
    doc_path = path.relative_to(src_path).with_suffix(".md")
    full_doc_path = Path("reference", doc_path)

    parts = tuple(module_path.parts)

    if parts[-1] == "__init__":
        parts = parts[:-1]
        doc_path = doc_path.with_name("index.md")
        full_doc_path = full_doc_path.with_name("index.md")
    elif parts[-1] == "__main__":
        continue

    # Skip empty parts (e.g., when processing root __init__.py)
    if not parts:
        continue

    nav[parts] = doc_path.as_posix()

    with mkdocs_gen_files.open(full_doc_path, "w") as fd:
        ident = ".".join(parts)
        if ident:
            # Add try/except handling for modules that might not import cleanly
            fd.write(f"""# {ident.replace(".", " / ").title()}

::: rest_angular.{ident}
    options:
      show_source: false
      show_root_heading: true
      heading_level: 2
""")
        else:
            fd.write("""# REST Angular API

::: rest_angular
    options:
      show_source: false
      show_root_heading: true
      heading_level: 2
""")

    mkdocs_gen_files.set_edit_path(full_doc_path, path)

with mkdocs_gen_files.open("reference/SUMMARY.md", "w") as nav_file:
    nav_file.writelines(nav.build_literate_nav())
