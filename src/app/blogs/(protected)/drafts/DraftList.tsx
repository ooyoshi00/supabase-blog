import Sidebar from "../../../_component/SideBar";
import DraftCard from "./DraftCard";
import { buildDraftPreview } from "@/lib/drafts/service";
import type { Draft } from "@/lib/drafts/types";

const formatDraftDate = (value: string) =>
  new Date(value).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const DraftList = ({ drafts }: { drafts: Draft[] }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-3/4">
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
          <h1 className="text-3xl font-bold text-amber-800 mb-2">
            下書き一覧
          </h1>
          <p className="text-sm text-amber-900">
            まだ公開していない下書きをまとめて管理できます。
          </p>
        </div>
        {drafts.length === 0 ? (
          <div className="text-sm text-gray-600 bg-white rounded-lg p-6 shadow-sm">
            下書きはまだありません。/blogs/new から作成してください。
          </div>
        ) : (
          <div className="space-y-8">
            {drafts.map((draft) => {
              const preview = buildDraftPreview(draft.content);
              return (
                <DraftCard
                  key={draft.draftId}
                  draftId={draft.draftId}
                  title={preview.title}
                  excerpt={preview.excerpt}
                  updatedAtLabel={formatDraftDate(draft.updatedAt)}
                />
              );
            })}
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
};

export default DraftList;
