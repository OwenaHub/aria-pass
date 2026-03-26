import { ChevronRight } from 'lucide-react'
import { Link, type MetaFunction } from 'react-router'
import EmptyState from '~/components/skeletons/empty-state'
import { Button } from '~/components/ui/button'
import { defaultMeta } from '~/lib/meta'

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Artists | AriaPass" },
    ];
}

export default function Artists() {
    return (
        <main className='animated fadeIn'>
            <div className='container py-10 flex flex-col gap-2'>
                <h1 className='text-2xl font-semibold tracking-tighter'>Artists</h1>
                <p className='text-sm text-gray-500 font-light'>Showing all verified profiles & partners</p>
            </div>

            <div className="hidden container lg:flex items-center justify-between mb-8">
                <div className="flex gap-4 items-center">
                    {["Choral", "Ensemble", "Church Music", "Recitals", "Classical Band", "Chamber"].map((item) => (
                        <Link to={""} key={item} className="rounded-full py-2 px-4 hover:bg-stone-100 text-sm font-semibold tracking-tight">{item}</Link>
                    ))}
                </div>
                <Button variant={"secondary"} disabled className="rounded-full flex justify-between gap-2 px-5">
                    <span>Join as Artist</span>
                    <ChevronRight />
                </Button>
            </div>

            <div className="lg:hidden mb-4">
                <div className="container flex justify-between items-center">
                    <Button variant={"secondary"} disabled className="rounded-full flex justify-between gap-2 px-5">
                        <span>Join as Artist</span>
                        <ChevronRight />
                    </Button>

                </div>

                <hr className="mt-5 mb-2" />

                <div className="container flex gap-4 items-center overflow-x-auto">
                    {["Choral", "Ensemble", "Church Music", "Recitals", "Classical Band", "Chamber"].map((item) => (
                        <Link to={`?`} key={item} className="text-nowrap rounded-full py-2 px-4 hover:bg-stone-100 text-sm tracking-tight">{item}</Link>
                    ))}
                </div>
            </div>

            <div>
                <EmptyState resource="artists" />
            </div>
        </main>
    )
}
