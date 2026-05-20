interface BaseFinalResponse {
	status?: number;
	headers?: Record<string, string>;
}

interface JsonFinalResponse extends BaseFinalResponse {
	payload: unknown;
}

interface FileFinalResponse extends BaseFinalResponse {
	file: string;
}

interface ErrorFinalResponse extends BaseFinalResponse {
	error: string;
}

interface HtmlFinalResponse extends BaseFinalResponse {
	html: string;
}

export type FinalResponse = JsonFinalResponse | FileFinalResponse | ErrorFinalResponse | HtmlFinalResponse;
