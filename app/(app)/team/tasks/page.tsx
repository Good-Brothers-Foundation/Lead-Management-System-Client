"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  Calendar, 
  User, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Loader2,
  Search,
  RotateCcw,
  History,
  Kanban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Member, TeamTask } from "@/lib/types/team";
import { membersApi, teamTasksApi } from "@/lib/api/team";

export default function TeamTasksPage() {
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab state: "board" or "history"
  const [activeTab, setActiveTab] = useState<"board" | "history">("board");

  // History search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMember, setFilterMember] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"backlog" | "pending" | "completed">("backlog");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const [membersData, tasksData] = await Promise.all([
        membersApi.getAll(),
        teamTasksApi.getAll(),
      ]);
      setMembers(membersData.filter(m => m.status === "Active"));
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load task board data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  const handleOpenAdd = () => {
    if (members.length === 0) {
      alert("Please add at least one Active Team Member first before creating tasks!");
      return;
    }
    setTitle("");
    setDescription("");
    setAssignedTo(members[0]?._id || "");
    setPriority("medium");
    setStatus("backlog");
    setDueDate("");
    setIsAddOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo) return;

    setIsSubmitting(true);
    try {
      const newTask = await teamTasksApi.create({
        title,
        description,
        assignedTo,
        priority,
        status,
        dueDate,
      });
      setTasks((prev) => [newTask, ...prev]);
      setIsAddOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveStatus = async (task: TeamTask, newStatus: "backlog" | "pending" | "completed") => {
    try {
      const updated = await teamTasksApi.update(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to move task status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await teamTasksApi.remove(id);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isDeleted: true } : t))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleRestore = async (task: TeamTask) => {
    try {
      const updated = await teamTasksApi.update(task._id, { isDeleted: false });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to restore task");
    }
  };

  const getPriorityColor = (pri: string) => {
    switch (pri) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  // Filter tasks based on Search Term and Assigned Member (shared filters)
  const filteredTasks = tasks.filter((task) => {
    // 1. Search term filter (Task Title or Description)
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Member filter
    const assigneeId = typeof task.assignedTo === "object" ? task.assignedTo._id : task.assignedTo;
    const matchesMember = filterMember === "all" || assigneeId === filterMember;

    return matchesSearch && matchesMember;
  });

  // Group active (non-deleted) filtered tasks by status for the board
  const activeTasks = filteredTasks.filter((t) => !t.isDeleted);
  const backlogTasks = activeTasks.filter((t) => t.status === "backlog");
  const pendingTasks = activeTasks.filter((t) => t.status === "pending");
  const completedTasks = activeTasks.filter((t) => t.status === "completed");

  // Filter tasks for History Tab (applies additional Status filter)
  const filteredHistoryTasks = filteredTasks.filter((task) => {
    let matchesStatus = true;
    if (filterStatus !== "all") {
      if (filterStatus === "deleted") {
        matchesStatus = !!task.isDeleted;
      } else {
        matchesStatus = !task.isDeleted && task.status === filterStatus;
      }
    }
    return matchesStatus;
  });

  const renderTaskCard = (task: TeamTask) => {
    const assignee = typeof task.assignedTo === "object" ? task.assignedTo : null;
    const assigneeName = assignee ? assignee.name : "Unassigned";

    return (
      <Card key={task._id} className="border border-border/80 bg-background shadow-sm hover:shadow-md transition-all duration-200 group">
        <CardContent className="p-4 space-y-3.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm text-foreground leading-tight tracking-tight break-words flex-1 group-hover:text-[#fd6102] transition-colors">
              {task.title}
            </h4>
            <Badge variant="outline" className={`capitalize font-bold text-[10px] py-0 px-2 shrink-0 ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground/95 leading-relaxed line-clamp-3 whitespace-pre-wrap">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-border/40 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-foreground/80">
              <div className="h-5 w-5 rounded-full bg-[#fd6102]/10 border border-[#fd6102]/20 flex items-center justify-center text-[#fd6102] font-bold text-[10px]">
                {assigneeName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[100px]">{assigneeName}</span>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/20">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(task._id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            
            <div className="flex items-center gap-1">
              {task.status !== "backlog" && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleMoveStatus(task, task.status === "completed" ? "pending" : "backlog")}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md cursor-pointer hover:bg-muted"
                  title="Move status back"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
              )}
              {task.status !== "completed" && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleMoveStatus(task, task.status === "backlog" ? "pending" : "completed")}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md cursor-pointer hover:bg-muted"
                  title="Move status forward"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="w-full space-y-6 p-6">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Task Board</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage custom tasks, assign them to members, track status, and organize backlog sprints.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="h-10 gap-2 font-semibold text-white bg-[var(--button-secondary)] hover:opacity-90">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Shared Search & Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-card p-4 rounded-xl border border-border/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title or desc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-muted/10 border-input"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="member-filter" className="text-xs font-semibold whitespace-nowrap text-muted-foreground">Assignee:</Label>
            <Select onValueChange={setFilterMember} value={filterMember}>
              <SelectTrigger id="member-filter" className="h-10 w-[160px] bg-muted/10 border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">All Assignees</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeTab === "history" && (
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter" className="text-xs font-semibold whitespace-nowrap text-muted-foreground">Status:</Label>
              <Select onValueChange={setFilterStatus} value={filterStatus}>
                <SelectTrigger id="status-filter" className="h-10 w-[140px] bg-muted/10 border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="pending">In-Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex border-b border-border gap-2">
        <button 
          onClick={() => setActiveTab("board")} 
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === "board" ? "border-[#fd6102] text-[#fd6102]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <Kanban className="h-4 w-4" />
          <span>Active Board ({activeTasks.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab("history")} 
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === "history" ? "border-[#fd6102] text-[#fd6102]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <History className="h-4 w-4" />
          <span>Task History ({tasks.filter(t => t.isDeleted || t.status === "completed").length})</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Loading task board...</p>
        </div>
      ) : activeTab === "board" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Backlog Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-muted-foreground/60" />
                <h3 className="font-bold text-foreground text-md">Backlog</h3>
              </div>
              <Badge variant="secondary" className="font-bold text-xs bg-muted/65 text-muted-foreground px-2 py-0.5 rounded-md">
                {backlogTasks.length}
              </Badge>
            </div>
            <div className="space-y-3.5 min-h-[300px] p-3 rounded-xl bg-muted/20 border border-border/40">
              {backlogTasks.length > 0 ? (
                backlogTasks.map(renderTaskCard)
              ) : (
                <p className="py-12 text-center text-xs text-muted-foreground/75 italic">No tasks match filter.</p>
              )}
            </div>
          </div>

          {/* Pending / In-Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-foreground text-md">Pending / In-Progress</h3>
              </div>
              <Badge className="font-bold text-xs bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-md">
                {pendingTasks.length}
              </Badge>
            </div>
            <div className="space-y-3.5 min-h-[300px] p-3 rounded-xl bg-muted/20 border border-border/40">
              {pendingTasks.length > 0 ? (
                pendingTasks.map(renderTaskCard)
              ) : (
                <p className="py-12 text-center text-xs text-muted-foreground/75 italic">No pending tasks match filter.</p>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <h3 className="font-bold text-foreground text-md">Completed</h3>
              </div>
              <Badge className="font-bold text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                {completedTasks.length}
              </Badge>
            </div>
            <div className="space-y-3.5 min-h-[300px] p-3 rounded-xl bg-muted/20 border border-border/40">
              {completedTasks.length > 0 ? (
                completedTasks.map(renderTaskCard)
              ) : (
                <p className="py-12 text-center text-xs text-muted-foreground/75 italic">No completed tasks match filter.</p>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* History View */
        <div className="space-y-6">
          {/* History List Table */}
          <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="font-bold text-foreground">Task Title</TableHead>
                  <TableHead className="font-bold text-foreground">Assignee</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="font-bold text-foreground">Priority</TableHead>
                  <TableHead className="font-bold text-foreground">Due Date</TableHead>
                  <TableHead className="text-right font-bold text-foreground pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistoryTasks.length > 0 ? (
                  filteredHistoryTasks.map((task) => {
                    const assignee = typeof task.assignedTo === "object" ? task.assignedTo : null;
                    const assigneeName = assignee ? assignee.name : "Unassigned";

                    return (
                      <TableRow key={task._id} className="border-b border-border/80 hover:bg-muted/20 transition-colors">
                        <TableCell className="py-4">
                          <div>
                            <div className="font-semibold text-sm text-foreground">{task.title}</div>
                            {task.description && (
                              <div className="text-xs text-muted-foreground/80 mt-0.5 line-clamp-1">{task.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#fd6102]/10 border border-[#fd6102]/20 flex items-center justify-center text-[#fd6102] font-bold text-[10px]">
                              {assigneeName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium">{assigneeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {task.isDeleted ? (
                            <Badge className="bg-red-500/10 text-red-600 border border-red-500/20 rounded-full font-bold px-2.5 py-0.5 text-xs">
                              Deleted
                            </Badge>
                          ) : task.status === "completed" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full font-bold px-2.5 py-0.5 text-xs">
                              Completed
                            </Badge>
                          ) : task.status === "pending" ? (
                            <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full font-bold px-2.5 py-0.5 text-xs">
                              In-Progress
                            </Badge>
                          ) : (
                            <Badge className="bg-muted text-muted-foreground border border-border rounded-full font-bold px-2.5 py-0.5 text-xs">
                              Backlog
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize font-bold text-[10px] py-0 px-2 shrink-0 ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {task.dueDate ? (
                            <span>{new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          ) : (
                            <span>—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {task.isDeleted ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(task)}
                              className="h-8 gap-1 font-semibold text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-700 cursor-pointer"
                              title="Restore task to board"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Restore</span>
                            </Button>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {task.status !== "backlog" && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleMoveStatus(task, task.status === "completed" ? "pending" : "backlog")}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md cursor-pointer hover:bg-muted"
                                  title="Move status back"
                                >
                                  <ArrowLeft className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {task.status !== "completed" && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleMoveStatus(task, task.status === "backlog" ? "pending" : "completed")}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md cursor-pointer hover:bg-muted"
                                  title="Move status forward"
                                >
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(task._id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
                                title="Delete task"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No tasks found in history matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Create Task Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[450px] bg-card border border-border">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">Create Team Task</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Assign a custom task to a team member and set the initial board column.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="task-title" className="text-sm font-semibold">Task Title *</Label>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design UI prototypes"
                  required
                  className="bg-muted/10 border-input h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="task-desc" className="text-sm font-semibold">Description</Label>
                <Textarea
                  id="task-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide task specs, constraints, or instructions..."
                  rows={3}
                  className="bg-muted/10 border-input resize-none"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="task-assignee" className="text-sm font-semibold">Assignee *</Label>
                <Select onValueChange={setAssignedTo} value={assignedTo}>
                  <SelectTrigger className="h-10 bg-muted/10 border-input">
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {members.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="task-priority" className="text-sm font-semibold">Priority</Label>
                  <Select onValueChange={(val) => setPriority(val as any)} defaultValue={priority}>
                    <SelectTrigger className="h-10 bg-muted/10 border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="task-status" className="text-sm font-semibold">Initial Stage</Label>
                  <Select onValueChange={(val) => setStatus(val as any)} defaultValue={status}>
                    <SelectTrigger className="h-10 bg-muted/10 border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="task-duedate" className="text-sm font-semibold">Due Date</Label>
                <Input
                  id="task-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-muted/10 border-input h-10"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSubmitting} className="h-10 font-semibold cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-10 px-6 font-semibold text-white bg-[var(--button-secondary)] hover:opacity-90">
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </main>
  );
}
