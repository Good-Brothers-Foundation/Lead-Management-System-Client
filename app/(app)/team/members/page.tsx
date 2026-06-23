"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Shield,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Member } from "@/lib/types/team";
import { membersApi } from "@/lib/api/team";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const data = await membersApi.getAll();
      setMembers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load team members",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(false);
  }, []);

  const handleOpenAdd = () => {
    setName("");
    setEmail("");
    setRole("Member");
    setStatus("Active");
    setIsAddOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setSelectedMember(member);
    setName(member.name);
    setEmail(member.email || "");
    setRole(member.role);
    setStatus(member.status);
    setIsEditOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const newMember = await membersApi.create({ name, email, role, status });
      setMembers((prev) => [newMember, ...prev]);
      setIsAddOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !name.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await membersApi.update(selectedMember._id, {
        name,
        email,
        role,
        status,
      });
      setMembers((prev) =>
        prev.map((m) => (m._id === selectedMember._id ? updated : m)),
      );
      setIsEditOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this member from the team?"))
      return;

    try {
      await membersApi.remove(id);
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete member");
    }
  };

  return (
    <main className="w-full space-y-6 p-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Team Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your organization staff, define roles, and allocate
            task-assignable users.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="h-10 gap-2 font-semibold text-white bg-(--button-secondary) hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Grid container */}
      <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-bold text-foreground">Name</TableHead>
              <TableHead className="font-bold text-foreground">Email</TableHead>
              <TableHead className="font-bold text-foreground">Role</TableHead>
              <TableHead className="font-bold text-foreground">
                Status
              </TableHead>
              <TableHead className="text-right font-bold text-foreground pr-6">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span>Loading members...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : members.length > 0 ? (
              members.map((member) => (
                <TableRow
                  key={member._id}
                  className="border-b border-border/80 hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-semibold py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-muted/80 border border-border flex items-center justify-center text-[#fd6102] font-bold text-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {member.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span>{member.email || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="capitalize">{member.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.status === "Active" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full font-bold px-2.5 py-0.5 text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border border-border rounded-full font-bold px-2.5 py-0.5 text-xs">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenEdit(member)}
                        className="h-8 w-8 text-muted-foreground hover:text-white rounded-md cursor-pointer hover:bg-(--button-primary)"
                        title="Edit member"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(member._id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
                        title="Delete member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  No members added yet. Add your first team member above!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-106.25 bg-card border border-border">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                Add New Member
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter details to add a new assignable staff member.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mayank Kansal"
                  required
                  className="bg-muted/10 border-input h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. mayank@goodbrothers.org"
                  className="bg-muted/10 border-input h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role" className="text-sm font-semibold">
                  Role
                </Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Analyst, Representative"
                  className="bg-muted/10 border-input h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select
                  onValueChange={(val) => setStatus(val as any)}
                  defaultValue={status}
                >
                  <SelectTrigger className="h-10 bg-muted/10 border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isSubmitting}
                className="h-10 font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 font-semibold text-white bg-(--button-secondary) hover:opacity-90"
              >
                {isSubmitting ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-106.25 bg-card border border-border">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                Edit Member Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Modify information for {selectedMember?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="edit-name" className="text-sm font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-muted/10 border-input h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/10 border-input h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-role" className="text-sm font-semibold">
                  Role
                </Label>
                <Input
                  id="edit-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-muted/10 border-input h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select
                  onValueChange={(val) => setStatus(val as any)}
                  value={status}
                >
                  <SelectTrigger className="h-10 bg-muted/10 border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
                className="h-10 font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 font-semibold text-white bg-(--button-secondary) hover:opacity-90"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
