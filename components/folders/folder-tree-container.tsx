import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FolderTree } from "./folder-tree";

export async function FolderTreeContainer() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch all folders with their hierarchy
  const folders = await db.folder.findMany({
    where: {
      userId,
      parentId: null, // Root folders
    },
    include: {
      _count: {
        select: {
          files: true,
          children: true,
        },
      },
      children: {
        include: {
          _count: {
            select: {
              files: true,
              children: true,
            },
          },
          children: {
            include: {
              _count: {
                select: {
                  files: true,
                  children: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <FolderTree folders={folders} />;
}