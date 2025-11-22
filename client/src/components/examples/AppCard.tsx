import { AppCard } from '../AppCard'
import type { App } from '@shared/schema'

export default function AppCardExample() {
  const mockApp: App = {
    id: "1",
    name: "Portfolio Website",
    platform: "Replit",
    status: "Active",
    category: "Personal",
    liveUrl: "https://myportfolio.replit.app",
    repositoryUrl: "https://github.com/user/portfolio",
    notes: "Personal portfolio built with React and Tailwind CSS. Deployed on Replit.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  }

  return (
    <div className="max-w-sm">
      <AppCard 
        app={mockApp}
        onEdit={(app) => console.log('Edit:', app.name)}
        onArchive={(app) => console.log('Archive:', app.name)}
      />
    </div>
  )
}
