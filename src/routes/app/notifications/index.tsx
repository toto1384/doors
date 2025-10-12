import { createFileRoute } from '@tanstack/react-router'
import { NotificationsContent } from '../../../components/notifications-dropdown'
import { Button } from '../../../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/app/notifications/')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const router = useRouter()

  return (
    <div className="min-h-[90dvh] bg-[#1A0F33] border rounded-lg border-[#1C252E] m-3">
      <div className="sticky bg-[#1A0F33] top-0 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.history.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Notifications</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto">
          <NotificationsContent />
        </div>
      </div>
    </div>
  )
}
