import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <LoginForm />

              <div className="relative hidden bg-muted md:block">
                <Image
                  src="/login-background.png"
                  alt="Image Login Cover"
                  fill
                  sizes="100%"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
