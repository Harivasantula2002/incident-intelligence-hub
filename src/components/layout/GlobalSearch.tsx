import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { listIncidents } from "@/services/incidents";
import { listClusters } from "@/services/clusters";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const { data: incidents } = useQuery({
    queryKey: ["search", "incidents", term],
    queryFn: () => listIncidents({ search: term, pageSize: 6 }),
    enabled: open && term.length > 1,
  });

  const { data: clusters } = useQuery({
    queryKey: ["search", "clusters", term],
    queryFn: () => listClusters({ search: term }),
    enabled: open && term.length > 1,
  });

  const clusterResults = useMemo(() => (clusters ?? []).slice(0, 6), [clusters]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-56 items-center gap-2 rounded-md border border-input bg-surface px-2.5 text-sm text-muted-foreground transition-colors hover:border-ring/50 xl:w-80"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="truncate">Search incidents, clusters…</span>
        <kbd className="num ml-auto hidden rounded border border-border px-1 text-[10px] xl:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          value={term}
          onValueChange={setTerm}
          placeholder="Incident ID, cluster ID, cluster name, assignment group, description…"
        />
        <CommandList>
          {term.length < 2 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Type at least two characters to search MAIN and CLUSTER records.
            </div>
          ) : null}
          {term.length > 1 &&
          (incidents?.items.length ?? 0) === 0 &&
          clusterResults.length === 0 ? (
            <CommandEmpty>No incidents or clusters match your search.</CommandEmpty>
          ) : null}
          {incidents?.items.length ? (
            <CommandGroup heading="Incidents">
              {incidents.items.map((i) => (
                <CommandItem
                  key={i.id}
                  value={i.id}
                  onSelect={() => {
                    setOpen(false);
                    void navigate({ to: "/incidents/$id", params: { id: i.id } });
                  }}
                >
                  <span className="num mr-2 text-xs text-muted-foreground">{i.id}</span>
                  <span className="truncate">{i.shortDescription}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {clusterResults.length ? (
            <CommandGroup heading="Clusters">
              {clusterResults.map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.id}
                  onSelect={() => {
                    setOpen(false);
                    void navigate({ to: "/cluster-management", search: { q: c.id } });
                  }}
                >
                  <span className="num mr-2 text-xs text-muted-foreground">{c.id}</span>
                  <span className="truncate">{c.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}
