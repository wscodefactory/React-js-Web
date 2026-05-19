type YamlStatusMessageProps = {
  message: string;
};

export function YamlStatusMessage({ message }: YamlStatusMessageProps) {
  return (
    <p className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
      {message}
    </p>
  );
}
