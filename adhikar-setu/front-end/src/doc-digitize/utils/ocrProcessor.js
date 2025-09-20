// utils/ocrProcessor.js
import Tesseract from 'tesseract.js';

class OCRProcessor {
    constructor() {
        this.isInitialized = false;
        this.pdfjsVersion = '3.11.174';
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Wait for PDF.js to be loaded by DocumentViewer or load it ourselves
            await this.ensurePdfJsLoaded();
            this.isInitialized = true;
            console.log('OCR Processor initialized successfully');
        } catch (error) {
            console.error('OCR Initialization Error:', error);
            throw error;
        }
    }

    async ensurePdfJsLoaded() {
        return new Promise((resolve, reject) => {
            // Check if PDF.js is already loaded
            if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                resolve();
                return;
            }

            // If PDF.js is loaded but worker not set, set the worker
            if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.pdfjsVersion}/pdf.worker.min.js`;
                resolve();
                return;
            }

            // Load PDF.js if not already loaded
            const script = document.createElement('script');
            script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.pdfjsVersion}/pdf.min.js`;
            script.async = true;
            
            script.onload = () => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.pdfjsVersion}/pdf.worker.min.js`;
                    resolve();
                } else {
                    reject(new Error('PDF.js failed to load'));
                }
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load PDF.js script'));
            };
            
            document.head.appendChild(script);
        });
    }

    async convertPdfPageToImage(pdfFile, pageNum) {
        try {
            // Ensure PDF.js is loaded and ready
            if (!window.pdfjsLib) {
                throw new Error('PDF.js not loaded');
            }

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({
                data: arrayBuffer,
                cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.pdfjsVersion}/cmaps/`,
                cMapPacked: true,
            }).promise;
            
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
                canvasContext: context,
                viewport: viewport,
            }).promise;
            
            return canvas.toDataURL("image/png");
        } catch (error) {
            console.error("Error converting PDF to image:", error);
            throw error;
        }
    }

    async processImage(imageFile, onProgress = null) {
        try {
            console.log('Processing image:', imageFile.name);

            const result = await Tesseract.recognize(imageFile, "eng", {
                logger: onProgress ? (m) => {
                    if (m.status === 'recognizing text') {
                        onProgress(Math.round(m.progress * 100));
                    }
                } : undefined
            });

            const { data } = result;
            console.log('OCR Result Data:', data);
            
            return {
                text: data.text.trim(),
                confidence: data.confidence,
                words: data.words || [],
                lines: data.lines || [],
                success: true
            };
        } catch (error) {
            console.error('OCR Processing Error:', error);
            return {
                text: '',
                confidence: 0,
                words: [],
                lines: [],
                success: false,
                error: error.message
            };
        }
    }

    async processPdf(pdfFile, onProgress = null) {
        try {
            // Ensure PDF.js is initialized
            if (!this.isInitialized) {
                await this.initialize();
            }

            console.log('Processing PDF:', pdfFile.name);

            // Double check PDF.js is ready
            if (!window.pdfjsLib || !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                throw new Error('PDF.js not properly initialized');
            }

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({
                data: arrayBuffer,
                cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.pdfjsVersion}/cmaps/`,
                cMapPacked: true,
            }).promise;
            
            const totalPages = pdf.numPages;
            let fullText = "";

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                if (onProgress) {
                    const pageProgress = ((pageNum - 1) / totalPages) * 100;
                    onProgress(Math.floor(pageProgress));
                }

                const imageUrl = await this.convertPdfPageToImage(pdfFile, pageNum);
                
                const result = await Tesseract.recognize(imageUrl, "eng", {
                    logger: onProgress ? (m) => {
                        if (m.status === "recognizing text") {
                            const pageProgress = ((pageNum - 1) / totalPages) * 100;
                            const recognitionProgress = (m.progress / totalPages) * 100;
                            onProgress(Math.floor(pageProgress + recognitionProgress));
                        }
                    } : undefined
                });
                
                fullText += result.data.text + "\n\n--- Page Break ---\n\n";
            }
            
            return {
                text: fullText.trim(),
                confidence: 85, // Average confidence for PDF OCR
                words: [],
                lines: [],
                success: true,
                totalPages: totalPages
            };
        } catch (error) {
            console.error('PDF Processing Error:', error);
            return {
                text: '',
                confidence: 0,
                words: [],
                lines: [],
                success: false,
                error: error.message
            };
        }
    }

    async processMultiplePages(files, onProgress = null) {
        const results = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            let result;
            if (file.type === "application/pdf") {
                result = await this.processPdf(file, (progress) => {
                    if (onProgress) {
                        const overallProgress = ((i / files.length) * 100) + (progress / files.length);
                        onProgress(Math.round(overallProgress));
                    }
                });
            } else {
                result = await this.processImage(file, (progress) => {
                    if (onProgress) {
                        const overallProgress = ((i / files.length) * 100) + (progress / files.length);
                        onProgress(Math.round(overallProgress));
                    }
                });
            }
            
            results.push({
                pageNumber: i + 1,
                fileName: file.name,
                ...result
            });
        }
        
        return results;
    }

    // Extract structured data from OCR text
    extractStructuredData(ocrText) {
        if (!ocrText || typeof ocrText !== 'string') {
            return {};
        }

        const extractedData = {};
        const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        // Common patterns for FRA forms
        const patterns = {
            name: /(?:name|nama|नाम)[\s:]*(.+)/i,
            fatherName: /(?:father|पिता|पिता का नाम|father's name)[\s:]*(.+)/i,
            village: /(?:village|गांव|ग्राम)[\s:]*(.+)/i,
            district: /(?:district|जिला)[\s:]*(.+)/i,
            tehsil: /(?:tehsil|तहसील)[\s:]*(.+)/i,
            gramPanchayat: /(?:gram panchayat|ग्राम पंचायत)[\s:]*(.+)/i,
            scheduledTribe: /(?:scheduled tribe|अनुसूचित जनजाति)[\s:]*(.+)/i,
            area: /(?:area|क्षेत्रफल|hectare|हेक्टेयर)[\s:]*([0-9.]+)/i,
            extentForHabitation: /(?:extent.*habitation|निवास.*क्षेत्र)[\s:]*([0-9.]+)/i,
            extentForCultivation: /(?:extent.*cultivation|खेती.*क्षेत्र)[\s:]*([0-9.]+)/i,
            date: /([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/g,
        };

        lines.forEach(line => {
            Object.entries(patterns).forEach(([key, pattern]) => {
                const match = line.match(pattern);
                if (match && match[1]) {
                    if (key === 'date') {
                        // Handle multiple dates
                        const dates = [...line.matchAll(pattern)];
                        if (dates.length > 0) {
                            extractedData[key] = dates.map(d => d[1]);
                        }
                    } else {
                        extractedData[key] = match[1].trim();
                    }
                }
            });
        });

        return extractedData;
    }
}

export const ocrProcessor = new OCRProcessor();