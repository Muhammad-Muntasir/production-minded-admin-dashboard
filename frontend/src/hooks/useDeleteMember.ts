import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useDeleteMember(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (memberId: string) => {
      const { error, count } = await supabase
        .from('organization_members')
        .delete({ count: 'exact' })
        .eq('id', memberId)
      if (error) throw new Error(error.message)
      if (count === 0) throw new Error('Permission denied — run the DELETE RLS policy in your Supabase SQL editor.')
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['members', orgId] })
      void queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}
