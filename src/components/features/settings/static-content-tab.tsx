import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SlidersHorizontal, Loader2, X } from 'lucide-react'
import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const JoditEditor = lazy(() => import('jodit-react'))

interface StaticContentTabProps {
    slug: 'privacy-policy' | 'terms-and-conditions'
    title: string
    description: string
    data?: { slug: string; title: string; content: string } | null
    isLoading: boolean
    error: Error | null
    onUpdate: (content: string) => void
    isUpdating: boolean
}

export function StaticContentTab({ title, description, data, isLoading, error, onUpdate, isUpdating }: StaticContentTabProps) {
    const [content, setContent] = useState<string>('')
    const [isInitialized, setIsInitialized] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    useEffect(() => {
        if (!isLoading && data) {
            setContent(data.content ?? '')
            setIsInitialized(true)
        }
    }, [data, isLoading])

    const handleCancel = () => {
        if (data) {
            setContent(data.content ?? '')
        }
        setIsEditing(false)
    }

    const config = useMemo(
        () => ({
            height: 512,
            readonly: !isEditing,
            buttons: [
                'bold',
                'italic',
                'underline',
                'strike',
                'subscript',
                'superscript',
                '|',
                'font',
                'fontsize',
                'paragraph',
                '|',
                'align',
                'ul',
                'ol',
                'outdent',
                'indent',
                '|',
                'table',
                'hr',
                'link',
                '|',
                'undo',
                'redo',
            ],
            placeholder: 'Start typing...',
        }),
        [isEditing],
    )

    if (isLoading || !isInitialized) {
        return (
            <Skeleton loading={true} className="w-full">
                <div className="flex-1 flex flex-col gap-6 w-full mt-4">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <div className="h-64 rounded-md border border-border p-4 space-y-3">
                        <p className="font-semibold text-lg">{title} document editor</p>
                        <p className="text-sm">Loading document contents and editor layout...</p>
                        <p className="text-sm">Please wait while the rich text formatting toolbar initializes.</p>
                    </div>
                </div>
            </Skeleton>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-destructive font-medium">Error loading {title}</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col gap-6 w-full mt-4">
            <div>
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>
            <Separator />
            <div className="rounded-xl overflow-hidden border shadow-sm">
                <Suspense fallback={<div className="h-[512px] bg-muted animate-pulse" />}>
                    <JoditEditor config={config} value={content} onBlur={(newContent) => setContent(newContent)} />
                </Suspense>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <p className="text-sm font-medium text-foreground">Last updated: August 4, 2026 by Debra Villar.</p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    {!isEditing ? (
                        <>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="flex-1 rounded-full text-base h-12 bg-muted/50 hover:bg-muted shadow-none border"
                                onClick={() => setIsPreviewOpen(true)}
                            >
                                Preview
                            </Button>
                            <Button
                                size="lg"
                                variant="default"
                                className="flex-1 rounded-full text-base h-12"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="lg"
                                variant="outline"
                                className="flex-1 rounded-full text-base h-12"
                                onClick={handleCancel}
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="lg"
                                variant="default"
                                disabled={isUpdating}
                                onClick={() => {
                                    onUpdate(content)
                                    setIsEditing(false)
                                }}
                                className="flex-1 rounded-full text-base h-12"
                            >
                                {isUpdating && <Loader2 className="mr-2 size-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent
                    showCloseButton={false}
                    className="sm:max-w-5xl w-[92vw] h-[85vh] overflow-hidden flex flex-col p-0 rounded-3xl border-none shadow-2xl bg-surface text-surface-foreground outline-none"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/20 text-primary p-2 rounded-xl">
                                <SlidersHorizontal className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">{title} Preview</DialogTitle>
                                <p className="text-xs text-muted-foreground">Draft Version (Live View)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-success/20 text-success hover:bg-success/20 border-none font-semibold px-3 py-1 rounded-full text-xs">
                                Ready to Publish
                            </Badge>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full bg-muted hover:bg-muted text-foreground"
                                onClick={() => setIsPreviewOpen(false)}
                                aria-label="Close preview"
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-surface p-6 md:p-10 overflow-y-auto flex justify-center">
                        <div className="w-full max-w-4xl bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-8 md:p-16 min-h-[60vh] h-fit relative">
                            <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-8" />
                            <div className="prose prose-slate lg:prose-base max-w-none leading-relaxed text-foreground">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            content || '<p className="text-muted-foreground italic text-center">No content available.</p>',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
