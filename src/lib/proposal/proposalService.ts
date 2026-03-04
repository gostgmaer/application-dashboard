import { fetchData } from "@/lib/http";
import html2pdf from "html2pdf.js";

/**
 * Format inquiry number with pattern: PROP-YYYYMM-XXXX
 * Example: PROP-202603-0001 (March 2026, inquiry #1)
 */
export function formatInquiryNumber(inquiryNumber: number | string): string {
	if (!inquiryNumber) return "N/A";
	
	const num = typeof inquiryNumber === 'string' ? parseInt(inquiryNumber) : inquiryNumber;
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const paddedNum = num.toString().padStart(4, '0');
	
	return `PROP-${year}${month}-${paddedNum}`;
}

/**
 * Map proposal data to HTML template placeholders
 */
export function mapProposalData(htmlTemplate: string, proposalData: any): string {
	const mapping: Record<string, string> = {
		"{date}": new Date().toLocaleDateString("en-IN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}),
		"{number}": formatInquiryNumber(proposalData.inquiryNumber),
		"{company}": proposalData.company || "N/A",
		"{client}": proposalData.name || "N/A",
		"{email}": proposalData.email || "N/A",
		"{projectType}": proposalData.projectType || "N/A",
		"{budget}": proposalData.budget || "N/A",
		"{timeline}": proposalData.timeline || "N/A",
		"{website}": proposalData.website || "N/A",
	};

	let mappedHtml = htmlTemplate;

	// Replace all placeholders with actual data
	Object.entries(mapping).forEach(([placeholder, value]) => {
		const regex = new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g");
		mappedHtml = mappedHtml.replace(regex, value);
	});

	return mappedHtml;
}

/**
 * Extract styles and body content from HTML template
 */
export function extractStylesAndContent(html: string): { styles: string; content: string } {
	// Extract style tag content
	const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
	const styles = styleMatch ? styleMatch[1] : "";

	// Extract body content
	const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
	const content = bodyMatch ? bodyMatch[1] : html;

	return { styles, content };
}

/**
 * Generate PDF from HTML template
 */
export async function generateProposalPDF(htmlContent: string, proposalData: any): Promise<Blob> {
	try {
		// Create a temporary container for the HTML
		const element = document.createElement("div");
		element.innerHTML = htmlContent;
		
		// A4 dimensions: 210mm x 297mm
		// With 10mm margins on each side: 190mm usable width
		// Convert to pixels: 190mm ≈ 718px at 96dpi
		element.style.width = "190mm";
		element.style.maxWidth = "190mm";
		element.style.padding = "0";
		element.style.margin = "0";
		element.style.background = "white";
		element.style.boxSizing = "border-box";
		element.style.overflow = "visible";
		
		document.body.appendChild(element);

		// PDF options
		const formattedNumber = formatInquiryNumber(proposalData.inquiryNumber);
		const options = {
			margin: [10, 10, 10, 10] as [number, number, number, number], // top, right, bottom, left in mm
			filename: `Proposal_${formattedNumber}_${proposalData.company || "Document"}.pdf`,
			image: { type: "jpeg" as const, quality: 0.98 },
			html2canvas: {
				scale: 2,
				useCORS: true,
				letterRendering: true,
				windowWidth: 794, // A4 width in pixels (210mm at 96dpi) minus margins
				scrollY: 0,
				scrollX: 0,
			},
			jsPDF: {
				unit: "mm" as const,
				format: "a4" as const,
				orientation: "portrait" as const,
				compress: true,
			},
			pagebreak: {
				mode: ['avoid-all', 'css', 'legacy'],
			},
		};

		// Generate PDF
		const pdf = await html2pdf().set(options).from(element).outputPdf("blob");

		// Clean up
		document.body.removeChild(element);

		return pdf;
	} catch (error) {
		console.error("Error generating PDF:", error);
		throw new Error("Failed to generate PDF");
	}
}

/**
 * Upload PDF to server
 */
export async function uploadProposalPDF(
	pdfBlob: Blob,
	proposalData: any,
	token?: string
): Promise<any> {
	try {
		const formData = new FormData();
		const formattedNumber = formatInquiryNumber(proposalData.inquiryNumber);
		const fileName = `Proposal_${formattedNumber}_${proposalData.company || "Document"}_${Date.now()}.pdf`;

		formData.append("files", pdfBlob, fileName);
		formData.append("description", `Proposal document for ${proposalData.company || "inquiry"} - ${formattedNumber}`);
		formData.append("tags", "proposal");
		formData.append("tags", formattedNumber);
		
		// Additional metadata in custom field
		const customMetadata = {
			category: "proposal",
			uploadedBy: proposalData.userId || "system",
			relatedEntity: "inquiry",
			relatedEntityId: proposalData.id,
			proposalNumber: formattedNumber,
		};
		formData.append("custom", JSON.stringify(customMetadata));

		const response = await fetchData("/files/upload", {
			method: "POST",
			body: formData,
			token,
		});

		if (!response.success) {
			throw new Error(response.error || "Upload failed");
		}

		return response;
	} catch (error) {
		console.error("Error uploading PDF:", error);
		throw new Error("Failed to upload PDF");
	}
}

/**
 * Send proposal email with PDF URL
 */
export async function sendProposalEmail(data: {
	proposalId: string;
	pdfUrl: string;
	recipientEmail: string;
	recipientName: string;
	token?: string;
}): Promise<any> {
	try {
		const response = await fetchData("/inquiry/send-proposal", {
			method: "POST",
			body: {
				proposalId: data.proposalId,
				pdfUrl: data.pdfUrl,
				recipientEmail: data.recipientEmail,
				recipientName: data.recipientName,
			},
			token: data.token,
		});

		if (!response.success) {
			throw new Error(response.error || "Failed to send email");
		}

		return response;
	} catch (error) {
		console.error("Error sending proposal email:", error);
		throw new Error("Failed to send proposal email");
	}
}

/**
 * Load HTML template from file
 */
export async function loadProposalTemplate(templateName: string = "static_basic"): Promise<string> {
	try {
		const response = await fetch(`/data/docs/proposal/${templateName}.html`);
		if (!response.ok) {
			throw new Error("Failed to load template");
		}
		return await response.text();
	} catch (error) {
		console.error("Error loading template:", error);
		throw new Error("Failed to load proposal template");
	}
}
