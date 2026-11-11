# Sentinel's Journal

## 2026-11-11 - Command Injection in Native File Explorer Opening
**Vulnerability:** `openInFileExplorer` directly interpolated filesystem paths into platform shell commands (`open "${dirPath}"`, `explorer "${dirPath}"`, and `xdg-open "${dirPath}"`) using `child_process.exec`.
**Learning:** Shell command execution for OS integration exposes a command injection vector if paths contain quotes or shell metacharacters. VS Code extensions have a built-in command `vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(dirPath))` that safely opens the OS file explorer without spawning a shell.
**Prevention:** Avoid invoking system shells via `child_process.exec` for OS integrations; use VS Code's native API commands or parameterized process execution without a shell.
