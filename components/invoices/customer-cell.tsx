import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { avatarColor, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CustomerCell({ name, email }: { name: string; email: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar className="size-8 flex-none">
        <AvatarFallback
          className={cn("text-[12px] font-bold text-white", avatarColor(name))}
        >
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="text-foreground truncate text-sm font-bold">{name}</div>
        {email ? (
          <div className="text-subtle-foreground truncate text-xs font-medium">
            {email}
          </div>
        ) : null}
      </div>
    </div>
  );
}
