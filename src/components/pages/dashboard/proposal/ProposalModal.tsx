"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { generateProposalPDF, uploadProposalPDF, sendProposalEmail, formatInquiryNumber } from "@/lib/proposal/proposalService";

interface ProposalModalContentProps {
	proposalData: any;
	htmlTemplate: string;
	htmlStyles: string;
	token?: string;
	onClose: () => void;
	onSuccess?: () => void;
}

export function ProposalModalContent({ proposalData, htmlTemplate, htmlStyles, token, onClose, onSuccess }: ProposalModalContentProps) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const { toast } = useToast();

	const handleEndProposal = async () => {
		try {
			setIsGenerating(true);
			toast({
				title: "Generating PDF...",
				description: "Please wait while we generate your proposal.",
			});

			// Step 1: Generate PDF - reconstruct full HTML with styles
			const fullHtml = `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<style>${htmlStyles}</style>
				</head>
				<body>${htmlTemplate}</body>
				</html>
			`;
			const pdfBlob = await generateProposalPDF(fullHtml, proposalData);

			// Step 2: Upload PDF to server
			const uploadResponse = await uploadProposalPDF(pdfBlob, proposalData, token);

			if (!uploadResponse.success || !uploadResponse.data || uploadResponse.data.length === 0) {
				throw new Error("Failed to upload PDF");
			}

			// Step 3: Send email with PDF URL
			setIsSending(true);
			const emailResponse = await sendProposalEmail({
				proposalId: proposalData.id,
				pdfUrl: uploadResponse.data[0].url,
				recipientEmail: proposalData.email,
				recipientName: proposalData.name,
				token,
			});

			if (!emailResponse.success) {
				throw new Error("Failed to send email");
			}

			toast({
				title: "Success!",
				description: "Proposal has been generated and sent via email.",
			});

			// Call success callback to refresh table
			if (onSuccess) {
				onSuccess();
			}

			// Close the modal
			onClose();
		} catch (error) {
			console.error("Error ending proposal:", error);
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Failed to process proposal",
				variant: "destructive",
			});
		} finally {
			setIsGenerating(false);
			setIsSending(false);
		}
	};

	const handleDownload = async () => {
		try {
			toast({
				title: "Downloading PDF...",
				description: "Your download will start shortly.",
			});

			// Reconstruct full HTML with styles
			const fullHtml = `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<style>${htmlStyles}</style>
				</head>
				<body>${htmlTemplate}</body>
				</html>
			`;
			const pdfBlob = await generateProposalPDF(fullHtml, proposalData);

			// Create download link
			const url = window.URL.createObjectURL(pdfBlob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `Proposal_${formatInquiryNumber(proposalData.inquiryNumber)}_${proposalData.company || "Document"}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toast({
				title: "Downloaded!",
				description: "Proposal PDF has been downloaded successfully.",
			});
		} catch (error) {
			console.error("Error downloading proposal:", error);
			toast({
				title: "Error",
				description: "Failed to download PDF",
				variant: "destructive",
			});
		}
	};

	return (
		<div className='flex flex-col h-full max-h-[85vh]'>
			<style dangerouslySetInnerHTML={{ __html: htmlStyles }} />
			<div className='mb-4'>
				<h3 className='text-lg font-semibold'>
					Proposal Preview - <span className='font-mono text-primary'>{formatInquiryNumber(proposalData?.inquiryNumber)}</span>
				</h3>
				<p className='text-sm text-muted-foreground'>Review and send the proposal to {proposalData?.name}</p>
			</div>

			<ScrollArea className='flex-1 w-full rounded-md border p-4 mb-4 bg-white'>
				<div
					className='proposal-content'
					dangerouslySetInnerHTML={{ __html: htmlTemplate }}
				/>
			</ScrollArea>

			<div className='flex justify-end gap-2 pt-4 border-t'>
				<Button
					variant='outline'
					onClick={handleDownload}
					disabled={isGenerating || isSending}>
					<Download className='mr-2 h-4 w-4' />
					Download PDF
				</Button>
				<Button
					variant='default'
					onClick={handleEndProposal}
					disabled={isGenerating || isSending}>
					{isGenerating || isSending ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							{isGenerating && "Generating..."}
							{isSending && !isGenerating && "Sending..."}
						</>
					) : (
						<>
							<Mail className='mr-2 h-4 w-4' />
							End Proposal & Send Email
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
