"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { createPost } from "@/lib/actions";

export default function CreatePostForm() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      createPost(content);
      setContent("");
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-sidebar border border-solid shadow-sm w-full max-w-250">
      <form onSubmit={handleSubmit}>
        <CardContent className="py-4 bg-sidebar">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="text-lg bg-transparent focus:bg-transparent focus-visible:bg-transparent shadow-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 resize-none placeholder:text-muted-foreground text-foreground leading-relaxed"
            maxLength={500}
          />
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-1.5 pb-1.5">
          <span className="text-xs text-muted-foreground">
            {content.length}/500
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !content.trim()}
            className="font-medium px-4"
          >
            {isLoading ? "Publishing..." : "Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
