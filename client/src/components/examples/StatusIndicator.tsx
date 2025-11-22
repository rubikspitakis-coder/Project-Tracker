import { StatusIndicator } from '../StatusIndicator'

export default function StatusIndicatorExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <StatusIndicator status="Active" />
      <StatusIndicator status="In Development" />
      <StatusIndicator status="Paused" />
      <StatusIndicator status="Archived" />
    </div>
  )
}
