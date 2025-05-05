import { guestbookApi, likesApi } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Guestbook } from "../types/guestbook";

// 방명록 목록 조회 훅
export function useGuestbookEntries() {
  return useQuery<Guestbook[]>({
    queryKey: ["guestbook"],
    queryFn: async () => {
      const response = await guestbookApi.getGuestbooks();
      return response.data;
    }
  });
}

// 방명록 생성 훅
export function useCreateGuestbookEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { contents: string; user_id: number; user_nickname: string }) => {
      const response = await guestbookApi.createGuestbook(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestbook"] });
    }
  });
}

// 방명록 수정 훅
export function useUpdateGuestbookEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, contents }: { id: number; contents: string }) => {
      const response = await guestbookApi.updateGuestbook(id, { contents });
      return response.data;
    },
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ["guestbook"] });
      const prevEntries = queryClient.getQueryData<Guestbook[]>(["guestbook"]) || [];

      queryClient.setQueryData(["guestbook"], (oldEntries: Guestbook[] = []) =>
        oldEntries.map((entry) => 
          entry.id === updated.id ? { ...entry, contents: updated.contents } : entry
        )
      );

      return { prevEntries };
    },
    onError: (_err, _updated, context) => {
      queryClient.setQueryData(["guestbook"], context?.prevEntries);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["guestbook"] });
    }
  });
}

// 방명록 삭제 훅
export function useDeleteGuestbookEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await guestbookApi.deleteGuestbook(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["guestbook"] });
      const prevEntries = queryClient.getQueryData<Guestbook[]>(["guestbook"]) || [];

      queryClient.setQueryData(
        ["guestbook"],
        prevEntries.filter((entry) => entry.id !== id)
      );

      return { prevEntries };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["guestbook"], context?.prevEntries);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["guestbook"] });
    }
  });
}

// 좋아요 토글 훅
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isLiked }: { id: number; isLiked: boolean }) => {
      if (isLiked) {
        await likesApi.updateUnlike(id);
      } else {
        await likesApi.updateLike(id);
      }
    },
    onMutate: async ({ id, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["guestbook"] });
      const prevEntries = queryClient.getQueryData<Guestbook[]>(["guestbook"]) || [];

      queryClient.setQueryData(["guestbook"], (oldEntries: Guestbook[] = []) =>
        oldEntries.map((entry) => 
          entry.id === id 
            ? { 
                ...entry, 
                likes: isLiked ? entry.likes - 1 : entry.likes + 1,
                liked_by_user: !isLiked
              } 
            : entry
        )
      );

      return { prevEntries };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["guestbook"], context?.prevEntries);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["guestbook"] });
    }
  });
} 