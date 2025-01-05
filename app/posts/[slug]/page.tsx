import { CalendarDays, TagIcon } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import { getPostBySlug, listPostFilenames } from "@/lib/posts"

import "@/app/styles/post.css"
import { ResolvingMetadata, Metadata } from 'next'
import Link from 'next/link'

// SSG
export async function generateStaticParams() {
    const files = await listPostFilenames()
    const slugs = files.map((file) => file.replace(/\.md$/, ''))

    return slugs.map((slug) => ({
        slug: slug,
    }))
}
type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
    _md: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = (await params).slug

    // fetch data
    const post = await getPostBySlug(id)

    return {
        title: `${post.title} | Simple is Best`,
        authors: {
            name: 'OldBigBuddha',
            url: 'https://oldbigbuddha.dev',
        },
        description: post.raw.slice(0, 200),
        openGraph: {
            type: 'article',
            url: `https://oldbigbuddha.dev/posts/${post.slug}`,
            title: `${post.title} | Simple is Best`,
            siteName: 'Simple is Best',
            description: post.raw.slice(0, 200),
        },
        twitter: {
            creator: '@OldBigBuddha',
            site: '@OldBigBuddha',
            card: 'summary_large_image',
            title: `${post.title} | Simple is Best`,
            description: post.raw.slice(0, 200),
        },
    }
}

export default async function Page({ params }: Props) {
    const slug = (await params).slug
    const post = await getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <>
            <div className="min-h-screen bg-[#FCFBF7] px-4 py-12 dark:bg-slate-950">
                <main className="mx-auto max-w-2xl">
                    <nav className='mb-2'>
                        <Link href='/' className='text-gray-600 hover:text-gray-800 hover:underline'>
                            ← ホームへ戻る
                        </Link>
                    </nav>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/github-dark.min.css"></link>
                    <article aria-labelledby="article-title">
                        <div className="rounded-lg bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-colors dark:bg-slate-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                            {/* Metadata */}
                            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-3">
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
                                <div className="flex items-center gap-3">
                                    {/* <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{post.readingTime} min read</span> */}
                                </div>
                            </div>

                            {/* Title */}
                            <h1
                                id="article-title"
                                className="font-serif text-4xl font-medium tracking-tight text-slate-900 dark:text-slate-50"
                            >
                                {post.title}
                            </h1>

                            {/* Author */}
                            <div className="mt-4 text-sm text-muted-foreground">
                                By <span className="hover:text-foreground">OldBigBuddha</span>
                            </div>

                            <Separator className="my-8" />

                            {/* Content */}
                            <div
                                className="prose prose-stone mx-auto max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-medium prose-p:text-base prose-p:leading-7 prose-blockquote:border-l-primary"
                                dangerouslySetInnerHTML={{ __html: post.html }}
                            />

                            <Separator className="my-8" />

                            {/* Tags */}
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
                            </div>
                        </div>
                    </article>

                </main>
            </div>
        </>
    )
}

