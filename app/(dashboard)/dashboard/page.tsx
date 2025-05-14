import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FolderList } from "@/components/folders/folder-list";
import { FileList } from "@/components/files/file-list";
import { CreateFolderButton } from "@/components/folders/create-folder-button";
import { UploadButton } from "@/components/files/upload-button";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground w-full sm:w-auto text-center sm:text-left">My Files</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
            <p className="text-foreground/70 text-lg">No files or folders yet</p>
            <p className="text-foreground/60 mt-2">
              Upload files or create folders to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}