import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__auth')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main className="min-h-screen w-full flex bg-background text-foreground">
            {/* Visual branding sidebar */}
            <div className="hidden lg:flex w-1/2 relative bg-emerald-950 text-white flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-radial from-emerald-800/40 via-emerald-950/80 to-emerald-950 pointer-events-none" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white text-emerald-800 font-black text-xl flex items-center justify-center shadow-lg">
                        SB
                    </div>
                    <div>
                        <div className="font-bold text-lg leading-tight tracking-tight">StudyBuddy</div>
                        <div className="text-xs text-emerald-300 font-medium">Smart Exam Prep & Practice Ecosystem</div>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-xs font-semibold text-emerald-200">
                        <span>🎯</span>
                        <span>SSC · HSC · Admission · BCS</span>
                    </div>
                    <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white">
                        Master your syllabus with Bangladesh's smartest practice platform.
                    </h2>
                    <p className="text-sm text-emerald-200/80 leading-relaxed">
                        Practice 1,00,000+ curated MCQs with instant explanations, join daily national model tests, clear doubts with AI, and track your merit rank among top college students.
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-800/60">
                        <div>
                            <div className="text-2xl font-black text-white">১ লক্ষ+</div>
                            <div className="text-xs text-emerald-300/80">Question Bank</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">১৪০K+</div>
                            <div className="text-xs text-emerald-300/80">Active Learners</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-emerald-400">#১ Rank</div>
                            <div className="text-xs text-emerald-300/80">Live Merit List</div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-emerald-400/80">
                    © 2026 StudyBuddy. All rights reserved.
                </div>
            </div>

            {/* Auth forms container */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md flex flex-col items-center">
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="size-9 rounded-xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center shadow-md">
                            SB
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-foreground">
                            StudyBuddy <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">v1.0</span>
                        </span>
                    </div>
                    <Outlet />
                </div>
            </div>
        </main>
    )
}
