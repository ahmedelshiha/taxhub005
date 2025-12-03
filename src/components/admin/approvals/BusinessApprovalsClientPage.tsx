"use client";

import { useState } from "react";
import useSWR from "swr";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/lib/api-client";
import { formatDate } from "@/lib/date-utils";
import { useToast } from "@/hooks/use-toast";
import { ApprovalDetailModal } from "./ApprovalDetailModal";

interface EntityApproval {
    id: string;
    entity: {
        id: string;
        name: string;
        country: string;
        legalForm: string;
        createdAt: string;
    };
    requester: {
        name: string;
        email: string;
    };
    status: string;
    submittedAt: string;
    reviewedAt?: string;
    rejectionReason?: string;
}

export default function BusinessApprovalsClientPage() {
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [selectedApproval, setSelectedApproval] = useState<EntityApproval | null>(null);
    const { toast } = useToast();

    const { data, error, isLoading, mutate } = useSWR(
        `/api/admin/entities/pending?status=${statusFilter}`,
        fetcher
    );

    const approvals = data?.data?.approvals || [];

    const handleApprove = async (entityId: string) => {
        try {
            const response = await fetch(`/api/admin/entities/${entityId}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: "Approved by admin" }),
            });

            if (!response.ok) throw new Error("Failed to approve");

            toast({
                title: "Business Approved",
                description: "The business has been approved successfully.",
            });

            mutate();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve business. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleReject = async (entityId: string, reason: string) => {
        try {
            const response = await fetch(`/api/admin/entities/${entityId}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });

            if (!response.ok) throw new Error("Failed to reject");

            toast({
                title: "Business Rejected",
                description: "The business has been rejected.",
            });

            mutate();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject business. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-red-600">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                            <p className="text-lg font-medium">Error loading approvals</p>
                            <p className="text-sm text-muted-foreground">{error.message}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Business Approvals</h1>
                    <p className="text-muted-foreground">
                        Review and manage pending business submissions
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="w-64">
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                    <SelectItem value="REQUIRES_CHANGES">Requires Changes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Approvals List */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            {isLoading ? "Loading..." : `${approvals.length} Approvals`}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-12">
                            <Clock className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Loading approvals...</p>
                        </div>
                    ) : approvals.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">
                                No approvals found for the selected filter
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {approvals.map((approval: EntityApproval) => (
                                <div
                                    key={approval.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg">
                                                    {approval.entity.name}
                                                </h3>
                                                <StatusBadge status={approval.status} />
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground block">Client</span>
                                                    <span className="font-medium">{approval.requester.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground block">Country</span>
                                                    <span className="font-medium">{approval.entity.country}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground block">Legal Form</span>
                                                    <span className="font-medium">{approval.entity.legalForm || "N/A"}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground block">Submitted</span>
                                                    <span className="font-medium">{formatDate(approval.submittedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedApproval(approval)}
                                            >
                                                View Details
                                            </Button>
                                            {approval.status === "PENDING" && (
                                                <>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => handleApprove(approval.entity.id)}
                                                        className="gap-1"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            const reason = prompt("Rejection reason:");
                                                            if (reason) handleReject(approval.entity.id, reason);
                                                        }}
                                                        className="gap-1"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Modal */}
            {selectedApproval && (
                <ApprovalDetailModal
                    approval={selectedApproval}
                    isOpen={!!selectedApproval}
                    onClose={() => setSelectedApproval(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config = {
        PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
        APPROVED: { label: "Approved", className: "bg-green-100 text-green-700" },
        REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700" },
        REQUIRES_CHANGES: { label: "Requires Changes", className: "bg-orange-100 text-orange-700" },
    }[status] || { label: status, className: "bg-gray-100 text-gray-700" };

    return <Badge className={config.className}>{config.label}</Badge>;
}
