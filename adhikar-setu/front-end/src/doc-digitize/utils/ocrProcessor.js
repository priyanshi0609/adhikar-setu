// utils/ocrProcessor.js
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

class OCRProcessor {
    constructor() {
        this.isInitialized = false;
        this.pdfjsVersion = '3.11.174';
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Initialize PDF.js worker
            const pdfjsWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.pdfjsVersion}/pdf.worker.min.js`;
            
            // Create a script element for PDF.js worker
            const script = document.createElement('script');
            script.src = pdfjsWorkerSrc;
            script.async = true;
            
            script.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;
                this.isInitialized = true;
                console.log('OCR Processor initialized successfully');
            };
            
            document.body.appendChild(script);
            
        } catch (error) {
            console.error('OCR Initialization Error:', error);
            throw error;
        }
    }

    async convertPdfPageToImage(pdfFile, pageNum) {
        try {
            const fileReader = new FileReader();
            
            return new Promise((resolve, reject) => {
                fileReader.onload = async function() {
                    const typedArray = new Uint8Array(this.result);
                    try {
                        const pdf = await pdfjsLib.getDocument(typedArray).promise;
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
                        
                        resolve(canvas.toDataURL("image/png"));
                    } catch (error) {
                        reject(error);
                    }
                };
                
                fileReader.readAsArrayBuffer(pdfFile);
            });
        } catch (error) {
            console.error("Error converting PDF to image:", error);
            throw error;
        }
    }

    async processImage(imageFile, onProgress = null) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

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
            if (!this.isInitialized) {
                await this.initialize();
            }

            console.log('Processing PDF:', pdfFile.name);

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({
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