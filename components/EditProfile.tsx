"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  FileText,
  Check,
  HelpCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { AuthUser } from "@/lib/auth";

interface EditProfileProps {
  user: AuthUser;
}

export function EditProfile({ user }: EditProfileProps) {
  const [bio, setBio] = useState(user.bio || "");
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    // await updateBio(bio);
    setIsPending(false);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-transparent">
      <ScrollArea className="w-full h-screen">
        <div className="flex flex-1 flex-col gap-6 items-center p-4 pt-12 pb-24">
          <div className="w-full max-w-250 mx-auto flex justify-start">
            <Link href={`/user/${user.username}`}>
              <Button
                variant="ghost"
                className="rounded-xl gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>

          {/* Двухколоночный контейнер, убирающий пустоту */}
          <div className="w-full max-w-250 mx-auto flex flex-col md:flex-row gap-6 items-start">
            {/* Левая основная колонка с формой */}
            <Card className="flex-1 w-full bg-sidebar border border-solid shadow-sm overflow-hidden p-0">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Edit Profile
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Update your bio description. Other settings are locked for
                    now.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                  <Avatar
                    className="aspect-square h-20 w-20 bg-black rounded-[35%] overflow-hidden border border-solid border-black shrink-0"
                    seed={user.username || "Anonymous"}
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-foreground">
                      @{user.username}
                    </h3>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6 w-full">
                  <div className="space-y-3 w-full">
                    <label className="text-xs font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      About You (Bio)
                    </label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={160}
                      className="rounded-xl border-solid border-border/60 bg-background/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/50 resize-none leading-relaxed text-sm w-full transition-colors"
                    />
                    <div className="text-[11px] text-muted-foreground text-right pr-1">
                      {bio.length} / 160 characters
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      disabled={isPending}
                      type="submit"
                      className="font-semibold min-w-35 rounded-xl px-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-none gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Правая колонка: Подсказки и инфо-блоки, заполняющие экран */}
            <div className="w-full md:w-80 space-y-4 shrink-0">
              {/* Блок Советов */}
              <Card className="bg-sidebar border border-solid shadow-sm p-5 space-y-3 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Bio Tips
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A good bio tells a story. Share your interests, project links,
                  or what you are currently working on to stand out in the
                  Frostr feed.
                </p>
              </Card>

              {/* Блок Системного Инфо (почему закрыты поля) */}
              <Card className="bg-sidebar border border-solid shadow-sm p-5 space-y-3 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                  Account Security
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Username changes are temporarily restricted to maintain link
                  integrity and prevent impersonation within the platform.
                </p>
              </Card>

              {/* Блок Поддержки */}
              <Card className="bg-sidebar border border-solid shadow-sm p-5 space-y-3 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  Need Help?
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you need to change your registered email or completely
                  delete your account, please contact our support team.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
