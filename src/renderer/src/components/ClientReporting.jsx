import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./ui/table";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
const mockTickets = [
    {
        id: "TKT-001",
        pcName: "PC-A3",
        lab: "Lab A",
        issue: "Hardware Failure",
        description: "Monitor not displaying output",
        priority: "high",
        status: "in-progress",
        reportedAt: "2026-05-03 09:30",
    },
    {
        id: "TKT-002",
        pcName: "PC-B4",
        lab: "Lab B",
        issue: "Software Issue",
        description: "AutoCAD crashes on startup",
        priority: "medium",
        status: "open",
        reportedAt: "2026-05-03 10:15",
    },
    {
        id: "TKT-003",
        pcName: "PC-A5",
        lab: "Lab A",
        issue: "Peripheral",
        description: "Keyboard keys not responsive",
        priority: "low",
        status: "resolved",
        reportedAt: "2026-05-02 14:20",
    },
];
export function ClientReporting() {
    const [tickets, setTickets] = useState(mockTickets);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const getPriorityBadge = (priority) => {
        const variants = {
            low: "bg-muted text-muted-foreground",
            medium: "bg-warning text-warning-foreground",
            high: "bg-destructive text-destructive-foreground",
        };
        return variants[priority];
    };
    const getStatusBadge = (status) => {
        const variants = {
            open: "bg-warning text-warning-foreground",
            "in-progress": "bg-primary text-primary-foreground",
            resolved: "bg-success text-success-foreground",
        };
        return variants[status];
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "open":
                return <AlertCircle className="w-4 h-4"/>;
            case "in-progress":
                return <Clock className="w-4 h-4"/>;
            case "resolved":
                return <CheckCircle className="w-4 h-4"/>;
        }
    };
    const handleSubmitTicket = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Ticket submitted successfully!");
        }, 1000);
    };
    const openTickets = tickets.filter((t) => t.status === "open").length;
    const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length;
    const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;
    return (<div className="p-6 space-y-6">
      <div>
        <h1 className="mb-2">Issue Reporting System</h1>
        <p className="text-muted-foreground">Report PC issues and track ticket status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning"/>
              <span className="text-2xl">{openTickets}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary"/>
              <span className="text-2xl">{inProgressTickets}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success"/>
              <span className="text-2xl">{resolvedTickets}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report New Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>PC Name</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PC"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pc-a1">PC-A1</SelectItem>
                    <SelectItem value="pc-a2">PC-A2</SelectItem>
                    <SelectItem value="pc-b1">PC-B1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Issue Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware Failure</SelectItem>
                    <SelectItem value="software">Software Issue</SelectItem>
                    <SelectItem value="peripheral">Peripheral</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the issue in detail..." rows={4} required/>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>PC</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (<TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.pcName}</TableCell>
                    <TableCell>
                      <div>
                        <div>{ticket.issue}</div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(ticket.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.reportedAt}</TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);
}
