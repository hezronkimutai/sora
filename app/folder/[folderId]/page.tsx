import { FolderList } from "@/components/folders/folder-list";
import { FileList } from "@/components/files/file-list";
import { CreateFolderButton } from "@/components/folders/create-folder-button";
import { UploadButton } from "@/components/files/upload-button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default async function Page({ 
  params 
}: { 
  params: Promise<{ folderId: string }> 
}) {
  const resolvedParams = await params;
  const { folderId } = resolvedParams;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const currentFolder = await db.folder.findUnique({
    where: {
      id: folderId,
      userId,
    },
  });

  if (!currentFolder) {
    redirect("/dashboard");
  }

  const [folders, files] = await Promise.all([
    db.folder.findMany({
      where: {
        userId,
        parentId: folderId,
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
        folderId: folderId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const breadcrumbs = [
    { name: "Dashboard", href: "/dashboard" },
    { name: currentFolder.name, href: `/folder/${folderId}` },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <nav className="text-sm mb-4">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href}>
            <Link href={crumb.href} className="hover:underline">
              {crumb.name}
            </Link>
            {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
          </span>
        ))}
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 w-full sm:w-auto text-center sm:text-left">
          {currentFolder.name}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <CreateFolderButton parentId={folderId} />
          <UploadButton folderId={folderId} />
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
            <p className="text-gray-500 text-lg">This folder is empty</p>
            <p className="text-gray-400 mt-2">
              Upload files or create new folders here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}