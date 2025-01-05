type Slug = string & { readonly __type: unique symbol };
export function asSlug(s: string): Slug {
    return s as Slug;
}

export type Post = {
  readonly slug: Slug;
  readonly title: string;
  readonly raw: string;
  readonly html: string;
  readonly date: Date;
  readonly category: string | undefined;
  readonly tags: string[];
};
