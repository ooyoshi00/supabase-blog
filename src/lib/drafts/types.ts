export type ImageRef = {
  assetId: string;
  storageRef: string;
  order: number;
};

export type DraftInput = {
  content: Record<string, unknown>;
  imageRefs: ImageRef[];
};

export type Draft = DraftInput & {
  draftId: string;
  userId: string;
  updatedAt: string;
};

export type MediaAsset = {
  assetId: string;
  userId: string;
  draftId: string;
  storageRef: string;
  order: number;
  updatedAt: string;
};
