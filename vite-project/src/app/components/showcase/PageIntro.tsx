interface PageIntroProps {
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
    <header className="mb-6 md:mb-8">
      <h1 className="text-3xl md:text-4xl mb-4">
        <span className="text-green-600 dark:text-green-400">{highlight}</span> {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </header>
  );
}
