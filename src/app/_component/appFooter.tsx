import Image from 'next/image'
import nextConfig from '../../../next.config'

const BASE_PATH = nextConfig.basePath || ''

const socialLinks = {
  'X(旧Twitter)': {
    name: '@yosshioka0022',
    link: 'https://x.com/okamune_web',
    icon: (
      <Image
        src={`${BASE_PATH}/images/x-logo.png`}
        alt="x"
        width={24}
        height={24}
        className="text-blue-500"
      />
    )
  },
  GitHub: {
    name: '@ooyoshi00',
    link: 'https://github.com/ooyoshi00',
    icon: (
      <Image
        src={`${BASE_PATH}/images/github.svg`}
        alt="github"
        width={24}
        height={24}
        className="text-blue-500"
      />
    )
  },
  Zenn: {
    name: '@yoshiooon',
    link: 'https://zenn.dev/yoshiooon',
    icon: (
      <Image
        src={`${BASE_PATH}/images/zenn.svg`}
        alt="Zenn"
        width={24}
        height={24}
        className="text-blue-500"
      />
    )
  },
  Qiita: {
    name: '@okamune',
    link: 'https://qiita.com/okamune',
    icon: (
      <Image
        src={`${BASE_PATH}/images/qiita.png`}
        alt="Qiita"
        width={24}
        height={24}
      />
    )
  }
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-blue-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-bold text-blue-800">
            ソーシャルメディア
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {Object.entries(socialLinks).map(([platform, data]) => {
              const Icon = data.icon
              return (
                <a
                  key={platform}
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {Icon && Icon}
                  <span className="font-medium">{data.name}</span>
                </a>
              )
            })}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            © {new Date().getFullYear()} Okamune.
          </p>
        </div>
      </div>
    </footer>
  )
}
