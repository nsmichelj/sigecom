import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface NewsCardProps {
  label: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  bgColor?: string;
}

export function NewsCard({
  label,
  title,
  description,
  date,
  image,
  bgColor = "bg-slate-900",
}: NewsCardProps) {
  return (
    <Card className="pt-0! pb-6 border-0 shadow-none overflow-hidden gap-2 group">
      <div
        className={`h-40 sm:h-48 ${image ? "bg-cover bg-center" : bgColor}`}
        style={image ? { backgroundImage: `url(${image})` } : {}}
      >
        {!image && <div className="w-full h-full"></div>}
      </div>
      <CardContent className="p-0 space-y-2">
        <span className="text-xs font-semibold text-primary uppercase">
          {label}
        </span>
        <CardTitle className="group-hover:text-primary">{title}</CardTitle>
        <CardDescription className="flex-1">{description}</CardDescription>
        <p className="text-xs text-foreground/50">{date}</p>
      </CardContent>
    </Card>
  );
}
