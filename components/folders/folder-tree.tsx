"use client";

import type { Folder } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TreeNodeProps {
  folder: Folder & {
    _count?: {
      files: number;
      children: number;
    };
    children?: (Folder & {
      _count?: {
        files: number;
        children: number;
      };
    })[];
  };
  level?: number;
}

function TreeNode({ folder, level = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const hasChildren = folder._count?.children ?? 0 > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer`}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-4 h-4 flex items-center justify-center"
          >
            <svg
              className={`w-3 h-3 transform transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => router.push(`/folder/${folder.id}`)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-blue-500"
          >
            <path d="M3 7v10c0 1.1.9 2 2 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="truncate">{folder.name}</span>
          {(folder._count?.files ?? 0) > 0 && (
            <span className="text-xs text-gray-500">
              ({folder._count?.files} files)
            </span>
          )}
        </button>
      </div>
      {isExpanded && folder.children && (
        <div className="ml-2">
          {folder.children.map((child) => (
            <TreeNode key={child.id} folder={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  folders: (Folder & {
    _count?: {
      files: number;
      children: number;
    };
    children?: (Folder & {
      _count?: {
        files: number;
        children: number;
      };
    })[];
  })[];
}

export function FolderTree({ folders }: FolderTreeProps) {
  return (
    <div className="border rounded-lg bg-white">
      {folders.map((folder) => (
        <TreeNode key={folder.id} folder={folder} />
      ))}
    </div>
  );
}