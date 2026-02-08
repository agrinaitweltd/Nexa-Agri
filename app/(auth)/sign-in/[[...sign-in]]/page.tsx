import { SignIn } from "@clerk/nextjs";
import { NexaLogo } from "../../../../components/NexaLogo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6">
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <NexaLogo className="h-12" light />
      </div>
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-sm font-black uppercase tracking-widest transition-all',
              card: 'bg-white rounded-[2.5rem] shadow-2xl border-none overflow-hidden',
              headerTitle: 'text-2xl font-black tracking-tight text-slate-900',
              headerSubtitle: 'text-slate-500 font-medium',
              socialButtonsBlockButton: 'rounded-2xl border-slate-100 hover:bg-slate-50',
              formFieldInput: 'rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
            }
          }}
          routing="path"
          path="/sign-in"
        />
      </div>
      <p className="mt-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
        Secured by NexaShield Intelligence Layer
      </p>
    </div>
  );
}