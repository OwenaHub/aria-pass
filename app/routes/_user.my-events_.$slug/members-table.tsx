import { Pen, Trash } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

export default function MembersTable({ members }: { members: EventMember[] }) {

    return (
        <Table className="border">
            <TableCaption>A list of added members.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-37.5">Email</TableHead>
                    <TableHead className="w-25">Status</TableHead>
                    <TableHead>Member's Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Invite Token</TableHead>
                    <TableHead className="w-50"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member) => (
                    <TableRow key={member.id} className="h-14">
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                            <div className="rounded bg-gray-100 text-primary uppercase text-xs px-2 py-1 w-fit">
                                {member.status}
                            </div>
                        </TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell className="capitalize">{member.role}</TableCell>
                        <TableCell>{member.inviteToken}</TableCell>
                        <TableCell>
                            <div className="flex flex-1 justify-end gap-3 items-center">
                                <Form method="POST">
                                    <input type="hidden" name="memberId" value={member.id} />
                                    <input type="hidden" name="type" value='member.delete'/>
                                    <Button
                                        type="submit"
                                        variant={"outline"}
                                        size={"icon-sm"}
                                        className="bg-red-100 text-destructive border-none rounded-full cursor-pointer">
                                        <Trash />
                                    </Button>
                                </Form>
                                <Button
                                    variant={"outline"}
                                    size={"icon-sm"}
                                    className="bg-gray-100 text-primary border-none rounded-full cursor-pointer">
                                    <Pen />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={5}>Total Entries</TableCell>
                    <TableCell className="text-right">
                        {members.length} member(s)
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
