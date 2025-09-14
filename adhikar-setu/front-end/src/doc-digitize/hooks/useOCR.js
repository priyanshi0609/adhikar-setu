// hooks/useOCR.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { ocrProcessor } from '../utils/ocrProcessor.js';
import { FieldExtractor } from '../utils/fieldExtractor.js';

export const useOCR = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [extractedFields, setExtractedFields] = useState({});
    const [formType, setFormType] = useState(null);
    const [error, setError] = useState(null);
    const processingRef = useRef(false);

    const processDocuments = useCallback(async (files) => {
        if (processingRef.current || !files || files.length === 0) return;

        processingRef.current = true;
        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setResults([]);

        try {
            const fileArray = Array.from(files);
            const ocrResults = await ocrProcessor.processMultiplePages(
                fileArray,
                (progressValue) => setProgress(progressValue)
            );

            setResults(ocrResults);

            // Combine all OCR text for field extraction
            const combinedText = ocrResults
                .filter(result => result.success)
                .map(result => result.text)
                .join('\n\n');

            if (combinedText.trim()) {
                // Detect form type
                const detectedFormType = FieldExtractor.detectFormType(combinedText);
                setFormType(detectedFormType);

                // Extract fields
                const fields = FieldExtractor.extractFieldsFromOCR(combinedText, detectedFormType);
                setExtractedFields(fields);
            }

        } catch (err) {
            console.error('OCR processing failed:', err);
            setError(err.message || 'Failed to process documents');
        } finally {
            setIsProcessing(false);
            setProgress(100);
            processingRef.current = false;
        }
    }, []);

    const updateField = useCallback((fieldKey, value) => {
        setExtractedFields(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    }, []);

    const resetOCR = useCallback(() => {
        setResults([]);
        setExtractedFields({});
        setFormType(null);
        setProgress(0);
        setError(null);
        setIsProcessing(false);
    }, []);

    const reprocessWithFormType = useCallback((newFormType) => {
        if (results.length > 0) {
            const combinedText = results
                .filter(result => result.success)
                .map(result => result.text)
                .join('\n\n');

            if (combinedText.trim()) {
                setFormType(newFormType);
                const fields = FieldExtractor.extractFieldsFromOCR(combinedText, newFormType);
                setExtractedFields(fields);
            }
        }
    }, [results]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            ocrProcessor.terminate();
        };
    }, []);

    return {
        isProcessing,
        progress,
        results,
        extractedFields,
        formType,
        error,
        processDocuments,
        updateField,
        resetOCR,
        reprocessWithFormType
    };
};