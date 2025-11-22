import { AppDialog } from '../AppDialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function AppDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log('Form submitted:', data)
          setOpen(false)
        }}
      />
    </div>
  )
}
