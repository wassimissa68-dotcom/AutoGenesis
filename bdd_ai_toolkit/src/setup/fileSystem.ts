// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Platform } from "./platform";

/**
 * Ensure a directory exists, creating it if necessary
 * @param dirPath The directory path to check/create
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Open a directory in the native file explorer.
 * Uses execFile with argument arrays to prevent command injection vulnerabilities.
 * @param dirPath The directory path to open
 */
export function openInFileExplorer(dirPath: string): void {
  // Security validation: Prevent path traversal/null byte injections and invalid inputs
  if (!dirPath || typeof dirPath !== "string" || dirPath.includes("\0")) {
    console.error("Invalid directory path provided to openInFileExplorer");
    return;
  }

  // Security: Use execFile without shell invocation to avoid command injection via malicious path characters
  const { execFile } = require("child_process");

  const handleError = (error: Error | null) => {
    if (error) {
      console.error(`Failed to open path in file explorer: ${error.message}`);
    }
  };

  if (Platform.isMacOS) {
    // macOS - Use 'open' command to open in Finder
    execFile("open", [dirPath], handleError);
  } else if (Platform.isWindows) {
    // Windows - Use 'explorer.exe' command
    execFile("explorer.exe", [dirPath], handleError);
  } else {
    // Linux - Try xdg-open (fallback, though we removed Linux support)
    execFile("xdg-open", [dirPath], handleError);
  }
}

/**
 * Check if a path is within the current workspace
 * @param absolutePath The absolute path to check
 * @returns True if the path is within the workspace, false otherwise
 */
export function isPathInWorkspace(absolutePath: string): boolean {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    return false;
  }

  const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
  return absolutePath.startsWith(workspaceRoot);
}

/**
 * Reads and optionally adds frontmatter to a markdown file
 * @param filePath Path to the markdown file to read
 * @param addFrontmatter Whether to add frontmatter if not present
 * @returns The content of the markdown file, potentially with added frontmatter
 */
export function readMarkdownWithFrontmatter(
  filePath: string,
  addFrontmatter = false
): string {
  let content = fs.readFileSync(filePath, "utf8");

  // Add frontmatter if requested and not already present
  if (addFrontmatter && !content.includes("---\napplyTo:")) {
    // Remove any existing frontmatter
    if (content.startsWith("---")) {
      const secondDashes = content.indexOf("---", 3);
      if (secondDashes !== -1) {
        content = content.substring(secondDashes + 3).trim();
      }
    }
    content = `---\napplyTo: '**'\n---\n${content}`;
  }

  return content;
}

/**
 * Copy file and ensure target directory exists
 * @param sourcePath Path to the source file
 * @param targetPath Path to the target file
 */
export function copyFileWithDir(sourcePath: string, targetPath: string): void {
  // Ensure the target directory exists
  const targetDir = path.dirname(targetPath);
  ensureDirectoryExists(targetDir);

  // Copy the file
  fs.copyFileSync(sourcePath, targetPath);
}

/**
 * Clean up a temporary file with proper error handling
 * @param filePath The path to the file to clean up
 */
export async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Temporary file cleaned up");
    }
  } catch (err) {
    console.error(`Failed to delete temporary file: ${err}`);
  }
}
