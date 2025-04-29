import { skillData } from './data/skills'

const Skills = () => {
  const categories = ['frontend', 'backend', 'infra', 'etc']
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">スキルセット</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category} className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4 capitalize text-blue-700">
              {category}
            </h3>
            <ul className="space-y-2">
              {skillData
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <li key={skill.name} className="flex justify-between">
                    <span className="text-gray-700">{skill.name}</span>
                    {/* {skill.services && (
                      <div className="text-gray-700">
                        ({skill.services.join(',')})
                      </div>
                    )} */}
                    <span className="text-blue-600 font-semibold">
                      {skill.startYear}年~
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
