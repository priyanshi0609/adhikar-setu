// utils/ocrProcessor.js
import { createWorker } from 'tesseract.js';

class OCRProcessor {
    constructor() {
        this.worker = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized && this.worker) return;
        
        try {
            this.worker = await createWorker('eng+hin', 1, {
                logger: m => console.log('Tesseract:', m)
            });
            
            // Set parameters after worker is created
            await this.worker.setParameters({
                tessedit_page_seg_mode: '1',
                tessedit_ocr_engine_mode: '2',
            });
            
            this.isInitialized = true;
            console.log('OCR Worker initialized successfully');
        } catch (error) {
            console.error('OCR Initialization Error:', error);
            throw error;
        }
    }

    async processImage(imageFile, onProgress = null) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            console.log('Processing image:', imageFile.name);

            const result = await this.worker.recognize(imageFile, {
                logger: onProgress ? (m) => {
                    if (m.status === 'recognizing text') {
                        onProgress(Math.round(m.progress * 100));
                    }
                } : undefined
            });

            const { data } = result;
            
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

    async processMultiplePages(files, onProgress = null) {
        const results = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            const pageProgress = (pageNum) => {
                if (onProgress) {
                    const overallProgress = ((i / files.length) * 100) + ((pageNum / 100) / files.length);
                    onProgress(Math.round(overallProgress));
                }
            };

            const result = await this.processImage(file, pageProgress);
            results.push({
                pageNumber: i + 1,
                fileName: file.name,
                ...result
            });
        }
        
        return results;
    }

    async terminate() {
        if (this.worker) {
            try {
                await this.worker.terminate();
            } catch (error) {
                console.error('Error terminating worker:', error);
            } finally {
                this.worker = null;
                this.isInitialized = false;
            }
        }
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