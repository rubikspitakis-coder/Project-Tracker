import { FilterBar } from '../FilterBar'
import { useState } from 'react'

export default function FilterBarExample() {
  const [searchQuery, setSearchQuery] = useState('')
  const [platform, setPlatform] = useState('all')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')

  return (
    <FilterBar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedPlatform={platform}
      onPlatformChange={setPlatform}
      selectedStatus={status}
      onStatusChange={setStatus}
      selectedCategory={category}
      onCategoryChange={setCategory}
    />
  )
}
