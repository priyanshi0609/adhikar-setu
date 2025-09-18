// utils/ocrProcessor.js
import { createWorker } from 'tesseract.js';

class OCRProcessor {
    constructor() {
        this.worker = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        this.worker = await createWorker();
        await this.worker.loadLanguage('eng+hin');
        await this.worker.initialize('eng+hin');
        await this.worker.setParameters({
            tessedit_page_seg_mode: '1',
            tessedit_ocr_engine_mode: '2',
        });

        this.isInitialized = true;
    }

    async processImage(imageFile, onProgress = null) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const { data: { text, confidence, words, lines } } = await this.worker.recognize(
                imageFile,
                {
                    logger: onProgress ? (m) => {
                        if (m.status === 'recognizing text') {
                            onProgress(Math.round(m.progress * 100));
                        }
                    } : undefined
                }
            );

            return {
                text: text.trim(),
                confidence,
                words: words || [],
                lines: lines || [],
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
                    const overallProgress = ((i / files.length) * 100) + ((pageNum / files.length) / 100);
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
            await this.worker.terminate();
            this.worker = null;
            this.isInitialized = false;
        }
    }

    // Extract structured data from OCR text
    extractStructuredData(ocrText) {
        const extractedData = {};
        const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        // Common patterns for FRA forms
        const patterns = {
            name: /(?:name|nama|नाम)[\s:]*(.+)/i,
            father: /(?:father|पिता|पिता का नाम)[\s:]*(.+)/i,
            village: /(?:village|गांव|ग्राम)[\s:]*(.+)/i,
            district: /(?:district|जिला)[\s:]*(.+)/i,
            tehsil: /(?:tehsil|तहसील)[\s:]*(.+)/i,
            gramPanchayat: /(?:gram panchayat|ग्राम पंचायत)[\s:]*(.+)/i,
            scheduledTribe: /(?:scheduled tribe|अनुसूचित जनजाति)[\s:]*(.+)/i,
            area: /(?:area|क्षेत्रफल|hectare|हेक्टेयर)[\s:]*([0-9.]+)/i,
            date: /([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/g,
        };

        lines.forEach(line => {
            Object.entries(patterns).forEach(([key, pattern]) => {
                const match = line.match(pattern);
                if (match && match[1]) {
                    extractedData[key] = match[1].trim();
                }
            });
        });

        return extractedData;
    }
}

export const ocrProcessor = new OCRProcessor();