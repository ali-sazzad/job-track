"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  /** Uncontrolled usage: the element that opens the dialog. */
  trigger?: React.ReactNode;
  /** Controlled usage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** Accessible replacement for window.confirm(): focus-trapped, labelled, Esc to cancel. */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  trigger,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
