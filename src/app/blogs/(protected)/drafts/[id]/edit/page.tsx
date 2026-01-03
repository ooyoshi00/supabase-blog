import Tiptap from "@/app/blogs/(protected)/new/Editor";

type DraftEditPageProps = {
  params: {
    id: string;
  };
};

export default async function DraftEditPage({ params }: DraftEditPageProps) {
  return <Tiptap draftId={params.id} />;
}
