import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import AvatarGroup from '~/components/custom/avatar-group'
import CustomAvatar from '~/components/custom/custom-avatar'
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { extractNames } from '~/lib/utils'

export default function SpaceUsers({ space }: { space: OrganiserEvent }) {
    return (
        <div className="flex items-center justify-between">
            <Dialog>
                <div>
                    <DialogTrigger asChild>
                        <span className="font-medium tracking-tighter cursor-pointer underline underline-offset-2">
                            {space.members?.length} <span className="text-lg"> member{space?.members.length > 1 && 's'}</span>
                            <ArrowRight size={13} className="inline-block ms-2" />
                        </span>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-106.25">
                        <DialogHeader className="mb-2">
                            <DialogTitle>Event members</DialogTitle>
                            <DialogDescription>
                                Manage your event staff <Link to={'/account/event-staff'} className="text-blue-500 underline">here</Link>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            {space.members.map((mem) => (
                                <div className="flex gap-1 items-center">
                                    <CustomAvatar name={mem.name} styles="w-10 h-10" />
                                    <div className="flex flex-col gap-1">
                                        <span>{mem.name}</span>
                                        <span className="text-xs text-gray-400 font-light -mt-1">{mem.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </div>
            </Dialog>
            <AvatarGroup names={extractNames(space.members)} max={3} />
        </div>
    )
}
