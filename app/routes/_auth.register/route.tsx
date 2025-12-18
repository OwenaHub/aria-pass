import { CheckCheck, ChevronLeft, Eye, EyeClosed } from "lucide-react";
import { Form, Link, redirect, useSearchParams, type MetaFunction } from "react-router";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import GoogleAuthButton from "~/components/buttons/google-auth-button";
import HrWithText from "~/components/utility/hr-with-text";
import InputError from "~/components/utility/input-error";
import authRequest from "~/http/auth.request";
import { parseForm } from "~/lib/utils";
import DefaultButton from "~/components/buttons/default-button";
import type { Route } from "../_auth.register/+types/route";
import { defaultMeta } from '~/lib/meta';
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { BrMd, BrSm } from "~/components/utility/line-break";

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Register | AriaPass" },
    ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);
    try {
        await authRequest(credentials, 'register');
        toast("Congratulations! ✨", {
            description: "Your account has been registered"
        });
        return redirect('/dashboard?entry=new');
    } catch ({ response }: any) {
        const error: any = response?.data?.errors;
        return error;
    }
}

export default function Register({ actionData }: Route.ComponentProps) {
    let errors = actionData;
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <section className="flex items-stretch h-screen p-3 animated fadeIn">

            {/* <div className="flex-1 hidden md:block z-10 mt-8">
                    <h1 className="text-2xl text-primary font-bold tracking-tighter my-5 pb-5">
                        Sign up for free, <br className="hidden md:block" />
                        Join the <span className="text-primary-theme px-1.5 rounded-md bg-primary-bg border border-primary-theme">communtiy!</span>
                    </h1>
                    <div className="flex flex-col gap-7">
                        <div className="flex gap-3 items-center">
                            <div className="bg-transparent">
                                <CheckCheck size="25" strokeWidth={"2"} className="text-primary-theme" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Unlimited access to events
                            </p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="bg-transparent">
                                <CheckCheck size="25" strokeWidth={"2"} className="text-primary-theme" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Instant purchases and bookings
                            </p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="bg-transparent">
                                <CheckCheck size="25" strokeWidth={"2"} className="text-primary-theme" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Expert support 24/7
                            </p>
                        </div>
                    </div>
                </div> */}

            <div className="basis-3/8 hidden md:block bg-gray-100 rounded-tr-4xl rounded-bl-4xl border">

            </div>

            <div className="container md:px-24 lg:px-28 flex-1 justify-center gap-10 items-center md:flex mx-auto overflow-y-auto">
                {/* Clip path */}
                <div className="md:absolute isolate px-6 pt-14 lg:px-8">
                    <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }} className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-300 to-indigo-700 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        />
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 z-10 md:px-8">
                    <header className="flex items-center justify-between mb-10 pt-10 md:pt-16">
                        <Link to={'/'}>
                            <img width="60" className="inline-block" src="/images/logos/app_logo.png" title="OwenaHub" />
                        </Link>
                        <Link to={'/login'} className="text-primary font-medium hover:bg-gray-200 transition text-sm tracking-tighter px-4 py-3 rounded-full bg-accent">
                            Already a member? Log in
                        </Link>
                    </header>
                    <div className="pb-8 flex flex-col gap-6">
                        <p className="text-2xl md:text-5xl text-primary font-bold tracking-tighter">
                            Get started
                        </p>
                        <p className="tracking-tight text-gray-500 text-sm md:text-base">
                            Welcome to <span className="text-primary-theme font-bold">AriaPass</span>! Let's get started by <BrSm /> creating your account.
                        </p>
                    </div>

                    {searchParams.get('auth_method') === 'password'
                        ? (
                            <Form method="POST" className="mt-5 flex flex-col gap-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label className="tracking-tight" htmlFor="name">Full name</Label>
                                        <Input
                                            className="bg-white/10 backdrop-blur-3xl py-6 rounded-lg shadow-none text-sm placeholder:text-sm  border border-gray-200"
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="First Last"
                                            required
                                        />
                                        <InputError for="name" error={errors} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="tracking-tight" htmlFor="email">Email</Label>
                                        <Input
                                            className="bg-white/10 backdrop-blur-3xl py-6 rounded-lg shadow-none text-sm placeholder:text-sm  border border-gray-200"
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="email@provider.com"
                                            required
                                        />
                                        <InputError for="email" error={errors} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="tracking-tight" htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            className="bg-white/10 backdrop-blur-3xl py-6 rounded-lg shadow-none text-sm placeholder:text-sm  border border-gray-200 pr-12"
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="******"
                                            required
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword
                                                ? <Eye className="text-pretty h-5 w-5" />
                                                : <EyeClosed className="text-pretty h-5 w-5" />
                                            }
                                        </button>
                                    </div>
                                    <InputError for="password" error={errors} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="tracking-tight" htmlFor="password_confirmation">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            className="bg-white/10 backdrop-blur-3xl py-6 rounded-lg shadow-none text-sm placeholder:text-sm  border border-gray-200"
                                            id="password_confirmation"
                                            type={showPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            placeholder="******"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center gap-5">
                                    <Button
                                        className="basis-2/8 px-8 py-6 rounded-full shadow-none flex items-center gap-1 cursor-pointer"
                                        variant={'secondary'}
                                        onClick={() => setSearchParams("auth_method=0auth")}
                                    >
                                        <ChevronLeft />
                                        <span className="text-sm">Back</span>
                                    </Button>
                                    <div className="flex-1">
                                        <DefaultButton text="Create account" />
                                    </div>
                                </div>
                            </Form>
                        ) : (
                            <>
                                <GoogleAuthButton text="Register" />

                                <HrWithText text="Or" />

                                <Button
                                    onClick={() => setSearchParams('auth_method=password')}
                                    type="button"
                                    className="w-full py-6 mt-3 rounded-full tracking-tighter text-sm cursor-pointer"
                                >
                                    Register with password
                                </Button>
                            </>
                        )
                    }

                    <p className="p-6 font-light text-center text-pretty text-xs">
                        By continuing, you agree to our {" "}
                        <Link to="/terms-of-service">Terms</Link>
                        {" "}and{" "}
                        <Link to="/privacy-policy">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </section>
    )
}
