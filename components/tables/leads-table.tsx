"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone, Mail } from "lucide-react";

// Minimal Table implementation since we didn't create ui/table.tsx yet,
// wait, I should create ui/table.tsx first or inline it.
// I'll inline the table styles here or create a ui/table.tsx component quickly?
// Better to create components/ui/table.tsx to be consistent.
// I will create table.tsx in the next step, but here I import it assuming it exists.
// Actually I will provide the table.tsx content in a separate write_to_file call in this turn if possible or next turn.
// For now I will assume it exists or use standard div structure if table is too complex.
// Standard Table UI component is better. I will create `table.tsx` right after this file in the same turn.

export function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                <div>{lead.name}</div>
                <div className="text-xs text-muted-foreground">
                  {lead.company}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-xs">
                    <Mail className="h-3 w-3" /> {lead.email}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Phone className="h-3 w-3" /> {lead.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    lead.status === "Hot"
                      ? "destructive"
                      : lead.status === "Closed"
                      ? "success"
                      : "secondary"
                  }
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>${lead.value.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
