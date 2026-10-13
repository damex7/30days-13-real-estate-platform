import { Search } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import type { ReactNode } from "react";

import type { Option, SelectField } from "@/lib/search-params";
import { cn } from "@/lib/utils";

function Field({ label, htmlFor, className, children }: { label: string; htmlFor: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * A GET form that writes filters to the URL. Each market supplies its own
 * fields, so this component only knows how to lay them out.
 */
export function SearchFilters({
  action,
  formKey,
  keyword,
  keywordPlaceholder,
  fields,
  sortOptions,
  sort,
  showClear,
}: {
  action: string;
  /** Changes with the URL so uncontrolled fields reset after navigation. */
  formKey: string;
  keyword: string | undefined;
  keywordPlaceholder: string;
  fields: SelectField[];
  sortOptions: readonly Option[];
  sort: string;
  showClear: boolean;
}) {
  return (
    <Form key={formKey} action={action} className="space-y-4 rounded-xl border border-line bg-surface p-4">
      <Field label="Keyword" htmlFor="q">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={keyword}
            placeholder={keywordPlaceholder}
            className="field pl-9"
          />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <Field key={field.name} label={field.label} htmlFor={field.name} className={field.half ? undefined : "col-span-2"}>
            <select id={field.name} name={field.name} defaultValue={field.value ?? ""} className="field">
              <option value="">{field.anyLabel}</option>
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        ))}
      </div>

      <Field label="Sort by" htmlFor="sort">
        <select id="sort" name="sort" defaultValue={sort} className="field">
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="h-10 flex-1 rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground transition hover:bg-brand-hover"
        >
          Apply filters
        </button>
        {showClear && (
          <Link href={action} className="text-sm text-muted underline-offset-2 hover:text-foreground hover:underline">
            Clear
          </Link>
        )}
      </div>
    </Form>
  );
}
