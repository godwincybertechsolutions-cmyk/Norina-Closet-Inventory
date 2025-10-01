import React, { useState, useCallback } from 'react';
import { InventoryItem } from '../types';
import { generateInventoryInsights } from '../services/geminiService';

interface GeminiInsightsProps {
    data: InventoryItem[];
}

const GeminiInsights: React.FC<GeminiInsightsProps> = ({ data }) => {
    const [insights, setInsights] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateInsights = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateInventoryInsights(data);
            setInsights(result);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [data]);

    const formattedInsights = insights
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-accent-gold">$1</strong>')
        .replace(/\n/g, '<br />')
        .replace(/(\d+\.\s)/g, '<br /><strong>$1</strong>');

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-text-primary">AI-Powered Insights</h2>
            
            {!insights && !isLoading && (
                 <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-accent/30 rounded-lg">
                    <p className="text-text-secondary mb-4">Click the button to get AI-driven analysis of your inventory data.</p>
                 </div>
            )}
            
            {isLoading && (
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-gold"></div>
                </div>
            )}

            {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}

            {insights && !isLoading && (
                <div 
                    className="prose prose-invert prose-sm max-w-none text-text-secondary space-y-2 flex-grow overflow-y-auto p-4 bg-accent/30 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: formattedInsights }}
                />
            )}
            
            <button
                onClick={handleGenerateInsights}
                disabled={isLoading}
                className="mt-4 w-full bg-accent-gold hover:bg-yellow-500 disabled:bg-gray-500 text-primary font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                {isLoading ? 'Generating...' : 'Generate Insights'}
            </button>
        </div>
    );
};

export default GeminiInsights;