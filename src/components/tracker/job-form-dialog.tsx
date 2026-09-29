"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/native-select";
import { isValidUrl } from "@/lib/jobs";
import { STATUS_LABEL, STATUS_ORDER, type JobApplication, type JobStatus } from "@/lib/types";

export type JobFormValues = Pick<JobApplication, "company" | "role" | "status" | "appliedDate" | "link" | "notes">;

type FormState = {
  company: string;
  role: string;
  status: JobStatus | "";
  appliedDate: string;
  link: string;
  notes: string;
};

type Field = keyof FormState;
type Errors = Partial<Record<Field, string>>;

function toFormState(app?: JobApplication | null): FormState {
  return {
    company: app?.company ?? "",
    role: app?.role ?? "",
    status: app?.status ?? "",
    appliedDate: app?.appliedDate ?? "",
    link: app?.link ?? "",
    notes: app?.notes ?? "",
  };
}

function validate(form: FormState): Errors {
  const e: Errors = {};
  if (form.company.trim().length < 2) e.company = "Company must be at least 2 characters.";
  if (form.role.trim().length < 2) e.role = "Role must be at least 2 characters.";
  if (!form.status) e.status = "Please select a status.";
  if (form.link.trim() && !isValidUrl(form.link.trim())) e.link = "Enter a valid URL (include https://).";
  return e;
}

type JobFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null → add mode */
  editing: JobApplication | null;
  onSubmit: (values: JobFormValues) => void;
};

export function JobFormDialog({ open, onOpenChange, editing, onSubmit }: JobFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit application" : "Add application"}</DialogTitle>
          <DialogDescription>
            Save company, role, status, and optional notes. Everything persists locally.
          </DialogDescription>
        </DialogHeader>

        {/* Content unmounts when closed, so the form state resets naturally on every open. */}
        <JobForm initial={editing} onCancel={() => onOpenChange(false)} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}

function JobForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: JobApplication | null;
  onCancel: () => void;
  onSubmit: (values: JobFormValues) => void;
}) {
  const [form, setForm] = React.useState<FormState>(() => toFormState(initial));
  const [errors, setErrors] = React.useState<Errors>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  function update<K extends Field>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    // Clear a field's error as soon as the user edits it.
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);

    const firstInvalid = (Object.keys(next) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    onSubmit({
      company: form.company.trim(),
      role: form.role.trim(),
      status: form.status as JobStatus,
      appliedDate: form.appliedDate || undefined,
      link: form.link.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
  }

  const errorProps = (field: Field) =>
    errors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `${field}-error` }
      : { "aria-invalid": false as const };

  const errorText = (field: Field) =>
    errors[field] ? (
      <p id={`${field}-error`} role="alert" className="text-sm text-destructive">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-4 border-t pt-4">
      <div className="grid gap-2">
        <Label htmlFor="company">Company *</Label>
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="e.g., Canva"
          {...errorProps("company")}
        />
        {errorText("company")}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role *</Label>
        <Input
          id="role"
          name="role"
          autoComplete="organization-title"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
          placeholder="e.g., Junior Frontend Developer"
          {...errorProps("role")}
        />
        {errorText("role")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <Label htmlFor="status">Status *</Label>
          <NativeSelect
            id="status"
            name="status"
            value={form.status}
            onChange={(e) => update("status", e.target.value as JobStatus | "")}
            {...errorProps("status")}
          >
            <option value="">Select…</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </NativeSelect>
          {errorText("status")}
        </div>

        <div className="grid content-start gap-2">
          <Label htmlFor="appliedDate">Applied date</Label>
          <Input
            id="appliedDate"
            name="appliedDate"
            type="date"
            value={form.appliedDate}
            onChange={(e) => update("appliedDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="link">Job link</Label>
        <Input
          id="link"
          name="link"
          type="url"
          inputMode="url"
          value={form.link}
          onChange={(e) => update("link", e.target.value)}
          placeholder="https://…"
          {...errorProps("link")}
        />
        {errors.link ? (
          errorText("link")
        ) : (
          <p className="text-xs text-muted-foreground">Optional, but useful for quick access.</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Follow up next Monday…"
        />
      </div>

      <DialogFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Save changes" : "Add application"}</Button>
      </DialogFooter>
    </form>
  );
}
