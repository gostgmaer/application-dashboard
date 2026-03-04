"use client";
interface Proposal {
	id: string;
	name: string;
	email: string;
	status: "new" | "reviewing" | "contacted" | "quoted" | "negotiating" | "accepted" | "rejected" | "completed" | "cancelled";
	inquiryNumber: string | number;
	priority: string;
	projectType?: string;
	budget?: string;
	timeline?: string;
	company?: string;
	website?: string;
	templateName?: string;
}

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveHorizontal as MoreHorizontal, Mail, Copy, Pencil, Trash2, Lock, FileText } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, DataTableFilter } from "@/components/ui/data-table/data-Table-Client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import userServices from "@/lib/http/userService";
import { useModal } from "@/contexts/modal-context";
import Image from "next/image";
import { usePermissions } from "@/hooks/usePermissions";
import { toast, useToast } from "@/hooks/useToast";
import inquiryService from "@/lib/http/inqueryService";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { ProposalModalContent } from "./ProposalModal";
import { loadProposalTemplate, mapProposalData, extractStylesAndContent, formatInquiryNumber } from "@/lib/proposal/proposalService";

export function ProposalTable(props: any) {
	const { data: session } = useSession();
	const { showConfirm, showAlert, showCustom } = useModal();
	const { hasPermission } = usePermissions();
	const { toast } = useToast();

	const filters: DataTableFilter[] = [
		{
			id: "status",
			label: "Status",
			type: "select",
			options: [
				{ label: "New", value: "new" },
				{ label: "Reviewing", value: "reviewing" },
				{ label: "Contacted", value: "contacted" },
				{ label: "Quoted", value: "quoted" },
				{ label: "Negotiating", value: "negotiating" },
				{ label: "Accepted", value: "accepted" },
				{ label: "Rejected", value: "rejected" },
				{ label: "Completed", value: "completed" },
				{ label: "Cancelled", value: "cancelled" },
			],
		},
	];

	const deleteRequest = async (id: any) => {
		const req = await inquiryService.archiveInquiry(id, session?.accessToken);
		req.success && toast({ title: "Proposal Deleted", description: "The proposal has been deleted successfully." });
	};

	const handleDelete = async (data: any) => {
		const confirmed = await showConfirm({
			title: "Delete Item",
			description: "Are you sure you want to delete this item? This action cannot be undone.",
			confirmText: "Delete",
			cancelText: "Cancel",
			variant: "destructive",
			onConfirm: async () => {
				deleteRequest(data.id);
			},
		});
	};

	const handleOpenProposal = async (proposal: Proposal) => {
		try {
			toast({
				title: "Loading Proposal...",
				description: "Please wait while we prepare the proposal.",
			});

			// Load the template (use templateName from backend or default to static_basic)
			const templateName = proposal.templateName || "static_basic";
			const template = await loadProposalTemplate(templateName);

			// Map the data to the template
			const mappedHtml = mapProposalData(template, proposal);

			// Extract styles and content from the HTML
			const { styles, content } = extractStylesAndContent(mappedHtml);

			// Use the existing modal system
			showCustom({
				title: "",
				className: "!max-w-7xl w-6xl",
				content: (
					<ProposalModalContent
						proposalData={proposal}
						htmlTemplate={content}
						htmlStyles={styles}
						token={session?.accessToken}
						onClose={() => {}}
					/>
				),
			});
		} catch (error) {
			console.error("Error loading proposal:", error);
			toast({
				title: "Error",
				description: "Failed to load proposal template",
				variant: "destructive",
			});
		}
	};

	const handleExport = (rows: Proposal[]) => {
		console.log("Exporting proposals:", rows);
	};

	const columns: ColumnDef<Proposal>[] = [
		{
			accessorKey: "inquiryNumber",
			header: "Proposal #",
			cell: ({ row }) => {
				const inquiryNumber = row.getValue("inquiryNumber") as string;
				return (
					<div className='font-mono text-sm font-semibold text-primary'>
						{formatInquiryNumber(inquiryNumber)}
					</div>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => {
				return <div className='font-medium flex items-center gap-2'>{row.getValue("name")}</div>;
			},
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => (
				<div className='flex items-center gap-2'>
					<Link
						href={`mailto:${row.getValue("email")}`}
						className='flex items-center gap-2'>
						<Mail className='h-4 w-4 text-muted-foreground' />
						<span>{row.getValue("email")}</span>
					</Link>
				</div>
			),
		},

		{
			accessorKey: "projectType",
			header: "Project Type",
			cell: ({ row }) => {
				const projectType = row.getValue("projectType") as string;
				return <Badge variant='outline'>{projectType}</Badge>;
			},
		},
		{
			accessorKey: "budget",
			header: "Budget",
			cell: ({ row }) => {
				const budget = row.getValue("budget") as string;
				return <div>{budget}</div>;
			},
		},
		{
			accessorKey: "timeline",
			header: "Timeline",
			cell: ({ row }) => {
				const timeline = row.getValue("timeline") as string;
				return <div>{timeline}</div>;
			},
		},
		{
			accessorKey: "company",
			header: "Company",
			cell: ({ row }) => {
				const company = row.getValue("company") as string;
				return <div>{company}</div>;
			},
		},
		{
			accessorKey: "createdAt",
			header: "Recived",
			cell: ({ row }) => {
				const date = new Date(row.getValue("createdAt"));
				return <div>{date.toLocaleString()}</div>;
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue("status") as string;
				const getStatusVariant = (status: string) => {
					switch (status) {
						case "new":
							return "default";
						case "reviewing":
							return "secondary";
						case "contacted":
							return "outline";
						case "quoted":
							return "outline";
						case "negotiating":
							return "secondary";
						case "accepted":
							return "default";
						case "rejected":
							return "destructive";
						case "completed":
							return "default";
						case "cancelled":
							return "destructive";
						default:
							return "outline";
					}
				};
				return (
					<Badge variant={getStatusVariant(status)}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</Badge>
				);
			},
		},
		{
			id: "actions",

			cell: ({ row }) => {
				const user = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>

							<DropdownMenuItem onClick={() => handleOpenProposal(user)}>
								<FileText className='mr-2 h-4 w-4 text-green-600 dark:text-green-400' />
								Open Proposal
							</DropdownMenuItem>

							{hasPermission("user:delete") && (
								<DropdownMenuItem
									className='text-red-500'
									onClick={() => handleDelete(user)}>
									<Trash2 className='mr-2 h-4 w-4' />
									Remove
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
	return (
		<div className='space-y-4'>
			<>
				<Breadcrumbs
					heading={"Proposal Dashboard"}
					btn={{ show: false }}></Breadcrumbs>

				<div className='rounded-md border  p-4   shadow-sm overflow-auto max-h-screen'>
					<DataTable
						columns={columns}
						endpoint='/inquiry'
						token={session?.accessToken}
						filters={filters}
						enableRowSelection={true}
						enableMultiRowSelection={true}
						onExport={handleExport}
						//   pageSize={10}
						refreshInterval={3000000}
						searchPlaceholder='Search by name, email...'
						emptyMessage='No proposals found.'
					/>
				</div>
			</>
		</div>
	);
}
