import { CheckCheck, Eye, EyeClosed } from "lucide-react";
import { Form, Link, redirect, type MetaFunction } from "react-router";
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

    return (
        <section className="container">
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }} className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-300 to-indigo-700 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>
            </div>

            <div className="justify-center gap-18 items-start max-w-fit flex mx-auto">
                <div className="flex-1 hidden md:block z-10 mt-8">
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
                </div>

                <div className="flex-1 !z-10">
                    <div className="h-full rounded-xl py-6">
                        <div className="text-center block md:hidden pb-8 z-10">
                            <p className="text-2xl text-primary font-medium tracking-tighter">
                                Create an account
                            </p>
                            <p className="text-muted-foreground text-sm">to access your free acount</p>
                        </div>

                        <GoogleAuthButton text="Register" />

                        <HrWithText text="Or use password" />

                        <Form method="POST" className="mt-5">
                            <div className="mb-5">
                                <Input
                                    className="bg-white/10 backdrop-blur-3xl py-6 rounded-xl text-sm placeholder:text-sm  border border-gray-200"
                                    type="text"
                                    name="name"
                                    placeholder="Full name"
                                    required
                                />
                                <InputError for="name" error={errors} />
                            </div>
                            <div className="mb-5">
                                <Input
                                    className="bg-white/10 backdrop-blur-3xl py-6 rounded-xl text-sm placeholder:text-sm  border border-gray-200"
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    required
                                />
                                <InputError for="email" error={errors} />
                            </div>
                            <div className="mb-5">
                                <div className="relative">
                                    <Input
                                        className="bg-white/10 backdrop-blur-3xl py-6 rounded-xl text-sm placeholder:text-sm  border border-gray-200 pr-12"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
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
                            <div className="mb-5">
                                <div className="relative">
                                    <Input
                                        className="bg-white/10 backdrop-blur-3xl py-6 rounded-xl text-sm placeholder:text-sm  border border-gray-200"
                                        id="password_confirmation"
                                        type={showPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-7">
                                <DefaultButton text="Register" />
                            </div>
                        </Form>

                        <p className="p-4 font-light text-center text-pretty text-xs">
                            By continuing, you agree to our {" "}
                            <Link to="/terms-of-service">Terms</Link>
                            {" "}and{" "}
                            <Link to="/privacy-policy">Privacy Policy</Link>.
                        </p>
                    </div>
                    <div className="text-foreground text-sm flex items-center gap-1 justify-center">
                        <span>Have an account?</span>{" "}
                        <Link to="/login" className="text-primary-theme underline underline-offset-2" viewTransition>Login</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
