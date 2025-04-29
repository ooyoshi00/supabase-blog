const skillTypeList = ['frontend', 'backend', 'etc'] as const
type SkillType = (typeof skillTypeList)[number]

export type Skill = {
  id: number
  skilltype: SkillType
  skillname: string
  rank: number
}
