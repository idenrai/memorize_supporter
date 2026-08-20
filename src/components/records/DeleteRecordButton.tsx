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
    if (!window.confirm(t.management?.confirmDelete || "정말로 이 기록을 삭제하시겠습니까?")) return

    startTransition(async () => {
      const result = await deleteExamResult({ id })
      if (result?.success) {
        toast.success(t.management?.deleteSuccess || "기록이 삭제되었습니다.")
      } else {
        toast.error(result?.message || t.management?.deleteFailed || "기록 삭제에 실패했습니다.")
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
