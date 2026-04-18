import { render, screen, fireEvent, getByTestId } from "@testing-library/react";
import ImageWithFallback from "../components/ImageWithFallback.jsx";
import { vi, describe, test, expect } from "vitest";
import { FALLBACK_IMAGES } from "../data/product";

// Mock Test
vi.mock('../data/product.js', () => ({
    FALLBACK_IMAGES: {
        sneakers: 'collection.jpg',
        default: 'default.jpg' 
    },
}));

describe('ImageWithFallback - full fallback chain', () => {
    test('falls through entire chain correctly', () =>{
        render(
            <ImageWithFallback src='bad.jpg' fallbackSrc='fallback.jpg' collection='sneakers' alt='product'/>
        );
        const img = screen.getByAltText('product');
        expect(img.src).toContain('bad.jpg');
        fireEvent.error(img);
        expect(img.src).toContain('fallback.jpg')
        fireEvent.error(img);
        expect(img.src).toContain('collection.jpg');
        fireEvent.error(img)
        expect(img.src).toContain('data:image/svg+xml');
    })
    test('shows skeleton before load and hides after load', () => {
        const { rerender } = render(
            <ImageWithFallback src='img.jpg' fallbackSrc='fallback.jpg' alt='img'/>
        );
        const img = screen.getByAltText('img');
        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
        fireEvent.error(img)
        expect(img.src).toContain('fallback.jpg');
        fireEvent.load(img);
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    })
    test('reset index and loading state when src changes', () => {
        const { rerender } = render(
            <ImageWithFallback src='bad-1.jpg' alt='product'/>
        );
        const img = screen.getByAltText('product');
        fireEvent.error(img)
        expect(img.src).not.toContain('bad-1.jpg')
        rerender(
            <ImageWithFallback src='new-image.jpg' alt='product'/>
        );
        expect(img.src).toContain('new-image.jpg');
        expect(screen.getByTestId('skeleton')).toBeInTheDocument(); 
    })
    test('renders correc emoji in SVG data-url based on collection', () => {
        render(
            <ImageWithFallback src='bad.jpg' collection='wristwatches' alt='watch'/>
        );
        const img = screen.getByAltText('watch');
        fireEvent.error(img)
        fireEvent.error(img);
        expect(img.src).toContain('%E2%8C%9A');
    })
    test('uses default labels unknown collections', () => {
        render(
            <ImageWithFallback src='bad.jpg' collection='unknown-category' alt='default-test'/>
        );
        const img = screen.getByAltText('default-test');
        fireEvent.error(img)
        expect(img.src).toContain('default.jpg');
        fireEvent.error(img);
        expect(img.src).toContain('%F0%9F%93%A6');
    })
})