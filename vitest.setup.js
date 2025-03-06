import { vi } from 'vitest';
import '@testing-library/jest-dom';

globalThis.sessionStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
};