import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
            Get Started
          </h1>
          <p className="text-gray-600 mt-2">Create your account and start generating images</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}