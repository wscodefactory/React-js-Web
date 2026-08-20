export const projectAccentColors = ['green', 'blue', 'amber', 'rose', 'gray'] as const;

export type ProjectAccentColor = (typeof projectAccentColors)[number];
export type ProjectStatus = 'active' | 'archived';

export type PersonalProject = {
  accentColor: ProjectAccentColor;
  createdAt?: unknown;
  description: string;
  id: string;
  isFavorite: boolean;
  linkedStorageKeys: string[];
  name: string;
  status: ProjectStatus;
  tags: string[];
  updatedAt?: unknown;
};

export type ProjectDraft = Pick<
  PersonalProject,
  'accentColor' | 'description' | 'linkedStorageKeys' | 'name' | 'tags'
>;
