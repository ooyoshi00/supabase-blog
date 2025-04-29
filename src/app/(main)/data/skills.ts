type SkillData = {
  category: string
  name: string
  services?: string[]
  startYear: number
  endYear?: number
}

const originalSkillData: SkillData[] = [
  {
    name: 'Docker',
    category: 'etc',
    startYear: 2021
  },
  {
    category: 'backend',
    name: 'GraphQL',
    startYear: 2023
  },
  { name: 'Node.js', category: 'backend', startYear: 2022 },
  { name: 'Terraform', category: 'infra', startYear: 2024 },
  { name: 'vitest', category: 'etc', startYear: 2024 },
  { name: 'Next.js', category: 'frontend', startYear: 2023 },
  { name: 'MUI', category: 'frontend', startYear: 2021 },
  {
    name: 'GCP',
    services: ['cloudStorage'],
    category: 'infra',
    startYear: 2023
  },
  { name: 'TypeScript', category: 'frontend', startYear: 2021 },
  { name: 'React', category: 'frontend', startYear: 2021 },
  { name: 'Git', category: 'etc', startYear: 2021 },
  {
    name: 'AWS',
    services: ['Amplify'],
    category: 'infra',
    startYear: 2021
  },
  { name: 'NoSQL', category: 'backend', startYear: 2022 },
  { name: 'Jest', category: 'etc', startYear: 2023 },
  { name: 'Firebase', category: 'infra', startYear: 2023 },
  { name: 'NextAuth.js', category: 'etc', startYear: 2023 }
]

export const skillData = originalSkillData.sort(
  (a, b) => a.startYear - b.startYear
)
