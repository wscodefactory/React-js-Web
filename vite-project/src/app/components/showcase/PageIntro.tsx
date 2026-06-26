export interface PageIntroProps {
  highlight: string;
  title: string;
  description: string;
}

/**
 * Shared hero used across showcase detail pages.
 * Keeps page headers consistent while letting each page only provide content.
 */
export function PageIntro({ highlight, title, description }: PageIntroProps) {
  return (
    <header className="mb-6 min-w-0 max-w-[calc(100vw_-_2rem)] overflow-hidden md:mb-8 md:max-w-full">
      <h1 className="mb-4 min-w-0 break-words text-3xl md:text-4xl">
        <span className="text-green-600 dark:text-green-400">{highlight}</span> {title}
      </h1>
      <p className="min-w-0 break-words text-gray-600 [overflow-wrap:anywhere] dark:text-gray-400">{description}</p>
    </header>
  );
}
