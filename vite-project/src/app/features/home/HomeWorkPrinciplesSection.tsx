import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/app/components/common";
import { featureCardIcons } from "./homeIcons";
import type { HomeText } from "./types";

type HomeWorkPrinciplesSectionProps = {
  text: HomeText;
};

export function HomeWorkPrinciplesSection({ text }: HomeWorkPrinciplesSectionProps) {
  return (
    <section>
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{text.workPrinciples}</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">{text.workPrinciplesDescription}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {text.featureCards.map((feature, index) => {
          const Icon = featureCardIcons[index] ?? Sparkles;

          return (
            <Card key={feature.title}>
              <CardContent className="p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
