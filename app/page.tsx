import Link from "next/link"
import { CalendarDays, TagIcon, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { getAllPosts } from "@/lib/posts"

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-[#FCFBF7] px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-900 dark:text-slate-50">
            Simple is Best
          </h1>
          <p className="mt-4 text-muted-foreground">
            written by <span className="font-bold">OldBigBuddha</span>
          </p>
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="transition-colors hover:bg-accent/50"
            >
              <Link href={`/posts/${post.slug}`} className="block">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl font-medium">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4" aria-hidden="true" />
                        {/* The format of sv-SE(Sweden) is YYYY-MM-DD */}
                        <time dateTime={post.date.toLocaleDateString('sv-SE', {
                          timeZone: 'Asia/Tokyo'
                        })}>
                          {new Date(post.date).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.tags.length > 0 && (
                          <>
                            <TagIcon className="size-4 text-center" aria-hidden="true" />
                            <div className="flex items-center justify-center gap-2">
                              {post.tags.map((tag) => (
                                <span key={tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                        {/* <span>{post.readingTime} min read</span> */}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      {post.raw.slice(0, 200)}...
                    </div>
                    <ChevronRight
                      className="h-5 w-5 flex-shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

