export type PreviewTheme = 'light' | 'dark';
export type PreviewTab = 'All' | 'Pinned' | 'Recent';

export type ExtensionTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  permissions: string[];
  files: string[];
};

export type PreviewNote = {
  id: number;
  title: string;
  body: string;
  pinned: boolean;
};
