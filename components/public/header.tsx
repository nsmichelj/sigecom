import Link from "next/link";
import { Container } from "../container";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Container className="flex items-center justify-between py-2">
        <Link href="/" className="flex gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              className="size-6"
            >
              <path
                fill="currentColor"
                d="M6 2.5A.75.75 0 1 0 6 4a.75.75 0 0 0 0-1.5m-1.75.75a1.75 1.75 0 1 1 3.5 0a1.75 1.75 0 0 1-3.5 0M2.5 4a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1M1 4.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m8 0a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0M9.5 3a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M4 7.25C4 6.56 4.56 6 5.25 6h1.5C7.44 6 8 6.56 8 7.25V8.5a2 2 0 1 1-4 0zM5.25 7a.25.25 0 0 0-.25.25V8.5a1 1 0 1 0 2 0V7.25A.25.25 0 0 0 6.75 7zM3 7.25c0-.289.054-.565.154-.818l-1.231.33a1.25 1.25 0 0 0-.884 1.53l.194.725a2 2 0 0 0 2.45 1.414l.017-.005a3 3 0 0 1-.53-.927a1 1 0 0 1-.971-.741l-.194-.725a.25.25 0 0 1 .177-.306L3 7.507zm5.316 3.18l-.016-.003c.228-.273.409-.586.53-.928a1 1 0 0 0 .97-.741l.193-.725a.25.25 0 0 0-.177-.306L9 7.508V7.25c0-.289-.054-.564-.153-.818l1.228.33a1.25 1.25 0 0 1 .884 1.53l-.194.725a2 2 0 0 1-2.45 1.414"
              ></path>
            </svg>
          </div>
          <div className="grid flex-1 text-left text-md leading-tight">
            <span className="truncate font-medium">SIGECOM</span>
            <span className="truncate text-sm">Las colinas</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:gap-8 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/">Inicio</Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
