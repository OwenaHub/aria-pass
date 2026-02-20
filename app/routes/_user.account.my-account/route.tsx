import { Form, Link, useOutletContext } from 'react-router'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import type { Route } from '../_user.account.my-account/+types/route'
import { parseForm } from '~/lib/utils'
import useSession from '~/hooks/use-session'
import formRequest from '~/http/form.request'
import { toast } from 'sonner'
import { Textarea } from '~/components/ui/textarea'
import DefaultButton from '~/components/buttons/default-button'
import { Info } from 'lucide-react'
import ProfileStatus from '~/components/utility/profile-status'
import InputError from '~/components/utility/input-error'
import RevalidateButton from '~/components/utility/revalidate-button'

export async function clientAction({ request }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);
    const { validateSession } = useSession();

    try {
        await formRequest(credentials, 'organiser-profile', 'POST');

        await validateSession();
        return toast.info("Profile updated!", {
            description: "We will review your account again within 24 hours"
        });
    } catch ({ response }: any) {
        toast.error('Failed to update', {
            description: response?.data?.message || 'Review your input and try again'
        });
        return response?.data?.errors;
    }
}

export default function MyAccount({ actionData }: Route.ComponentProps) {
    const errors = actionData;
    const user: User = useOutletContext();

    return (
        <div>
            <section>
                <div className='max-w-xl grid grid-cols-1 md:grid-cols-2 gap-5 mb-7'>
                    <div>
                        <Input
                            className='py-6 rounded-xl shadow-none'
                            defaultValue={user.name}
                            name='name'
                            disabled
                        />
                    </div>
                    <div>
                        <Input
                            className='py-6 rounded-xl shadow-none'
                            defaultValue={user.email}
                            name='email'
                            disabled
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 mb-10">
                    <Switch id="airplane-mode" checked disabled />
                    <Label htmlFor="airplane-mode text-xs">Enable promotional emails</Label>
                </div>
            </section>

            {user?.organiserProfile?.id && (
                <Form method='POST'>
                    <div className='mb-5 mt-16 flex items-center gap-3'>
                        <h2 className='tracking-tighter font-medium text-lg'>Organiser profile</h2>
                        <ProfileStatus status={user?.organiserProfile?.status!} />
                        <RevalidateButton />
                    </div>

                    <div className='bg-gray-50  p-5 rounded-xl flex flex-col gap-4'>
                        <div className='flex flex-col md:flex-row md:items-center gap-3 mb-5'>
                            <div className='flex-1'>
                                <Label className='mb-1 text-sm tracking-tight'>Business name</Label>
                                <Input
                                    className='py-6 rounded-xl shadow-none text-sm'
                                    placeholder='ACME Choral'
                                    name='organiser_name'
                                    maxLength={40}
                                    minLength={5}
                                    defaultValue={user?.organiserProfile?.organiserName || ''}
                                    required

                                    onInput={(e) => {
                                        const input = e.target as HTMLInputElement;
                                        const remaining = 40 - input.value.length;
                                        const counter = document.getElementById("company-name-counter");
                                        if (counter) counter.textContent = `${remaining} characters left`;
                                    }}
                                />
                                <div id="company-name-counter" className="ms-2 text-xs text-gray-500 mt-1">
                                    40 characters left
                                </div>
                                <InputError for="organiser_name" error={errors} />
                            </div>
                            <div className='flex-1'>
                                <Label className='mb-1 text-sm tracking-tight' htmlFor='phone'>Phone</Label>
                                <Input
                                    id='phone'
                                    className='py-6 rounded-xl shadow-none'
                                    placeholder='0800 000 0000'
                                    name='contact_phone'
                                    defaultValue={user?.organiserProfile?.contactPhone || ''}
                                    type='tel'
                                    maxLength={11}
                                    minLength={10}
                                    required

                                    onInput={(e) => {
                                        const input = e.target as HTMLInputElement;
                                        const remaining = 11 - input.value.length;
                                        const counter = document.getElementById("phone-counter");
                                        if (counter) counter.textContent = `${remaining} characters left`;
                                    }}
                                />
                                <div id="phone-counter" className="ms-2 text-xs text-gray-500 mt-1">
                                    11 characters left
                                </div>
                                <InputError for="contact_phone" error={errors} />
                            </div>
                        </div>

                        <div className='flex flex-col md:flex-row md:items-center gap-3 mb-5'>
                            <div className='flex-1'>
                                <Label className='mb-1 text-sm tracking-tight' htmlFor='website'>Website</Label>
                                <Input
                                    className='py-6 rounded-xl shadow-none'
                                    placeholder='https://acme.org'
                                    name='website_url'
                                    minLength={15}
                                    defaultValue={user?.organiserProfile?.websiteUrl || ''}
                                    id='website'
                                    type='url'
                                />
                                <InputError for="website_url" error={errors} />
                            </div>
                            <div className='flex-1'>
                                <Label className='mb-1 text-sm tracking-tight' htmlFor='email'>Email</Label>
                                <Input
                                    className='py-6 rounded-xl shadow-none'
                                    placeholder='acme@choral.com'
                                    name='contact_email'
                                    minLength={15}
                                    defaultValue={user?.organiserProfile?.contactEmail || ''}
                                    id='email'
                                    type='email'
                                />
                                <InputError for="contact_email" error={errors} />
                            </div>
                        </div>

                        <div>
                            <Label className='mb-1 text-sm tracking-tight'>Business name</Label>
                            <Textarea
                                rows={5}
                                cols={20}
                                className='rounded-lg shadow-none text-sm'
                                placeholder='Amazing biography on ACME chorale...'
                                name='biography'
                                defaultValue={user.organiserProfile?.bio || ''}
                                maxLength={300}
                                minLength={10}
                                required

                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    const remaining = 300 - input.value.length;
                                    const counter = document.getElementById("bio-text-counter");
                                    if (counter) counter.textContent = `${remaining} characters left`;
                                }}
                            />
                            <div id="bio-text-counter" className="text-xs text-gray-500 mt-1">
                                300 characters left
                            </div>
                            <InputError for="biography" error={errors} />
                        </div>
                    </div>

                    <p className="py-5 text-sm flex tracking-tighter items-center gap-1">
                        <Info className='size-4' />
                        <span>
                            See your payout bank details <Link className='text-blue-500' to={'/account/payouts'}>here</Link>
                        </span>
                    </p>

                    <div className='max-w-sm mt-8 text-sm'>
                        <DefaultButton text='Update profile' />
                    </div>
                </Form>
            )}
        </div>
    )
}
