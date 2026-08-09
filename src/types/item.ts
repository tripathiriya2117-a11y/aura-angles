export type ItemType = "text" | "link";

export interface ItemData {
  id: string;
  collectionId: string;
  type: ItemType;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}