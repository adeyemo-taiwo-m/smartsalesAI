"use client";

import { LeadsTable } from "@/components/tables/leads-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_LEADS } from "@/lib/mock-data";
import { Download, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = MOCK_LEADS.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage and track your potential customers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <LeadsTable leads={filteredLeads} />
    </div>
  );
}
