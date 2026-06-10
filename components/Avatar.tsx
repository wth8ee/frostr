"use client";

import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";

export function Avatar({
  seed = "John Doe",
  className,
}: {
  seed: string;
  className: string;
}) {
  const avatar = useMemo(() => {
    return createAvatar(identicon, {
      seed,
      size: 128,
    }).toDataUri();
  }, [seed]);

  return (
    <div className={className}>
      <img src={avatar} alt="Avatar" />
    </div>
  );
}
