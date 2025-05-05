"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function TQProvider({ children }: { children: ReactNode }) {
  // useState를 사용해 클라이언트에서 단일 QueryClient 유지
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 데이터 갱신 빈도 제어
        refetchOnWindowFocus: false // 불필요한 API 호출 방지
      }
    }
  }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}