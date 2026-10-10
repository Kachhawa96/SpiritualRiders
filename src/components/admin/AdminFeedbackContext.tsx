"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  AdminFeedbackModal,
  type AdminFeedbackType,
} from "@/components/admin/AdminFeedbackModal";

export interface FeedbackOptions {
  type: AdminFeedbackType;
  title: string;
  message: string;
  redirectTo?: string;
  scrollToTop?: boolean;
  confirmLabel?: string;
  onConfirm?: () => void;
}

interface AdminFeedbackContextValue {
  showFeedback: (options: FeedbackOptions) => void;
  closeFeedback: () => void;
}

const AdminFeedbackContext = createContext<AdminFeedbackContextValue | null>(null);

export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackOptions | null>(null);

  const showFeedback = useCallback((options: FeedbackOptions) => {
    setFeedback(options);
  }, []);

  const closeFeedback = useCallback(() => {
    if (!feedback) return;
    const { redirectTo, scrollToTop, onConfirm } = feedback;
    setFeedback(null);

    if (onConfirm) {
      onConfirm();
    }

    if (redirectTo) {
      router.push(redirectTo);
    } else if (scrollToTop !== false) {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [feedback, router]);

  return (
    <AdminFeedbackContext.Provider value={{ showFeedback, closeFeedback }}>
      {children}
      {feedback && (
        <AdminFeedbackModal
          isOpen={Boolean(feedback)}
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          confirmLabel={feedback.confirmLabel}
          onClose={closeFeedback}
        />
      )}
    </AdminFeedbackContext.Provider>
  );
}

export function useAdminFeedback() {
  const context = useContext(AdminFeedbackContext);
  if (!context) {
    throw new Error(
      "useAdminFeedback must be used within an AdminFeedbackProvider."
    );
  }
  return context;
}
