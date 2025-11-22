import { EmptyState } from '../EmptyState'

export default function EmptyStateExample() {
  return (
    <EmptyState onAddApp={() => console.log('Add app clicked')} />
  )
}
