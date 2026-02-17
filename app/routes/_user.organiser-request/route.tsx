import { Button } from "~/components/ui/button";
import OpeningPage from "./opening-page";
import CompanyName from "./company-name";
import { ArrowLeft } from "lucide-react";
import { Form, Link, redirect, useNavigation, useSearchParams, type MetaFunction } from "react-router";
import CompanyBio from "./company-bio";
import CompanyContact from "./company-contact";
import { parseForm } from "~/lib/utils";
import formRequest from "~/http/form.request";
import { toast } from "sonner";
import type { Route } from "../_user.organiser-request/+types/route";
import { defaultMeta } from "~/lib/meta";
import client from "~/http/client";
import InputError from "~/components/utility/input-error";
import useSession from "~/hooks/use-session";

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Become an Organiser | AriaPass" },
    ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
    const { data } = await client.get('api/organiser-profile');

    const url = new URL(request.url);
    const step = url.searchParams.get("step") || "1";
    return { step, profile: data };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);
    const { validateSession } = useSession();

    const url = new URL(request.url);
    const step = url.searchParams.get("step") || "1";
    const newSearchParams = new URLSearchParams(url.searchParams);

    if (Object.keys(credentials).length === 0) {
        newSearchParams.set('step', (parseInt(step) + 1).toString());
        return redirect(`${url.pathname}?${newSearchParams.toString()}`);
    }

    try {
        await formRequest(credentials, 'organiser-profile', 'POST');

        if (step !== "4") {
            toast("Profile saved", {
                description: "We have updated your profile"
            });

            newSearchParams.set('step', (parseInt(step) + 1).toString());
            return redirect(`${url.pathname}?${newSearchParams.toString()}`);
        }

        toast.info("Request Sent!", {
            description: "We will give you a response in 2 business days"
        });

        await validateSession();
        return redirect('/dashboard')
    } catch ({ response }: any) {
        toast.error('Oops, something went wrong');
        return response?.data?.errors;
    }
}

export default function OrganiserRequest({ loaderData, actionData }: Route.ComponentProps) {
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();

    const { step, profile } = loaderData;
    const errors = actionData;

    const isSubmitting = navigation.state === "submitting";

    return (
        <Form className="py-16" method="post">
            <div className="flex gap-20 items-stretch justify-between">
                <div className="lg:basis-7/10">
                    {step > "1" && (
                        <div className="flex items-stretch justify-between mb-8">
                            <Button
                                size={"sm"}
                                variant={"outline"}
                                type="button"
                                onClick={() => {
                                    const currentStep = parseInt(step);
                                    const newSearchParams = new URLSearchParams(searchParams);
                                    newSearchParams.set('step', (currentStep - 1).toString());
                                    // Optionally, remove fields from the current step
                                    // newSearchParams.delete('company_name'); 
                                    window.location.search = newSearchParams.toString();
                                }}
                                className="rounded-full shadow-none px-6 cursor-pointer"
                            >
                                <ArrowLeft size={14} />
                                <span className="font-light text-sm">Back</span>
                            </Button>
                        </div>
                    )}

                    {/* Render forms based on the URL step */}
                    <div className="max-w-3xl">
                        {step === "1" && <OpeningPage />}
                        {step === "2" && <CompanyName profile={profile} />}
                        {step === "3" && <CompanyBio profile={profile} />}
                        {step === "4" && <CompanyContact profile={profile} />}
                    </div>
                </div>
                <div className="hidden flex-1 lg:flex flex-col gap-4 text-sm">
                    <Link to={"?step=1"} className={`${step === "1" ? 'font-semibold bg-gray-100 rounded-lg' : ''} px-4 py-2`}>
                        Getting started
                    </Link>
                    <Link to={"?step=2"} className={`${step === "2" ? 'font-semibold bg-gray-100 rounded-lg' : ''} px-4 py-2`}>
                        1. Company name
                    </Link>
                    <Link to={"?step=3"} className={`${step === "3" ? 'font-semibold bg-gray-100 rounded-lg' : ''} px-4 py-2`}>
                        2. Company Biography
                    </Link>
                    <Link to={"?step=4"} className={`${step === "4" ? 'font-semibold bg-gray-100 rounded-lg' : ''} px-4 py-2`}>
                        3. Company Information
                    </Link>
                </div>
            </div>

            <div className="mt-5">
                <InputError for="organiser_name" error={errors} />
                <InputError for="bio" error={errors} />
                <InputError for="currency" error={errors} />
                <InputError for="contact_phone" error={errors} />
                <InputError for="contact_email" error={errors} />
                <InputError for="city" error={errors} />
                <InputError for="country" error={errors} />
            </div>

            <div className="mt-10">
                {step === "4"
                    ? (
                        <Button
                            className="mt-5 rounded-full min-w-max py-5 px-10 font-light bg-primary cursor-pointer"
                            disabled={isSubmitting}
                        >
                            <span>Submit Request</span>
                        </Button>
                    )
                    : (
                        <Button
                            className="mt-5 rounded-full py-5 px-18 font-light cursor-pointer"
                            variant={"secondary"}
                            disabled={isSubmitting}
                        >
                            Continue
                        </Button>
                    )
                }
            </div>
        </Form>
    );
}
