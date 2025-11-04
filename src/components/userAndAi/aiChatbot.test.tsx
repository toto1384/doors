import React from "react";
import { useConversation } from "utils/hooks/mockElevenlabsHook";
import { describe, expect, it, vi } from "vitest";



vi.mock('@elevenlabs/react', async (original) => {
    const originalImport: any = await original();


    return {
        ...originalImport,
        useConversation: vi.fn(useConversation({ flow: 'buyer' })),
    };
});


describe('AI Chatbot', () => {
    it('should render the AI Chatbot component', () => {


    });
});

