import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/my-properties')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/my-properties"!</div>
}
