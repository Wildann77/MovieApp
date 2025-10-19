
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Quote } from "lucide-react";

export default function MovieDescription({ description }) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <Quote className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
          <p className="text-foreground leading-relaxed text-base sm:text-lg pl-4 sm:pl-6">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
