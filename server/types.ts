export type NewBlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  author: string | null;
  readingMinutes: number;
  sourceDate: string;
  status: "draft" | "published";
  reviewNotes: string;
};
