## 2025-05-18 - Shell Command Injection in File Explorer Opener
**Vulnerability:** `openInFileExplorer` in `bdd_ai_toolkit/src/setup/fileSystem.ts` used `child_process.exec` with unescaped directory path interpolation (`exec(\`open "${dirPath}"\`)` on macOS, `explorer` on Windows, and `xdg-open` on Linux). If a path contains quotes and command separators, arbitrary shell commands could be executed.
**Learning:** Utilities that launch OS viewers or tools often default to `exec()` with template strings, inadvertently opening a command injection vector if paths contain spaces or special characters.
**Prevention:** Avoid `child_process.exec` when invoking system utilities with file paths; use `child_process.execFile` with separate arguments arrays and validate paths against null bytes.
