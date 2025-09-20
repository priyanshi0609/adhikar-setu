import { useState, useRef, useEffect } from "react";

const DocumentViewer = ({ documents, currentPage, onPageChange }) => {
  const [scale, setScale] = useState(1);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfPageNum, setPdfPageNum] = useState(1);
  const [pdfNumPages, setPdfNumPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setScale(1);

  // Load PDF.js when component mounts
  useEffect(() => {
    const loadPdfJs = async () => {
      if (window.pdfjsLib) return;

      // Load PDF.js from CDN
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      };
      document.head.appendChild(script);
    };

    loadPdfJs();
  }, []);

  // Load PDF document
  useEffect(() => {
    const currentDoc = documents?.[currentPage];
    if (currentDoc?.type === "application/pdf" && window.pdfjsLib) {
      loadPDF(currentDoc);
    } else {
      setPdfDoc(null);
      setPdfPageNum(1);
      setPdfNumPages(0);
    }
  }, [documents, currentPage]);

  // Render PDF page when document, page, or scale changes
  useEffect(() => {
    if (pdfDoc) {
      renderPDFPage();
    }
  }, [pdfDoc, pdfPageNum, scale]);

  const loadPDF = async (file) => {
    if (!window.pdfjsLib) return;

    setPdfLoading(true);
    setPdfError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      setPdfDoc(pdf);
      setPdfNumPages(pdf.numPages);
      setPdfPageNum(1);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setPdfError("Failed to load PDF document");
    } finally {
      setPdfLoading(false);
    }
  };

  const renderPDFPage = async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pdfPageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error("Error rendering PDF page:", error);
      setPdfError("Failed to render PDF page");
    }
  };

  const handlePdfPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pdfNumPages) {
      setPdfPageNum(newPage);
    }
  };

  const renderDocument = (document) => {
    if (!document) return null;

    // Handle different file types
    if (document.type?.startsWith("image/")) {
      return (
        <div className="flex justify-center items-center min-h-96">
          <img
            src={URL.createObjectURL(document)}
            alt={`Document page ${currentPage + 1}`}
            className="max-w-full h-auto shadow-lg rounded-lg"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
            }}
            onLoad={(e) => {
              // Revoke object URL to prevent memory leaks
              setTimeout(() => URL.revokeObjectURL(e.target.src), 1000);
            }}
          />
        </div>
      );
    } else if (document.type === "application/pdf") {
      if (!window.pdfjsLib) {
        return (
          <div className="flex flex-col items-center justify-center min-h-96 p-8 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600">Loading PDF viewer...</p>
          </div>
        );
      }

      if (pdfLoading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-96 p-8 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600">Loading PDF document...</p>
          </div>
        );
      }

      if (pdfError) {
        return (
          <div className="flex flex-col items-center justify-center min-h-96 p-8 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Error Loading PDF</p>
            <p className="text-gray-500 text-sm">{pdfError}</p>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center min-h-96">
          <canvas
            ref={canvasRef}
            className="shadow-lg rounded-lg max-w-full h-auto"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center top",
            }}
          />

          {/* PDF Page Navigation */}
          {pdfNumPages > 1 && (
            <div className="flex items-center space-x-4 mt-4 bg-white px-4 py-2 rounded-lg shadow-sm border">
              <button
                onClick={() => handlePdfPageChange(pdfPageNum - 1)}
                disabled={pdfPageNum <= 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <span className="text-sm text-gray-600">
                Page {pdfPageNum} of {pdfNumPages}
              </span>

              <button
                onClick={() => handlePdfPageChange(pdfPageNum + 1)}
                disabled={pdfPageNum >= pdfNumPages}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-96 p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Unsupported file format</p>
      </div>
    );
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-full min-h-96">
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="w-16 h-16 text-gray-400 mb-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Documents Uploaded
          </h3>
          <p className="text-gray-600 text-center">
            Upload your FRA documents to view them here
          </p>
        </div>
      </div>
    );
  }

  const currentDocument = documents[currentPage];
  const isPDF = currentDocument?.type === "application/pdf";

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Document Preview
          </h3>
          <span className="text-sm text-gray-500">
            {currentPage + 1} of {documents.length}
            {isPDF && pdfNumPages > 0 && (
              <span className="ml-2">
                (PDF Page {pdfPageNum} of {pdfNumPages})
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>

          <span className="text-sm text-gray-600 min-w-12 text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>

          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50" ref={viewerRef}>
        <div className="w-full h-full">
          {renderDocument(documents[currentPage])}
        </div>
      </div>

      {/* Navigation */}
      {documents.length > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="flex space-x-1">
            {documents.map((_, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  index === currentPage
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => onPageChange(index)}
                title={`Page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === documents.length - 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
