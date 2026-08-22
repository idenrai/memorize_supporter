"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { useT } from "@/hooks/useT"
import { deleteExamResult } from "@/actions/records"
import { toast } from "sonner"

export default function DeleteRecordButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const t = useT()

  const handleDelete = () => {
    if (!window.confirm(t.records?.confirmDeleteRecord || t.management?.confirmDelete || "Are you sure you want to delete this record?")) return

    startTransition(async () => {
      const result = await deleteExamResult({ id })
      if (result?.success) {
        toast.success(t.records?.deleteSuccess || t.management?.deleteSuccess || "Record deleted successfully.")
      } else {
        toast.error(result?.message || t.records?.deleteFailed || t.management?.deleteFailed || "Failed to delete record.")
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title={t.management?.delete || "삭제"}
      aria-label={t.management?.delete || "삭제"}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/50 text-rose-400/70 hover:bg-rose-500/10 hover:text-rose-400 transition-colors disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  )
}
