import Link from "next/link";
import { CalendarIcon, FileTextIcon } from "lucide-react";

type DraftCardProps = {
  draftId: string;
  title: string;
  excerpt: string;
  updatedAtLabel: string;
};

const DraftCard = ({
  draftId,
  title,
  excerpt,
  updatedAtLabel,
}: DraftCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-dashed border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
          下書き
        </span>
        <div className="flex items-center text-xs text-gray-500">
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>{updatedAtLabel}</span>
        </div>
      </div>
      <Link href={`/blogs/drafts/${draftId}/edit`}>
        <h2 className="text-xl font-semibold mb-2 text-gray-800 hover:text-amber-600 transition-colors flex items-center gap-2">
          <FileTextIcon className="w-4 h-4" />
          {title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
      <Link
        href={`/blogs/drafts/${draftId}/edit`}
        className="text-sm font-medium text-amber-700 hover:text-amber-800"
      >
        下書きを編集する
      </Link>
    </div>
  );
};

export default DraftCard;
