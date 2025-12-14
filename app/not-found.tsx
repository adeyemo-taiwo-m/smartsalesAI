import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-bold tracking-tight">404 - Not Found</h2>
      <p className="mt-4 text-muted-foreground">
        Could not find requested resource
      </p>
      <Link href="/">
        <Button className="mt-8" variant="default">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
