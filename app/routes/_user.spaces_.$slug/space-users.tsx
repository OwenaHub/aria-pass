import { Info } from 'lucide-react'
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
                        </span>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-106.25">
                        <DialogHeader className="mb-2">
                            <DialogTitle className='text-start'>Event members</DialogTitle>
                            <DialogDescription className='text-xs flex items-center gap-1'>
                                <Info size={16}/>
                                <span>
                                    Members are added by event curator
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            {space.members.map((mem) => (
                                <div className="flex gap-1 items-center tracking-tighter">
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
