export type Post = {
  readonly slug: string;
  readonly title: string;
  readonly raw: string;
  readonly html: string;
  readonly date: Date;
  readonly category: string | undefined;
  readonly tags: string[];
};
