import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Frown, ArrowLeft } from "lucide-react";

export default function UserNotFound() {
  return (
    <div className="flex w-full h-screen items-start justify-center p-4 pt-12 bg-transparent">
      <Card className="w-full max-w-md bg-sidebar border border-solid shadow-sm text-center overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center gap-5">
          <div className="p-4 bg-background border border-solid rounded-[35%] text-muted-foreground shrink-0">
            <Frown className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              User not found
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              The profile you are looking for doesn&apos;t exist or has been
              deleted from Frostr world.
            </p>
          </div>

          <Link href="/" className="w-full mt-2">
            <Button
              variant="outline"
              className="w-full rounded-xl border-solid font-semibold gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
