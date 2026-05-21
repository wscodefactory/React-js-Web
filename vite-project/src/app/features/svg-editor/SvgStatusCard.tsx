import { Card, CardContent } from '../../components/common';

type SvgStatusCardProps = {
  status: string;
};

export function SvgStatusCard({ status }: SvgStatusCardProps) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>
      </CardContent>
    </Card>
  );
}
