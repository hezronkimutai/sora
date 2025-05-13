import { headers } from 'next/headers';
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FolderList } from "@/components/folders/folder-list";
import { FileList } from "@/components/files/file-list";
import { CreateFolderButton } from "@/components/folders/create-folder-button";
import { UploadButton } from "@/components/files/upload-button";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const headersList = await headers();
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch data server-side
  const [folders, files] = await Promise.all([
    db.folder.findMany({
      where: {
        userId,
        parentId: null,
      },
      include: {
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.file.findMany({
      where: {
        userId,
        folderId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
        <div className="flex gap-4">
          <CreateFolderButton />
          <UploadButton />
        </div>
      </div>

      <div className="space-y-6">
        {folders.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <FolderList folders={folders} />
          </section>
        )}

        {files.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            <FileList files={files} />
          </section>
        )}

        {folders.length === 0 && files.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No files or folders yet</p>
            <p className="text-gray-400 mt-2">
              Upload files or create folders to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}