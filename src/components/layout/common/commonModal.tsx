"use client";
import { useDialog } from "@/hooks/use-dialog";

interface UseCommonModalProps {
  type: "basic" | "destructive" | "warning";
  actionEvent: () => Promise<any>;
}

export function useCommonModal() {
  const { confirm, alert } = useDialog();

  const openModal = async ({ type, actionEvent }: UseCommonModalProps) => {
    let config: any = {};

    if (type === "basic") {
      config = {
        title: "Confirm Action",
        description: "Are you sure you want to proceed? This cannot be undone.",
        confirmText: "Yes, proceed",
        cancelText: "Cancel",
      };
    }

    if (type === "destructive") {
      config = {
        title: "Delete Item",
        description:
          "This will permanently delete the item and remove all associated data.",
        confirmText: "Delete",
        cancelText: "Keep",
        variant: "destructive",
      };
    }

    if (type === "warning") {
      config = {
        title: "Important Change",
        description:
          "This change may affect other parts of the system. Please review before proceeding.",
        confirmText: "Continue",
        cancelText: "Review",
        variant: "warning",
      };
    }

    // Only opens modal — waits for user confirm/cancel
    const userConfirmed = await confirm(config);

    if (userConfirmed) {
      try {
        // Run API call *only after* confirm
        await actionEvent();
        await alert({
          title: "Success",
          description: "Your request was completed successfully.",
          variant: "success",
        });
      } catch (error: any) {
        await alert({
          title: "Error",
          description: error?.message || "Something went wrong.",
          variant: "destructive",
        });
        return; // modal won't auto-close
      }
    }
  };

  return { openModal };
}
