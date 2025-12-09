import { Form, Link, redirect, type MetaFunction } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import InputError from "~/components/utility/input-error";
import useRoute from "~/hooks/use-route";
import authRequest from "~/http/auth.request";
import { parseForm } from "~/lib/utils";
import DefaultButton from "~/components/buttons/default-button";
import GoogleAuthButton from "~/components/buttons/google-auth-button";
import type { Route } from "../_auth.login/+types/route";
import { defaultMeta } from '~/lib/meta';
import HrWithText from "~/components/utility/hr-with-text";

export const meta: MetaFunction = (args) => {
  return [
    ...defaultMeta(args) || [],
    { title: "Login | AriaPass" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const credentials = await parseForm(request);

  const url = new URL(request.url);
  
  const { getIntentedRoute } = useRoute();
  let route = url.searchParams.get('redirect') || (await getIntentedRoute());

  try {
    await authRequest(credentials, 'login');
    toast("Welcome back!", {
      description: "AriaPass is ready for you! 🚀",
    });
    return redirect(route);
  } catch ({ response }: any) {
    const error: any = response?.data?.errors;
    return error;
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const errors = actionData;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="container animated fadeIn">
      <div className="relative isolate px-6 pt-5 lg:px-8 -z-10">
        <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }} className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-300 to-indigo-700 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      <div className="justify-center gap-10 items-center max-w-sm md:flex mx-auto py-10">
        <div className="flex-1">
          <div className="z-10 h-full rounded-xl md:px-8 px-5">
            <div className="text-center pb-8">
              <p className="text-2xl text-primary font-medium tracking-tighter">
                Login to your account
              </p>
            </div>

            <GoogleAuthButton text="Log in" />

            <HrWithText text="Or use password" />

            <Form method="POST">
              <div className="mb-5">
                <Label className="text-xs pb-1">Email address</Label>
                <Input
                  className="bg-white/10 backdrop-blur-3xl py-6 rounded-xl text-sm placeholder:text-sm border border-gray-200"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="mozart@email.com"
                  required
                />
                <InputError for="email" error={errors} />
              </div>
              <div className="mb-5">
                <div className="flex justify-between items-center pb-1">
                  <Label className="text-xs">Password</Label>
                  <Link to="/forgot-password" className="!text-primary text-xs underline underline-offset-2">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    className="bg-white/10 backdrop-blur-3xl py-6 rounded-xl text-sm placeholder:text-sm border border-gray-200 pr-12"
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
              <div className="mt-7">
                <DefaultButton text="Log in" />
              </div>
            </Form>

            <div className="flex flex-col gap-3">
              <p className="p-5 text-center text-pretty text-xs font-light">
                By continuing, you agree to our {" "}
                <Link to="/terms-of-service">Terms</Link>
                {" "}and{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </p>
            </div>
          </div>
          <div className="text-foreground text-sm py-5 flex items-center gap-1 justify-center">
            <span>Need an account? </span>
            <Link to="/register" className="text-primary-theme underline underline-offset-2" viewTransition>Register</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
