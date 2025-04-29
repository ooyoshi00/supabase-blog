'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-scroll'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [toc, setToc] = useState<TOCItem[]>([])

  useEffect(() => {
    const headings = content.match(/^#{1,3} .+$/gm) || []
    const tocItems = headings.map((heading, index) => {
      const level = heading.split(' ')[0].length
      const text = heading.replace(/^#{1,3} /, '')
      const id = `${text.toLowerCase().replace(/[^\w]+/g, '-')}-${index}`
      return { id, text, level }
    })
    setToc(tocItems)
  }, [content])

  return (
    <nav className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">目次</h2>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li
            key={item.id}
            style={{ marginLeft: `${(item.level - 1) * 12}px` }}
          >
            <Link
              to={item.id}
              smooth={true}
              duration={300}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
