import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, fallback, alt, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    if (!src || hasError) {
      return (
        <div
          ref={ref as any}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted",
            className
          )}
          {...(props as any)}
        >
          <span className="text-sm font-medium uppercase text-muted-foreground">
            {fallback || "?"}
          </span>
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || "Avatar"}
        onError={() => setHasError(true)}
        className={cn(
          "aspect-square h-10 w-10 rounded-full object-cover",
          className
        )}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
