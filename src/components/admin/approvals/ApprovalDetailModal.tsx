"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/date-utils";

interface EntityApproval {
    id: string;
    entity: {
        id: string;
        name: string;
        country: string;
        legalForm: string;
        createdAt: string;
        registrationNumber?: string;
        taxId?: string;
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

interface ApprovalDetailModalProps {
    approval: EntityApproval;
    isOpen: boolean;
    onClose: () => void;
    onApprove: (entityId: string) => void;
    onReject: (entityId: string, reason: string) => void;
}

export function ApprovalDetailModal({
    approval,
    isOpen,
    onClose,
    onApprove,
    onReject,
}: ApprovalDetailModalProps) {
    const handleReject = () => {
        const reason = prompt("Please provide a rejection reason:");
        if (reason) {
            onReject(approval.entity.id, reason);
            onClose();
        }
    };

    const handleApprove = () => {
        onApprove(approval.entity.id);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Business Details</DialogTitle>
                    <DialogDescription>
                        Review the business information before approving or rejecting
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Business Information */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Business Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Name</label>
                                <p className="font-medium">{approval.entity.name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Country</label>
                                <p className="font-medium">{approval.entity.country}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Legal Form</label>
                                <p className="font-medium">{approval.entity.legalForm || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Registration Number</label>
                                <p className="font-medium">{approval.entity.registrationNumber || "Pending"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Tax ID</label>
                                <p className="font-medium">{approval.entity.taxId || "Pending"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Created</label>
                                <p className="font-medium">{formatDate(approval.entity.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Requester Information */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Requester Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Name</label>
                                <p className="font-medium">{approval.requester.name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Email</label>
                                <p className="font-medium">{approval.requester.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Approval Status */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Approval Status</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Status</label>
                                <div className="mt-1">
                                    <Badge
                                        className={
                                            approval.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : approval.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                        }
                                    >
                                        {approval.status}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Submitted</label>
                                <p className="font-medium">{formatDate(approval.submittedAt)}</p>
                            </div>
                            {approval.reviewedAt && (
                                <div>
                                    <label className="text-sm text-muted-foreground">Reviewed</label>
                                    <p className="font-medium">{formatDate(approval.reviewedAt)}</p>
                                </div>
                            )}
                            {approval.rejectionReason && (
                                <div className="col-span-2">
                                    <label className="text-sm text-muted-foreground">Rejection Reason</label>
                                    <p className="font-medium text-red-600">{approval.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {approval.status === "PENDING" && (
                        <>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                className="gap-2"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject
                            </Button>
                            <Button onClick={handleApprove} className="gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Approve
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
